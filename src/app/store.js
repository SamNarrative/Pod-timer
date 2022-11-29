import { configureStore } from '@reduxjs/toolkit'
import sessionLengthSliceReducer from '../sessionLenghtSlice'
import breakLengthSliceReducer from '../breakLenghtSlice'

export default configureStore({
  reducer: {
    sessionLength: sessionLengthSliceReducer,
    breakLength: breakLengthSliceReducer, 
  },
})