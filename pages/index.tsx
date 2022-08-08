// *libraries and frameworks
import React from 'react';
import { NextRouter, useRouter } from 'next/router'
import styled, { StyledComponent } from 'styled-components'
import { motion, ForwardRefComponent, HTMLMotionProps } from 'framer-motion'
import { Difficulties } from '../assets/globalTypes';
// *components
import Head from 'next/head'
// types
import type { NextPage } from 'next'
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { SetDifficulty } from '../assets/redux/actions/difficulty.action';


// *styled components
const Container = styled.div`
  background-color: #FDE2DE;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled(motion.h1)`
  font-size: 1.5rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
`

const AppContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  width: 50rem;
  border-radius: 10px;
  min-height: 30rem;
  text-align: center;
`;

const GameText = styled(motion.span)`
  width: 100%;
  font-size: 1.2rem;
  display: block
`;

const DifficultiesContainer = styled.div`
  display: flex;
  margin-top: 2rem;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
`;

interface IAttributes {
  difficulty: Difficulties
}
const Difficulty: StyledComponent<ForwardRefComponent<HTMLButtonElement, HTMLMotionProps<"button">>, any, IAttributes, never> = styled(motion.button)`
  background-color: ${(props: IAttributes) => props.difficulty === 'easy' ? '#00f000' : '#ff4444'};
  transition: 300ms linear;
  border-radius: 10px;
  padding: 1rem;
  box-sizing: content-box;
  width: 150px;
  text-align: center;

  &:hover{
    background-color: ${(props: IAttributes) => props.difficulty === 'easy' ? '#00ff00' : '#ff0000'}
  }

`;

// *Main component
const Home: NextPage = () => {
  const totalInit = React.useRef<number>(1);
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const router: NextRouter = useRouter();

  const startGame = (difficulty: Difficulties) => {
    dispatch(SetDifficulty(difficulty));
    router.push('/game')
  }

  React.useEffect(() => {
    if (totalInit.current) {
      totalInit.current--;
      dispatch({ type: "__INIT__" });
    }
  }, [dispatch, router])

  return (
    <Container>
      <Head>
        <title>Sudoku online</title>
        <meta name="description" content="This is an online version of sudoku" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppContainer>
        <Title
          initial={{
            y: -100
          }}
          animate={{
            y: 0
          }}
        >Welcome to Sudoku online!</Title>
        <GameText
          initial={{
            y: -100
          }}
          animate={{
            y: 0
          }}
        >Choose difficulty to start the game</GameText>
        <DifficultiesContainer>
          <Difficulty
            initial={{
              y: -100,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            onClick={() => startGame('easy')}
            difficulty='easy'
          >Easy</Difficulty>
          <Difficulty
            initial={{
              y: -100,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            difficulty='hard'
          >Hard (in development)</Difficulty>
        </DifficultiesContainer>
      </AppContainer>
    </Container>
  )
}

export default Home
