import { configureStore } from '@reduxjs/toolkit'
import sessionLengthSliceReducer from '../sessionLenghtSlice'
import breakLengthSliceReducer from '../breakLenghtSlice'
import skipBreakSliceReducer from '../skipBreakSlice'
import { createStateSyncMiddleware } from 'redux-state-sync';

const config = {
    blacklist: [],
};

const middlewares = [createStateSyncMiddleware(config)];

export default configureStore({
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

