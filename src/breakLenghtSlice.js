import { createSlice } from '@reduxjs/toolkit' 

export const breakLengthSlice = createSlice({
    name: 'breakLength',
    initialState: {
      value: 300,
    },
    reducers: {
      breakIncrement: (state) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.value += 60
      },
      breakDecrement: (state) => {
        state.value -= 60
      },
      incrementByAmount: (state, action) => {
        state.value += action.payload
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { breakIncrement, breakDecrement, incrementByAmount } = breakLengthSlice.actions
  
  export default breakLengthSlice.reducer


  