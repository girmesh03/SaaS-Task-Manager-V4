import mongoose from "mongoose";

import RefreshTokenSession from "../models/RefreshTokenSession.js";
import {
  createAccessToken,
  createCsrfToken,
  createRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "./tokenService.js";
import {
  API_MESSAGES,
  API_STATUS_CODES,
  ERROR_TYPES,
} from "../utils/constants.js";
import { createError } from "../utils/errorFactory.js";
import { runInTransaction } from "../utils/mongo.js";

const buildUserFromSession = (session) => ({
  _id: String(session.user),
  role: session.role,
  organization: {
    _id: String(session.organization),
  },
  department: session.department
    ? {
        _id: String(session.department),
      }
    : null,
  isHod: Boolean(session.isHod),
  isPlatformOrgUser: Boolean(session.isPlatformOrgUser),
});

/**
 * Rotates a refresh session and returns a fresh auth cookie payload.
 *
 * @param {{ refreshToken: string, actorIp?: string | null, actorUserAgent?: string | null }} options - Refresh inputs.
 * @returns {Promise<{ accessToken: string, refreshToken: string, csrfToken: string, user: Record<string, unknown> }>} Refreshed auth payload.
 * @throws {Error} Propagates invalid or expired refresh-session errors.
 */
export const refreshSession = async ({
  refreshToken,
  actorIp = null,
  actorUserAgent = null,
}) => {
  let claims;

  try {
    claims = verifyRefreshToken(refreshToken);
  } catch {
    throw createError({
      type: ERROR_TYPES.UNAUTHENTICATED_ERROR,
      statusCode: API_STATUS_CODES.UNAUTHORIZED,
      message: API_MESSAGES.REFRESH_TOKEN_EXPIRED,
      details: [],
    });
  }

  return runInTransaction(async (session) => {
    const tokenHash = hashToken(refreshToken);
    const currentSession = await RefreshTokenSession.findById(claims.session?._id)
      .select("+tokenHash")
      .session(session)
      .exec();

    if (!currentSession || currentSession.tokenHash !== tokenHash) {
      throw createError({
        type: ERROR_TYPES.UNAUTHENTICATED_ERROR,
        statusCode: API_STATUS_CODES.UNAUTHORIZED,
        message: API_MESSAGES.REFRESH_TOKEN_REUSED,
        details: [],
      });
    }

    if (
      currentSession.revokedAt ||
      currentSession.expiresAt.getTime() <= Date.now()
    ) {
      throw createError({
        type: ERROR_TYPES.UNAUTHENTICATED_ERROR,
        statusCode: API_STATUS_CODES.UNAUTHORIZED,
        message: API_MESSAGES.REFRESH_TOKEN_EXPIRED,
        details: [],
      });
    }

    const newSessionId = new mongoose.Types.ObjectId();
    const newRefreshToken = createRefreshToken({
      session: { _id: String(newSessionId) },
      user: { _id: String(currentSession.user) },
    });
    const newTokenHash = hashToken(newRefreshToken);

    await RefreshTokenSession.create(
      [
        {
          _id: newSessionId,
          user: currentSession.user,
          organization: currentSession.organization,
          department: currentSession.department,
          role: currentSession.role,
          isHod: currentSession.isHod,
          isPlatformOrgUser: currentSession.isPlatformOrgUser,
          tokenHash: newTokenHash,
          expiresAt: currentSession.expiresAt,
          ip: actorIp,
          userAgent: actorUserAgent,
          lastUsedAt: new Date(),
        },
      ],
      { session }
    );

    currentSession.revokedAt = new Date();
    currentSession.replacedBySession = newSessionId;
    currentSession.lastUsedAt = new Date();
    currentSession.ip = actorIp;
    currentSession.userAgent = actorUserAgent;
    await currentSession.save({ session });

    const user = buildUserFromSession(currentSession);

    return {
      accessToken: createAccessToken({
        user: { _id: user._id },
        organization: { _id: user.organization._id },
        department: user.department ? { _id: user.department._id } : null,
        role: user.role,
        isHod: user.isHod,
        isPlatformOrgUser: user.isPlatformOrgUser,
      }),
      refreshToken: newRefreshToken,
      csrfToken: createCsrfToken(),
      user,
    };
  });
};

/**
 * Revokes a refresh session if the provided refresh token is valid.
 *
 * @param {{ refreshToken?: string | null }} options - Logout inputs.
 * @returns {Promise<void>} Logout completion.
 * @throws {never} Logout is intentionally idempotent.
 */
export const logout = async ({ refreshToken }) => {
  if (!refreshToken) {
    return;
  }

  try {
    const claims = verifyRefreshToken(refreshToken);
    const session = await RefreshTokenSession.findById(claims.session?._id)
      .select("+tokenHash")
      .exec();

    if (!session) {
      return;
    }

    session.revokedAt = session.revokedAt || new Date();
    session.lastUsedAt = new Date();
    await session.save();
  } catch {
    return;
  }
};
