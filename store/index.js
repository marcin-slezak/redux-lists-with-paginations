import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import { listWithPagination } from './ducks';

const reducer = combineReducers({
  listWithPagination: listWithPagination.reducer,
});

const middleware = [...getDefaultMiddleware()];

export const getStore = (preloadedState = {}) => {
  return configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState
  });
};
