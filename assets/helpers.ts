export const getFromRange = (from: number, to: number): number => {
    return Math.floor(Math.random() * (to - from) + from);
}

export const getSolvedBoard = (board: Array<Array<number>>, boardSize: number): Array<Array<number>> => {
    startSolveBoard(board, boardSize);
    return board;
}

export const startSolveBoard = (board: Array<Array<number>>, boardSize: number): boolean => {
    for (let i = 0; i < boardSize; ++i) {
        for (let j = 0; j < boardSize; ++j) {
            if (board[i][j] === 0) {
                const notAvailableValues = [
                    ...getRowValues(i, board, boardSize),
                    ...getColumnValues(j, board, boardSize),
                    ...getSquareValues(i, j, board)
                ]
                const available = getAvailableValues(notAvailableValues);

                if (available.length < 9) {
                    for (let n = 0; n < available.length; ++n) {
                        board[i][j] = available[n];
                        if (!startSolveBoard(board, boardSize)) {
                            board[i][j] = 0;
                        } else {
                            return true
                        }
                    }

                    return false;
                }
                board[i][j] = ~~Math.random() * available.length;
            }
        }
    }
    return true;
}

export const getRowValues = (rowIndex: number, board: Array<Array<number>>, boardSize: number): Array<number> => {
    const values: Array<number> = [];
    for (let i = 0; i < boardSize; ++i) {
        if (board[rowIndex][i] !== 0) {
            values.push(board[rowIndex][i]);
        }
    }

    return values;
}

export const getColumnValues = (columnIndex: number, board: Array<Array<number>>, boardSize: number): Array<number> => {
    const values: Array<number> = [];

    for (let i = 0; i < boardSize; ++i) {
        if (board[i][columnIndex] !== 0) values.push(board[i][columnIndex]);
    }

    return values;
}

export const getSquareValues = (rowIndex: number, columnIndex: number, board: Array<Array<number>>): Array<number> => {
    const values: Array<number> = [];

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            let value = board[i + Math.floor(rowIndex / 3) * 3][j + Math.floor(columnIndex / 3) * 3];
            if (value !== 0) values.push(value);
        }
    }
    return values;
}

export const getAvailableValues = (values: Array<number>): Array<number> => {
    const availableValues: Array<number> = [];

    for (let i = 1; i < 10; ++i) {
        if (!values.includes(i)) availableValues.push(i);
    }

    return availableValues;
}