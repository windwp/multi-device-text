
export const TOGGLE_HEADER = "TOGGLE_HEADER";
interface ToggleAction {
    type: typeof TOGGLE_HEADER
    payload: boolean
}

export type AppAction = ToggleAction;
export const toggleHeader = (status: boolean): ToggleAction => ({
    type: TOGGLE_HEADER,
    payload: status
})