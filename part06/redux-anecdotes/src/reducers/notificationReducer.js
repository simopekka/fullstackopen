import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice ({
  name: 'notification',
  initialState: null,
  reducers: {
    setMessage: (state, action ) => {
      return action.payload
    },
    clearMessage: () => {
      return null
    }
  }
})

export const { setMessage, clearMessage } = notificationSlice.actions

export const setTemporaryMessage = (message) => (dispatch) => {
  dispatch(setMessage(message))
  setTimeout(() => {
    dispatch(clearMessage())
  }, 5000)
}

export default notificationSlice.reducer
