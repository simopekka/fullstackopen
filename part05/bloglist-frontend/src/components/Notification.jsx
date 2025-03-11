import PropTypes from 'prop-types'

const Notification = ({ message, status }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={status}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  status: PropTypes.string
}

export default Notification