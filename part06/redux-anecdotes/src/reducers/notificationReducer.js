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

export const setTemporaryMessage = (message, length) => {
  return async dispatch => {
    dispatch(setMessage(message))
    setTimeout(() => {
      dispatch(clearMessage())
    }, length * 500)
  }
}

export default notificationSlice.reducer
