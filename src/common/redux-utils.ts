import { Action } from "redux";

export const actionCreature = <T extends {}>(type: string): (payload: T) => { type: string, payload: T } => {
    return (payload: T) => ({
        type,
        payload
    })
}


export const asyncActionCreature =
    (
        typeAsyncBegin: string,
        asyncAction: (beginType: string, doneHandler: (data: any) => Action, errorHandler: (error: any) => Action) => void
    ) => {
        const typeAsyncSuccess = `${typeAsyncBegin}_SUCCESS`;
        const typeAsyncError = `${typeAsyncBegin}_ERROR`;
        const actionSuccess = actionCreature(typeAsyncSuccess)
        const actionError = actionCreature(typeAsyncError)

        return asyncAction(typeAsyncBegin, actionSuccess, actionError)
    }