import produce from "immer";
import { DeviceInformation, RoomState } from "../../../model/dataModel";
import * as RoomActionType from "./room-create.action-types";
const initialState: RoomState = {
    config: {
        textGradientColor: ["#50e3c2", "#b8e986"],
        message: "(づ｡◕‿‿◕｡)づ Hello World ✌.ʕʘ‿ʘʔ.✌         ",
        bgColor: "#0056bb",
    },
    roomId: '',
    numberDevice: 0,
    deviceId: '',
    isMaster: false,
    isStart: false,
    isPause: false,
    isDisconnect: false,
    roomStatus: '',
    roomEventSource: null,
    isError: false,
    errorMessage: '',
    listDevice: []
}


export const roomReducer = (
    state = initialState,
    action: { type: string, payload: any }
): RoomState => {
    switch (action.type) {
        case RoomActionType.UPDATE_CONFIG_STATE:
            return produce(state, draft => { draft.config = { ...draft.config, ...action.payload } });
        case RoomActionType.UPDATE_STATE:
            return { ...state, ...action.payload };
        case RoomActionType.ADD_DEVICE:
            {
                const device = action.payload.device as DeviceInformation;
                return produce(state, draft => {
                    device.position = draft.listDevice.length + 1;
                    draft.listDevice.push(device);
                });
            }
        case RoomActionType.REMOVE_DEVICE:
            {
                const device = action.payload as DeviceInformation;
                return produce(state, draft => {
                    draft.listDevice = draft.listDevice.filter(o => o.id !== device.id);
                });
            }
        case RoomActionType.UPDATE_DEVICE:
            {
                const device = action.payload as DeviceInformation;
                return produce(state, draft => {
                    const index = draft.listDevice.findIndex(o => o.id === device.id);
                    if (index > 0) draft.listDevice[index] = device;
                });
            }
        case RoomActionType.CREATE_REQUEST_ROOM_SUCCESS:
            return { ...state, ...{ isError: false, isDisconnect: false, isLoading: false, isMaster: true, deviceId: action.payload.deviceid } }
        case RoomActionType.JOIN_REQUEST_ROOM_SUCCESS:
            return { ...state, ...{ isError: false, isLoading: false, isDisconnect: false, deviceId: action.payload.deviceId } }
        case RoomActionType.CREATE_REQUEST_ROOM_ERROR:
        case RoomActionType.JOIN_REQUEST_ROOM_ERROR:
            return {
                ...state, isLoading: false,
                ...{
                    isError: true,
                    errorMessage: action.payload && action.payload.message ? action.payload.message : 'NetworkError'
                }
            }
        case RoomActionType.ERROR_EVENTS_ROOM:
            return { ...state, isDisconnect: true }
        case RoomActionType.PAUSE:
            return { ...state, isPause: action.payload.isPause };
        case RoomActionType.START:
            return { ...state, isPause: false, isStart: action.payload.isStart, config: action.payload.config, listDevice: action.payload.listDevice };
        default:
            return state;

    }
}

export default roomReducer;