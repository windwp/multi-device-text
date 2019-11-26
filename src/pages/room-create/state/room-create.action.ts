import { actionCreature } from "../../../common/redux-utils";
import ENV from "../../../enviroment";
import { DeviceInformation, NetworkModel } from "../../../model/dataModel";
import * as RoomActionType from "./room-create.action-types";


export const addDevice = (device: DeviceInformation) => ({
    type: RoomActionType.ADD_DEVICE,
    payload: {
        device
    }
})
export const updateDevice = (device: DeviceInformation) => ({
    type: RoomActionType.UPDATE_DEVICE,
    payload: {
        device
    }
})
export const removeDevice = (device: DeviceInformation) => ({
    type: RoomActionType.REMOVE_DEVICE,
    payload: {
        device
    }
})

export const startRoom = actionCreature(RoomActionType.START);
export const pauseRoom = actionCreature(RoomActionType.PAUSE);

export const createRequestRoom = (roomId: string, deviceId: string = '') => ({
    type: RoomActionType.CREATE_REQUEST_ROOM,
    payload: {
        url: `${ENV.urlRoom}?roomid=${roomId}&action=create&deviceid=${deviceId}`,
        roomId,
    }
})
export const joinRequestRoom = (roomId: string, deviceId: string = '', data: NetworkModel) => ({
    type: RoomActionType.JOIN_REQUEST_ROOM,
    payload: {
        url: `${ENV.urlRoom}?roomid=${roomId}&action=join`,
        data,
    }
})
export const updateRequestRoom = (roomId: string, deviceId: string, data: NetworkModel) => ({
    type: RoomActionType.UPDATE_REQUEST_ROOM,
    payload: {
        url: `${ENV.urlRoom}?roomid=${roomId}&action=update&deviceid=${deviceId}`,
        data
    }
})
export const updateConfigRequestRoom = (roomId: string, deviceId: string, data: NetworkModel) => ({
    type: RoomActionType.UPDATE_REQUEST_ROOM,
    payload: {
        url: `${ENV.urlRoom}?roomid=${roomId}&action=updateconfig&deviceid=${deviceId}`,
        data
    }
})
export const sendStartRequestRoom = (roomId: string, deviceId: string, data: NetworkModel) => ({
    type: RoomActionType.START_REQUEST_ROOM,
    payload: {
        url: `${ENV.urlRoom}?roomid=${roomId}&action=start&deviceid=${deviceId}`,
        data
    }
})
export const sendPauseRequestRoom = (roomId: string, deviceId: string, data: NetworkModel) => ({
    type: RoomActionType.PAUSE_REQUEST_ROOM,
    payload: {
        url: `${ENV.urlRoom}?roomid=${roomId}&action=pause&deviceid=${deviceId}`,
        data
    }
})
export const messageEvents = actionCreature(RoomActionType.MESSAGE_EVENTS_ROOM);
export const errorEvents = actionCreature(RoomActionType.ERROR_EVENTS_ROOM);
export const updateState = actionCreature(RoomActionType.UPDATE_STATE);
export const updateConfigState = actionCreature(RoomActionType.UPDATE_CONFIG_STATE);

