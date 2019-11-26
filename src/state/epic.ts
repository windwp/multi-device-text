import { ActionsObservable } from 'redux-observable';
import { delay, filter, mapTo } from 'rxjs/operators';
import roomCreateEpic from '../pages/room-create/state/room-create.epic';
export const pingEpic = (action$: ActionsObservable<any>) => action$.pipe(
    filter(action => action.type === 'PING'),
    delay(1000), // Asynchronously wait 1000ms then continue
    mapTo({ type: 'PONG' })
);



export default [pingEpic, ...roomCreateEpic];