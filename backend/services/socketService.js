import { getSocket } from "../config/socket.js";
import { SOCKET_ROOM_PREFIXES } from "../utils/constants.js";

const room = (prefix, id) => `${prefix}:${id}`;

/**
 * Returns the canonical per-user room name.
 *
 * @param {string} userRef - User id.
 * @returns {string} Room name.
 * @throws {never} This helper does not throw.
 */
export const getUserRoom = (userRef) => room(SOCKET_ROOM_PREFIXES.USER, userRef);

/**
 * Returns the canonical per-organization room name.
 *
 * @param {string} organizationRef - Organization id.
 * @returns {string} Room name.
 * @throws {never} This helper does not throw.
 */
export const getOrganizationRoom = (organizationRef) =>
  room(SOCKET_ROOM_PREFIXES.ORGANIZATION, organizationRef);

/**
 * Returns the canonical per-department room name.
 *
 * @param {string} departmentRef - Department id.
 * @returns {string} Room name.
 * @throws {never} This helper does not throw.
 */
export const getDepartmentRoom = (departmentRef) =>
  room(SOCKET_ROOM_PREFIXES.DEPARTMENT, departmentRef);

/**
 * Emits an event to a single user room.
 *
 * @param {string} userRef - User id.
 * @param {string} eventName - Socket event name.
 * @param {Record<string, unknown>} payload - Event payload.
 * @returns {void}
 * @throws {Error} Propagates socket lookup failures.
 */
export const emitToUser = (userRef, eventName, payload) => {
  getSocket().to(getUserRoom(userRef)).emit(eventName, payload);
};

/**
 * Emits an event to an organization room.
 *
 * @param {string} organizationRef - Organization id.
 * @param {string} eventName - Socket event name.
 * @param {Record<string, unknown>} payload - Event payload.
 * @returns {void}
 * @throws {Error} Propagates socket lookup failures.
 */
export const emitToOrganization = (organizationRef, eventName, payload) => {
  getSocket().to(getOrganizationRoom(organizationRef)).emit(eventName, payload);
};

/**
 * Emits an event to a department room.
 *
 * @param {string} departmentRef - Department id.
 * @param {string} eventName - Socket event name.
 * @param {Record<string, unknown>} payload - Event payload.
 * @returns {void}
 * @throws {Error} Propagates socket lookup failures.
 */
export const emitToDepartment = (departmentRef, eventName, payload) => {
  getSocket().to(getDepartmentRoom(departmentRef)).emit(eventName, payload);
};
