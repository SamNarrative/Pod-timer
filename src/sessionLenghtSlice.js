import { createSlice } from '@reduxjs/toolkit' 

export const sessionLengthSlice = createSlice({
    name: 'sessionLength',
    initialState: {
      value: 1500,
    },
    reducers: {
      sessionIncrement: (state) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.value += 60
      },
      sessionDecrement: (state) => {
        state.value -= 60
      },
      incrementByAmount: (state, action) => {
        state.value += action.payload
      },
      returnState: (state) => {
        return state.value
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { sessionIncrement, sessionDecrement, incrementByAmount, returnState} = sessionLengthSlice.actions
  
  export default sessionLengthSlice.reducer


  