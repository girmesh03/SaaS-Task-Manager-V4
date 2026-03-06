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

const buildActorFromSession = (session) => ({
  id: String(session.userId),
  role: session.role,
  organizationId: String(session.organizationId),
  departmentId: session.departmentId ? String(session.departmentId) : null,
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
    const currentSession = await RefreshTokenSession.findById(claims.sessionId)
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
      sessionId: String(newSessionId),
      userId: String(currentSession.userId),
    });
    const newTokenHash = hashToken(newRefreshToken);

    await RefreshTokenSession.create(
      [
        {
          _id: newSessionId,
          userId: currentSession.userId,
          organizationId: currentSession.organizationId,
          departmentId: currentSession.departmentId,
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
    currentSession.replacedBySessionId = newSessionId;
    currentSession.lastUsedAt = new Date();
    currentSession.ip = actorIp;
    currentSession.userAgent = actorUserAgent;
    await currentSession.save({ session });

    const user = buildActorFromSession(currentSession);

    return {
      accessToken: createAccessToken({
        userId: user.id,
        organizationId: user.organizationId,
        departmentId: user.departmentId,
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
    const session = await RefreshTokenSession.findById(claims.sessionId)
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
