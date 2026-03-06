import { parse as parseCookieHeader } from "cookie";
import { Server } from "socket.io";

import { getEnv } from "./env.js";
import { logger } from "./logger.js";
import { verifyAccessToken } from "../services/tokenService.js";
import {
  AUTH_COOKIE_NAMES,
  SOCKET_EVENT_NAMES,
  SOCKET_ROOM_PREFIXES,
} from "../utils/constants.js";

let ioInstance;
const presenceCounters = new Map();

const createRoomName = (prefix, id) => `${prefix}:${id}`;

const emitPresenceUpdate = (socket, actor, isOnline) => {
  const payload = {
    userId: actor.userId,
    organizationId: actor.organizationId,
    departmentId: actor.departmentId,
    isOnline,
    updatedAt: new Date().toISOString(),
  };

  socket
    .to(createRoomName(SOCKET_ROOM_PREFIXES.ORGANIZATION, actor.organizationId))
    .emit(SOCKET_EVENT_NAMES.PRESENCE_UPDATED, payload);

  if (actor.departmentId) {
    socket
      .to(createRoomName(SOCKET_ROOM_PREFIXES.DEPARTMENT, actor.departmentId))
      .emit(SOCKET_EVENT_NAMES.PRESENCE_UPDATED, payload);
  }
};

/**
 * Attaches the Socket.IO server to the HTTP server with shared auth rules.
 *
 * @param {import("http").Server} httpServer - HTTP server instance.
 * @returns {Server} Socket.IO server instance.
 * @throws {Error} Propagates server attachment failures.
 */
export const attachSocketServer = (httpServer) => {
  if (ioInstance) {
    return ioInstance;
  }

  const { CORS_ALLOWED_ORIGINS } = getEnv();

  ioInstance = new Server(httpServer, {
    cors: {
      origin: CORS_ALLOWED_ORIGINS,
      credentials: true,
    },
  });

  ioInstance.use((socket, next) => {
    try {
      const cookies = parseCookieHeader(socket.handshake.headers.cookie || "");
      const token = cookies[AUTH_COOKIE_NAMES.ACCESS_TOKEN];

      if (!token) {
        next(new Error("Authentication required."));
        return;
      }

      const claims = verifyAccessToken(token);

      socket.data.actor = {
        userId: String(claims.userId),
        organizationId: String(claims.organizationId),
        departmentId: claims.departmentId ? String(claims.departmentId) : null,
        role: String(claims.role),
        isHod: Boolean(claims.isHod),
        isPlatformOrgUser: Boolean(claims.isPlatformOrgUser),
      };

      next();
    } catch (error) {
      logger.warn("Socket authentication failed", {
        message: error instanceof Error ? error.message : "Unknown socket auth error",
      });
      next(new Error("Authentication required."));
    }
  });

  ioInstance.on("connection", (socket) => {
    const actor = socket.data.actor;
    const userRoom = createRoomName(SOCKET_ROOM_PREFIXES.USER, actor.userId);
    const orgRoom = createRoomName(
      SOCKET_ROOM_PREFIXES.ORGANIZATION,
      actor.organizationId
    );

    socket.join(userRoom);
    socket.join(orgRoom);

    if (actor.departmentId) {
      socket.join(
        createRoomName(SOCKET_ROOM_PREFIXES.DEPARTMENT, actor.departmentId)
      );
    }

    const nextCount = (presenceCounters.get(actor.userId) || 0) + 1;
    presenceCounters.set(actor.userId, nextCount);

    if (nextCount === 1) {
      emitPresenceUpdate(socket, actor, true);
    }

    logger.info("Socket client connected", {
      userId: actor.userId,
      requestId: socket.id,
    });

    socket.on("disconnect", () => {
      const currentCount = Math.max(
        (presenceCounters.get(actor.userId) || 1) - 1,
        0
      );

      if (currentCount === 0) {
        presenceCounters.delete(actor.userId);
        emitPresenceUpdate(socket, actor, false);
      } else {
        presenceCounters.set(actor.userId, currentCount);
      }

      logger.info("Socket client disconnected", {
        userId: actor.userId,
        requestId: socket.id,
      });
    });
  });

  return ioInstance;
};

/**
 * Returns the singleton Socket.IO server instance.
 *
 * @returns {Server} Socket.IO server instance.
 * @throws {Error} Thrown when the server has not been attached yet.
 */
export const getSocket = () => {
  if (!ioInstance) {
    throw new Error("Socket server has not been attached.");
  }

  return ioInstance;
};
