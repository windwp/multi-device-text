import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import roomReducer from '../pages/room-create/state/room-create.reducer';
import appReducer from './app.reducer';
import epic from './epic';
export const rootReducer = combineReducers({
    room: roomReducer,
    app: appReducer
});

export const rootEpic = combineEpics(...epic)

const epicMiddleware = createEpicMiddleware();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
function configureStore() {
    const store = createStore(
        rootReducer,
        composeEnhancers(
            applyMiddleware(epicMiddleware)
        )
    );
    epicMiddleware.run(rootEpic as any);

    return store;
}
const store = configureStore();

export default store;