import { Difficulties } from "../../globalTypes";

export const SetDifficulty = (difficulty: Difficulties) => {
    return {
        type: "SET_DIFFICULTY",
        payload: {
            difficulty
        }
    }
}

export const ResetDifficulty = () => {
    return {
        type: "RESET_DIFFICULTY"
    }
}
