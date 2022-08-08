import React from 'react';
import _ from 'lodash';
import {
    useSelector,
    useDispatch
} from 'react-redux'
import {
    getSolvedBoard,
    startSolveBoard,
    getRowValues,
    getColumnValues,
    getSquareValues,
    getAvailableValues
} from '../../assets/helpers';
import {
    NextRouter,
    useRouter
} from 'next/router';
import {
    v4 as uuid4
} from 'uuid';
// * Types
import type {
    AnyAction
} from 'redux';
import type {
    IReduxStore
} from '../../assets/redux/store'
// * Styles
import styled, {
    StyledComponent
} from 'styled-components';
import { Timer } from '../../assets/elements/Timer';
import { Box, Modal, Typography } from '@mui/material';

const GameContainer = styled.div`
    text-align: center;
`;

const Level = styled.span`
    font-size: 1.3rem;
    text-transform: capitalize;
`;

const GameFieldContainer = styled.div`
    width: 540px;
    height: 540px;
    margin: 0 auto;
`;

const GameFieldRow = styled.div`
    width: 100%;
    height: 60px;
    display: flex;

    &:not(:last-of-type){
        &>div{
            border-bottom: none;
        }
        &:nth-of-type(3n){
            &>div{
                border-bottom: 3px solid black;
            }
        }
    }

    &:hover{
        background-color:  beige;
    }


`

const GameFieldCell = styled.div`
    width: 60px;
    height: 100%;
    border: 1.5px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    font-size: 1.5rem;
    cursor: pointer;
    
    &:not(:last-of-type){
        border-right: none;
        &:nth-of-type(3n){
            border-right: 3px solid black;
        }
    }

`

const InputCell = styled.input`
    all: unset;
    width: 100%;
    height: 100%;
    text-align: center;

    &:focus{
        border: 2px solid gold;
    }

`;

const GoBackButton = styled.button`
    border-radius: 5px;
    backgrond-color: green;
    padding: .5rem;
    position: relative;
    left: 50%;
    margin-top: 1rem;
    transform: translateX(-50%);
    background-color: #ff0000;
    transition: 300ms ease-in;

    &:hover{
        background-color: #d50000;
    }

`;

const MODAL_STYLES = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 5,
    boxShadow: 24,
    p: 4
}

export default function GameField() {
    const router: NextRouter = useRouter();
    const store: IReduxStore = useSelector((store: IReduxStore) => store);
    const solvedBoard = React.useRef<Array<Array<number>>>([]);
    const boardSize = React.useRef<number>(9);
    const TOTAL_GENERATION = React.useRef<[number, number]>([20, 1]);
    const TOTAL_RENDERS = React.useRef<number>(1);

    const [board, setBoard] = React.useState<Array<Array<number>>>([]);
    const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
    const [isEnd, setIsEnd] = React.useState<boolean>(false);

    const getTotalGeneratedNumbers = (): number => {
        return Math.floor(Math.random() * (TOTAL_GENERATION.current[0] - TOTAL_GENERATION.current[1]) + TOTAL_GENERATION.current[1]);
    }

    const GenerateNumbers = (total: number): Array<Array<number>> => {
        const result: Array<Array<number>> = Array.from({ length: boardSize.current }, () => Array(boardSize.current).fill(0));
        for (let ii = 0; ii < total; ++ii) {
            let i = _.random(0, boardSize.current - 1),
                j = _.random(0, boardSize.current - 1);
            const notAvailableValues = [
                ...getRowValues(i, result, boardSize.current),
                ...getColumnValues(j, result, boardSize.current),
                ...getSquareValues(i, j, result)
            ];

            const available = getAvailableValues(notAvailableValues);
            if (available.length === 0) {
                ii--;
                continue;
            }
            result[i][j] = available[_.random(0, available.length - 1)];
        }

        return result;
    }

    React.useEffect(() => {
        if (store.gameDifficulty === null) {
            router.push('/')
        }
        if (board.length === 0) {
            if (TOTAL_RENDERS.current) {
                setIsGenerating(() => true);
                let totalGeneratedNumber: number = getTotalGeneratedNumbers();
                setBoard(() => GenerateNumbers(totalGeneratedNumber));
                TOTAL_RENDERS.current--;
            }
        }
    }, [])

    React.useEffect(() => {
        if (board.length) {
            const deepCopied: Array<Array<number>> = _.cloneDeep(board);
            const result = getSolvedBoard(deepCopied, boardSize.current);
            solvedBoard.current = result;
            if (solvedBoard.current.length) {
                setIsGenerating(() => false);
            }
        }
    }, [board])

    const keyHandler = (e: React.KeyboardEvent, rowIndex: number, columnIndex: number) => {
        const key: string = e.key;
        const input: HTMLInputElement = e.target as HTMLInputElement;
        if (input.value || (input.value === '' && key === 'Backspace')) return;
        const cells: HTMLDivElement[] = Array.from(document.querySelectorAll('.game-cell'));

        if (store.gameDifficulty === 'easy') {
            EasyDifficulty(rowIndex, columnIndex, +key, e.target.closest('.game-cell'));
        }

    }

    const EasyDifficulty = (rowIndex: number, columnIndex: number, newValue: number, cell: HTMLDivElement | null) => {
        if (cell) {
            if (isNaN(newValue) === false) {
                if (newValue === solvedBoard.current[rowIndex][columnIndex]) {
                    let boardCopy: Array<Array<number>> = _.cloneDeep(board);
                    boardCopy[rowIndex][columnIndex] = newValue;
                    setBoard(() => boardCopy);
                    if (
                        board.reduce((a: number, b: Array<number>) => a + (b.filter((value: number) => value === 0).length), 0) === 1
                    ) {
                        setIsEnd(() => true);
                    }
                } else {
                    cell.style.backgroundColor = 'red';
                }
            }
        }
    }

    const getTime = (timer: number): number => {
        return timer;
    }

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: string = e.target.value;
        if (/\d+$/.test(value) === false) {
            e.target.value = '';
        }
    }

    return <GameContainer>
        {
            isGenerating && <span>Loading</span>
        }

        <Modal
            open={isEnd}
            onClose={() => { setIsEnd(() => false) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={MODAL_STYLES}
            >
                <Typography
                    id="modal-modal-title"
                    variant="h4"
                    component="h2"
                    sx={{
                        textAlign: 'center'
                    }}
                >
                    Congratulations!
                </Typography>
                <Typography
                    id="modal-modal-description"
                    sx={{
                        mt: 2,
                        textAlign: 'center'
                    }}
                >
                    You have just won easy sudoku level! Try hard mode (In development)
                </Typography>
                <GoBackButton
                    onClick={() => router.push('/')}
                >
                    Go Back
                </GoBackButton>
            </Box>
        </Modal>

        {
            !isGenerating &&
            <>
                <Level>
                    {store.gameDifficulty}
                </Level>
                <Timer
                    isEnd={isEnd}
                    startTime={0}
                />
                <GameFieldContainer>
                    {
                        board.map((row: Array<number>, rowIndex: number) => <GameFieldRow
                            key={uuid4()}
                        >
                            {
                                row.map((cell: number, cellIndex: number) => <GameFieldCell
                                    key={uuid4()}
                                    data-row={rowIndex}
                                    data-column={cellIndex}
                                    className='game-cell'
                                >{
                                        cell ||
                                        <InputCell
                                            type="text"
                                            maxLength={1}
                                            onChange={(e) => inputHandler(e)}
                                            onKeyDown={(e) => keyHandler(e, rowIndex, cellIndex)}
                                        />
                                    }</GameFieldCell>)
                            }
                        </GameFieldRow>)
                    }
                </GameFieldContainer>
                {
                    store.gameDifficulty === 'hard' && <button>Check board!</button>
                }
                {/* <button onClick={() => setBoard(() => solvedBoard.current)}>Show solution</button> */}
            </>
        }
    </GameContainer>
};