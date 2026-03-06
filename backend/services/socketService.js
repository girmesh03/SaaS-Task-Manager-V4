import { getSocket } from "../config/socket.js";
import { SOCKET_ROOM_PREFIXES } from "../utils/constants.js";

const room = (prefix, id) => `${prefix}:${id}`;

/**
 * Returns the canonical per-user room name.
 *
 * @param {string} userId - User id.
 * @returns {string} Room name.
 * @throws {never} This helper does not throw.
 */
export const getUserRoom = (userId) => room(SOCKET_ROOM_PREFIXES.USER, userId);

/**
 * Returns the canonical per-organization room name.
 *
 * @param {string} organizationId - Organization id.
 * @returns {string} Room name.
 * @throws {never} This helper does not throw.
 */
export const getOrganizationRoom = (organizationId) =>
  room(SOCKET_ROOM_PREFIXES.ORGANIZATION, organizationId);

/**
 * Returns the canonical per-department room name.
 *
 * @param {string} departmentId - Department id.
 * @returns {string} Room name.
 * @throws {never} This helper does not throw.
 */
export const getDepartmentRoom = (departmentId) =>
  room(SOCKET_ROOM_PREFIXES.DEPARTMENT, departmentId);

/**
 * Emits an event to a single user room.
 *
 * @param {string} userId - User id.
 * @param {string} eventName - Socket event name.
 * @param {Record<string, unknown>} payload - Event payload.
 * @returns {void}
 * @throws {Error} Propagates socket lookup failures.
 */
export const emitToUser = (userId, eventName, payload) => {
  getSocket().to(getUserRoom(userId)).emit(eventName, payload);
};

/**
 * Emits an event to an organization room.
 *
 * @param {string} organizationId - Organization id.
 * @param {string} eventName - Socket event name.
 * @param {Record<string, unknown>} payload - Event payload.
 * @returns {void}
 * @throws {Error} Propagates socket lookup failures.
 */
export const emitToOrganization = (organizationId, eventName, payload) => {
  getSocket().to(getOrganizationRoom(organizationId)).emit(eventName, payload);
};

/**
 * Emits an event to a department room.
 *
 * @param {string} departmentId - Department id.
 * @param {string} eventName - Socket event name.
 * @param {Record<string, unknown>} payload - Event payload.
 * @returns {void}
 * @throws {Error} Propagates socket lookup failures.
 */
export const emitToDepartment = (departmentId, eventName, payload) => {
  getSocket().to(getDepartmentRoom(departmentId)).emit(eventName, payload);
};
