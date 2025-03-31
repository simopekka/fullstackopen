import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "VOTE":
      return `anecdote '${action.payload}' voted`
    case "CREATE":
      return `created new anecdote '${action.payload}'`
    case "CLEAR":
      return null
    case "ERROR":
      return action.payload
    default:
      return state
  }
}

const NotificationContext = createContext()

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  const dispatch = notificationAndDispatch[1]
  return (type, payload) => {
    dispatch(type, payload)
    setTimeout(() => {
      dispatch({type: "CLEAR"})
    }, 5000)
  }
}

export const NotificationContextProvider = (props) => {
 const [notification, notificationDispatch] = useReducer(notificationReducer, null) 
 return (
  <NotificationContext.Provider value={[notification, notificationDispatch]}>
    {props.children}
  </NotificationContext.Provider>
 )
}

export default NotificationContext