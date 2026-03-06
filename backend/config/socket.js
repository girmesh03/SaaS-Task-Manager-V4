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

const emitPresenceUpdate = (socket, user, isOnline) => {
  const payload = {
    user: {
      _id: user._id,
    },
    organization: {
      _id: user.organization._id,
    },
    department: user.department
      ? {
          _id: user.department._id,
        }
      : null,
    isOnline,
    updatedAt: new Date().toISOString(),
  };

  socket
    .to(createRoomName(SOCKET_ROOM_PREFIXES.ORGANIZATION, user.organization._id))
    .emit(SOCKET_EVENT_NAMES.PRESENCE_UPDATED, payload);

  if (user.department?._id) {
    socket
      .to(createRoomName(SOCKET_ROOM_PREFIXES.DEPARTMENT, user.department._id))
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

      if (!claims.user?._id || !claims.organization?._id) {
        next(new Error("Authentication required."));
        return;
      }

      socket.data.user = {
        _id: String(claims.user?._id),
        organization: {
          _id: String(claims.organization?._id),
        },
        department: claims.department?._id
          ? {
              _id: String(claims.department._id),
            }
          : null,
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
    const user = socket.data.user;
    const userRoom = createRoomName(SOCKET_ROOM_PREFIXES.USER, user._id);
    const orgRoom = createRoomName(
      SOCKET_ROOM_PREFIXES.ORGANIZATION,
      user.organization._id
    );

    socket.join(userRoom);
    socket.join(orgRoom);

    if (user.department?._id) {
      socket.join(
        createRoomName(SOCKET_ROOM_PREFIXES.DEPARTMENT, user.department._id)
      );
    }

    const nextCount = (presenceCounters.get(user._id) || 0) + 1;
    presenceCounters.set(user._id, nextCount);

    if (nextCount === 1) {
      emitPresenceUpdate(socket, user, true);
    }

    logger.info("Socket client connected", {
      user: { _id: user._id },
      requestId: socket.id,
    });

    socket.on("disconnect", () => {
      const currentCount = Math.max(
        (presenceCounters.get(user._id) || 1) - 1,
        0
      );

      if (currentCount === 0) {
        presenceCounters.delete(user._id);
        emitPresenceUpdate(socket, user, false);
      } else {
        presenceCounters.set(user._id, currentCount);
      }

      logger.info("Socket client disconnected", {
        user: { _id: user._id },
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
