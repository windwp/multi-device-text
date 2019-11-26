import { Action, Store } from "redux";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { ajaxGet, ajaxPost } from "rxjs/internal/observable/dom/AjaxObservable";
import { of } from "rxjs/internal/observable/of";
import { catchError, debounceTime, delay, filter, ignoreElements, map, switchMap, tap } from "rxjs/operators";
import { asyncActionCreature } from "../../../common/redux-utils";
import { randomString } from "../../../common/utils";
import ENV from "../../../enviroment";
import { createUpdateConfigPacket, NetworkModel, RootState } from "../../../model/dataModel";
import * as NetworkModelType from "../../../model/networktype";
import store from "../../../state/store";
import { errorEvents, pauseRoom, startRoom, updateConfigRequestRoom, updateState } from "./room-create.action";
import * as RoomActionType from "./room-create.action-types";

const basicGetRequestEpic =
    (beginType: string, doneHandler: (arg0: any) => void, errorHandler: (arg0: any) => void) => {
        return (action$: ActionsObservable<any>) => action$.pipe(
            ofType(beginType),
            switchMap(action => ajaxGet(action.payload.url, {}).pipe(
                map(response => doneHandler(response.response)),
                catchError(error => {
                    return of(errorHandler(error.xhr.response)
                    );
                })
            ))
        )
    }
const basicPostRequestEpic =
    (beginType: string, doneHandler: (data: any) => Action, errorHandler: (error: any) => Action) => {
        return (action$: ActionsObservable<any>) => action$.pipe(
            ofType(beginType),
            switchMap(action => ajaxPost(action.payload.url, action.payload.data, { 'Content-Type': 'application/json' }).pipe(
                map(response => doneHandler(response.response)),
                catchError(error => of(errorHandler(error.xhr.response)))
            ))
        )
    }
const roomCreateRequestEpic = asyncActionCreature(RoomActionType.CREATE_REQUEST_ROOM, basicPostRequestEpic);
const roomJoinRequestEpic = asyncActionCreature(RoomActionType.JOIN_REQUEST_ROOM, basicPostRequestEpic);
const roomUpdateRequestEpic = asyncActionCreature(RoomActionType.UPDATE_REQUEST_ROOM, basicPostRequestEpic);
const sendStartRequestEpic = asyncActionCreature(RoomActionType.START_REQUEST_ROOM, basicPostRequestEpic);
const sendPauseRequestEpic = asyncActionCreature(RoomActionType.PAUSE_REQUEST_ROOM, basicPostRequestEpic);

const baseEventSourceHandler = (type: string) =>
    (action$: ActionsObservable<any>, state$: StateObservable<RootState>) => action$.pipe(
        ofType(type),
        delay(100),
        tap(() => {
            setupEventSource(
                {
                    url: `${ENV.urlEvent}?roomid=${state$.value.room.roomId}&deviceid=${state$.value.room.deviceId}&masterkey=${randomString(5)}`,
                    store: store
                });
        }),
        ignoreElements()
    );

const updateConfigHandler = (action$: ActionsObservable<any>, state$: StateObservable<RootState>) => action$.pipe(
    ofType(RoomActionType.UPDATE_CONFIG_STATE),
    debounceTime(5000),
    filter(() => state$.value.room.isMaster),
    map(() => {
        const packet = createUpdateConfigPacket(state$.value.room, NetworkModelType.NETWORK_UPDATE);
        return updateConfigRequestRoom(state$.value.room.roomId, state$.value.room.deviceId, packet)
    }
    ),
);

const eventSourceRoomCreateHandler = baseEventSourceHandler(RoomActionType.CREATE_REQUEST_ROOM_SUCCESS);
const eventSourceRoomJoinHandler = baseEventSourceHandler(RoomActionType.JOIN_REQUEST_ROOM_SUCCESS);

export const setupEventSource = ({ url, store }: { url: string, store: Store }) => {
    let eventSource = new EventSource(url);
    eventSource.onerror = (event) => {
        console.log("event source error", event)
        console.log((event.currentTarget as any).readyState)
        if ((event.currentTarget as any).readyState === 2) {
            store.dispatch(errorEvents(event));
        }
        // eventSource = null;
    };
    eventSource.onmessage = event => {
        try {
            const packet: NetworkModel = JSON.parse(event.data);
            console.log(':packet ', packet)
            if (packet.listDevice) {
                packet.listDevice.sort((a, b) => a.position - b.position);
            }
            switch (packet.type) {
                case NetworkModelType.CLOSE:
                    eventSource.close();
                    eventSource = null;
                    store.dispatch(errorEvents(event));
                    break;
                case NetworkModelType.NETWORK_UPDATE:
                    if (packet.listDevice) {
                        store.dispatch(updateState({ listDevice: packet.listDevice }))
                    }
                    if (packet.config) {
                        store.dispatch(updateState({ config: packet.config }));
                    }
                    break;
                case NetworkModelType.NETWORK_START:

                    store.dispatch(startRoom(packet));
                    break;
                case NetworkModelType.NETWORK_PAUSE:
                    store.dispatch(pauseRoom({ isPause: packet.isPause }));
                    break;
            }
        } catch (err) {
            console.log(': Packet Parse Error ', event.data);
        }
    };
}
export default [
    roomCreateRequestEpic,
    roomJoinRequestEpic,
    roomUpdateRequestEpic,
    sendStartRequestEpic,
    sendPauseRequestEpic,
    updateConfigHandler,
    eventSourceRoomCreateHandler,
    eventSourceRoomJoinHandler
];