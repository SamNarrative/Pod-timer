import { createSlice } from '@reduxjs/toolkit' 

export const skipBreakSlice = createSlice({
    name: 'skipBreak',
    initialState: {
      value: false,
    },
    reducers: {

      toggleSkipBreak: (state) => {
        state.value = !state.value
      },
      setSkipBreak: (state, action) => {
        console.log("heeeuy")
        state.value = action.payload
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { toggleSkipBreak, setSkipBreak } = skipBreakSlice.actions
  
  export default skipBreakSlice.reducer


  