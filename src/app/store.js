import { configureStore } from '@reduxjs/toolkit'
import sessionLengthSliceReducer from '../sessionLenghtSlice'
import breakLengthSliceReducer from '../breakLenghtSlice'
import skipBreakSliceReducer from '../skipBreakSlice'
import { createStateSyncMiddleware } from 'redux-state-sync';
import { loadState } from '../localStorage';
import throttle from 'lodash.throttle';

const config = {
    blacklist: [],
};

const persistedState = loadState();

const middlewares = [createStateSyncMiddleware(config)];

export default configureStore({
  preloadedState: persistedState,
  reducer: {
    sessionLength: sessionLengthSliceReducer,
    breakLength: breakLengthSliceReducer, 
    skipBreak: skipBreakSliceReducer, 
  },
  devTools: true, 
  middleware : [
    ...middlewares

  ],

})

