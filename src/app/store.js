import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { createStateSyncMiddleware } from 'redux-state-sync'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import sessionLengthSliceReducer from '../sessionLenghtSlice'
import breakLengthSliceReducer from '../breakLenghtSlice'
import skipBreakSliceReducer from '../skipBreakSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  sessionLength: sessionLengthSliceReducer,
  breakLength: breakLengthSliceReducer,
  skipBreak: skipBreakSliceReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewares = [createStateSyncMiddleware()]

export default configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: [...middlewares],
})