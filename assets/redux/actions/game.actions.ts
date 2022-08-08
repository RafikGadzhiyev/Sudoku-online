export const UpdateBoard = (board: Array<Array<number>>) => {
    return {
        type: "UPDATE_BOARD",
        payload: {
            board
        }
    }
}
