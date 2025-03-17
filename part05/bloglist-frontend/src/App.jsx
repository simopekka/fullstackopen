import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(sortBlogs(blogs.sort((a, b) => b.likes - a.likes)))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage(`Hello ${user.name}`)
      setStatus('success')
    } catch (exception) {
      setMessage('Wrong username or password')
      setStatus('error')
    }
    setUsername('')
    setPassword('')
    setTimeout(() => {
      setMessage(null)
      setStatus(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const addedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(addedBlog))
      setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} added`)
      setStatus('success')
      console.log(addedBlog)
    } catch (error) {
      setMessage(error.message)
      setStatus('error')
    }
    setTimeout(() => {
      setMessage(null)
      setStatus(null)
    }, 5000)
  }

  const updateBlog = async ( blog ) => {
    const updatedBlog = {
      user: blog.user,
      author: blog.author,
      title: blog.title,
      likes: blog.likes + 1,
      url: blog.url,
      id: blog.id
    }
    try {
      const returnedBlog = await blogService.update(updatedBlog)
      setBlogs(sortBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog :returnedBlog)))
    } catch (error) {
      console.log(error.message)
    }
  }

  const deleteBlog =  async (id)  => {
    const blog = blogs.find(blog => blog.id === id)
    const confirm = window.confirm(`Delete ${blog.title}?`)
    if (confirm) {
      try {
        await blogService.deleteBlog(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setMessage(`Deleted ${blog.title}`)
        setStatus('success')
      } catch (error) {
        setMessage(error.message)
        setStatus('error')
      }
    }
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  const logOut = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const loginForm = () => {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification message={message} status={status} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={(handleLogin)}
        />
      </>
    )
  }

  const blogForm = () => {
    return (
      <>
        <h2>blogs</h2>
        <Notification message={message} status={status}/>
        <p>{user.name} logged in
          <button onClick={logOut}>log out</button>
        </p>
        <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
          <h2>create new</h2>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <div data-testid="blogs">
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>
          )}
        </div>
      </>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App