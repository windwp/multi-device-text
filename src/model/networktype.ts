export const CLOSE = 'CLOSE';
export const NETWORK_CREATE_ROOM = 'NETWORK_CREATE_ROOM';
export const NETWORK_JOIN_ROOM = 'NETWORK_JOIN_ROOM';
export const NETWORK_START = 'NETWORK_START';
export const NETWORK_PAUSE = 'NETWORK_PAUSE';
export const NETWORK_UPDATE = 'NETWORK_UPDATE';
export type NetworkModelType =
    | typeof CLOSE
    | typeof NETWORK_JOIN_ROOM
    | typeof NETWORK_CREATE_ROOM
    | typeof NETWORK_UPDATE
    | typeof NETWORK_PAUSE
    | typeof NETWORK_START;