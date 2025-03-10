import { useState } from 'react'
import Remove from './Remove'

const Blog = ({ blog, updateBlog, deleteBlog }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

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
      <div style={hideWhenVisible}>
        {blog.title}<button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <table>
          <tbody>
            <tr>
              <td>{blog.title}<button onClick={toggleVisibility}>hide</button></td>
            </tr>
            <tr>
              <td>{blog.url}</td>
            </tr>
            <tr>
              <td>{blog.likes}
                <button type="submit" onClick={updateLikes}>Like</button>
              </td>
            </tr>
            <tr>
              <td>{blog.author}</td>
            </tr>
            <tr>
              <td><Remove userName={blog.user.username} deleteThisBlog={deleteThisBlog}/> </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Blog