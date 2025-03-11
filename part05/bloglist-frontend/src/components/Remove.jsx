import PropTypes from 'prop-types'

const Remove = ({ userName, deleteThisBlog }) => {
  const loggedUser = localStorage.getItem('loggedBlogAppUser')
  const loggedUserName = JSON.parse(loggedUser)

  if (userName === loggedUserName.username) {
    return (
      <button onClick={deleteThisBlog}>remove</button>
    )
  } else {
    return (
      <></>
    )
  }
}

Remove.propTypes = {
  userName: PropTypes.string.isRequired,
  deleteThisBlog: PropTypes.func.isRequired
}

export default Remove