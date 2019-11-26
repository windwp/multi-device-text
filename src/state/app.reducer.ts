import { AppAction, TOGGLE_HEADER } from "./app.action";

const INITIAL_STATE = {
    theme: {
        showHeader: true,
    }
};
const appReducer = (state = INITIAL_STATE, action: AppAction) => {
    switch (action.type) {
        case TOGGLE_HEADER:
            return {
                ...state, ...{ theme: { ...state.theme, showHeader: action.payload } }
            };
        default:
            return state;
    }
};
export default appReducer;