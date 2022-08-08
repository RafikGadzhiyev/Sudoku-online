import { Action } from "redux";
import { Difficulties } from "../../globalTypes";
import { IReduxStore } from "../store";

interface ActionWithPayload extends Action {
    payload: {
        difficulty?: Difficulties,
        board?: Array<Array<number>>
    }
}

export const MainReducer = (store: undefined | IReduxStore, action: ActionWithPayload): IReduxStore => {
    switch (action.type) {
        case "__INIT__":
            return {
                gameDifficulty: null,
            }
        case "SET_DIFFICULTY":
            if (action.payload.difficulty && store) {
                return {
                    ...store,
                    gameDifficulty: action.payload.difficulty
                }
            }
        case "RESET_DIFFICULTY":
            if (store) {
                return {
                    ...store,
                    gameDifficulty: null
                }
            }
        default:
            return {
                gameDifficulty: null,
            }
    }
}