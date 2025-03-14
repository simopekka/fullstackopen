import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState({
    title: '', author:'', url:''
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })
  }
  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          name="title"
          data-testid="title"
          value={newBlog.title}
          placeholder='title'
          onChange={event => setNewBlog({ ...newBlog,[event.target.name]: event.target.value })}
        />
      </div>
      <div>
        author:
        <input
          name="author"
          data-testid="author"
          value={newBlog.author}
          placeholder='author'
          onChange={event => setNewBlog({ ...newBlog,[event.target.name]: event.target.value })}
        />
      </div>
      <div>
        url:
        <input
          name="url"
          data-testid="url"
          value={newBlog.url}
          placeholder='url'
          onChange={event => setNewBlog({ ...newBlog,[event.target.name]: event.target.value })}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm