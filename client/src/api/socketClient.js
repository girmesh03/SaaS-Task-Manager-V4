import { io } from "socket.io-client";

const state = {
  isConnected: false,
  lastConnectedAt: null,
  lastDisconnectedAt: null,
  lastErrorAt: null,
};

const listeners = new Set();
let socket;

const notify = () => {
  listeners.forEach((listener) => listener());
};

const getSocketBaseUrl = () =>
  (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/api\/?$/, "");

const attachStatusListeners = (socketClient) => {
  socketClient.on("connect", () => {
    state.isConnected = true;
    state.lastConnectedAt = new Date().toISOString();
    notify();
  });

  socketClient.on("disconnect", () => {
    state.isConnected = false;
    state.lastDisconnectedAt = new Date().toISOString();
    notify();
  });

  socketClient.on("connect_error", () => {
    state.lastErrorAt = new Date().toISOString();
    notify();
  });
};

/**
 * Returns the singleton Socket.IO client.
 *
 * @returns {import("socket.io-client").Socket} Socket client singleton.
 * @throws {never} This helper does not throw.
 */
export const getSocketClient = () => {
  if (!socket) {
    socket = io(getSocketBaseUrl(), {
      withCredentials: true,
      autoConnect: false,
    });
    attachStatusListeners(socket);
  }

  return socket;
};

/**
 * Initiates a socket connection if needed.
 *
 * @returns {import("socket.io-client").Socket} Socket client.
 * @throws {never} This helper does not throw.
 */
export const connectSocket = () => {
  const socketClient = getSocketClient();

  if (!socketClient.connected) {
    socketClient.connect();
  }

  return socketClient;
};

/**
 * Disconnects the socket client.
 *
 * @returns {void}
 * @throws {never} This helper does not throw.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

/**
 * Subscribes to connection-state updates.
 *
 * @param {() => void} listener - External-store listener.
 * @returns {() => void} Unsubscribe callback.
 * @throws {never} This helper does not throw.
 */
export const subscribeSocketStatus = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Returns the current socket connection snapshot.
 *
 * @returns {{ isConnected: boolean, lastConnectedAt: string | null, lastDisconnectedAt: string | null, lastErrorAt: string | null }} Socket state snapshot.
 * @throws {never} This helper does not throw.
 */
export const getSocketStatusSnapshot = () => ({ ...state });

/**
 * Attaches a socket event listener and returns an unsubscribe callback.
 *
 * @param {string} eventName - Socket event name.
 * @param {(payload: unknown) => void} handler - Event handler.
 * @returns {() => void} Unsubscribe callback.
 * @throws {never} This helper does not throw.
 */
export const subscribeSocketEvent = (eventName, handler) => {
  const socketClient = getSocketClient();
  socketClient.on(eventName, handler);
  return () => socketClient.off(eventName, handler);
};
