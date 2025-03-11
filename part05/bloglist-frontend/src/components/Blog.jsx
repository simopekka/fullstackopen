import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updateLikes = (event) => {
    event.preventDefault()
    updateBlog(blog)
  }

  const deleteThisBlog = (event) => {
    event.preventDefault()
    deleteBlog(blog.id)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}<button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          {blog.url}
          <div>
          {blog.likes}
            <button type="submit" onClick={updateLikes}>Like</button>
          </div>
          <div>
          {blog.author}
          </div>
          {blog.user.username === user.username && (
            <div>
              <button onClick={deleteThisBlog}>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog