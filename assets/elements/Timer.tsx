import React from 'react';
import styled from 'styled-components'

const TimerContainer = styled.div`
    margin-block: .5rem;
`;
const TimerMinutes = styled.span``;
const TimeSeconds = styled.span``;


interface IProps extends React.PropsWithChildren {
    startTime: number // in Seconds,
    isEnd: boolean // false indicates that sudoku does not solved
}
export const T: React.FC<IProps> = ({ startTime, isEnd }) => {
    const [time, setTime] = React.useState<number>(startTime);

    React.useEffect(() => {
        let timerId: ReturnType<typeof setInterval>;

        if (!isEnd) {
            timerId = setInterval(() => {
                setTime((prev) => ++prev);
            }, 1000);

            return () => {
                clearInterval(timerId)
            };
        }
    }, [])

    return <TimerContainer>
        <TimerMinutes>
            {(~~(time / 60) < 10 ? '0' : '') + ~~(time / 60)}
        </TimerMinutes>:
        <TimeSeconds>
            {(time % 60 < 10 ? '0' : '') + time % 60}
        </TimeSeconds>
    </TimerContainer>
}

export const Timer = React.memo(T);