const Remove = ({ userName, deleteThisBlog }) => {
  const loggedUser = localStorage.getItem('loggedBlogAppUser')
  const loggedUserName = JSON.parse(loggedUser)
  console.log(userName, loggedUserName.username)

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

export default Remove