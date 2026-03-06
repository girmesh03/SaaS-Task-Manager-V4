import { useSyncExternalStore } from "react";

import {
  getSocketStatusSnapshot,
  subscribeSocketStatus,
} from "../api/socketClient";

/**
 * Reads the live socket connection status from the singleton client.
 *
 * @returns {{ isConnected: boolean, lastConnectedAt: string | null, lastDisconnectedAt: string | null, lastErrorAt: string | null }} Socket snapshot.
 * @throws {never} This hook does not throw.
 */
export const useSocketStatus = () =>
  useSyncExternalStore(subscribeSocketStatus, getSocketStatusSnapshot);
