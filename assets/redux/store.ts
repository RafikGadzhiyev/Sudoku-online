import { applyMiddleware, legacy_createStore as CreateStore } from 'redux';
import { MainReducer } from './reducers/mainl.reducer';
import logger from 'redux-logger';
import { Difficulties } from '../globalTypes';

export interface IReduxStore {
    gameDifficulty: Difficulties | null,
}

export const store = CreateStore(MainReducer, applyMiddleware(logger));