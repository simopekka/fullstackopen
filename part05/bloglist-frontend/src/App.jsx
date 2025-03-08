import { useState, useEffect } from 'react'
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
  const [newBlog, setNewBlog] = useState({ title:'', author:'',url:''})
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
      setMessage(`Wrong username or password`)
      setStatus('error')
    }
    setUsername('')
    setPassword('')
    setTimeout(() =>{
      setMessage(null)
      setStatus(null)
    }, 5000)
  }
  const addNewBlog = async (event) => {
    event.preventDefault()
    console.log(newBlog)
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }
    blogService
      .create(blogObject)
      .then(returnedBlogs => {
        setBlogs(blogs.concat(returnedBlogs))
        setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
        setStatus('success')
      })
      .catch(error => {
        setMessage(error.message)
        setStatus('error')
      })
      setTimeout(() =>{
        setMessage(null)
        setStatus(null)
      }, 5000)
    setNewBlog({ title:'', author:'',url:''})
  }

  const logOut = (event) =>{
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleInputChange = (event) => {
    setNewBlog({...newBlog, [event.target.name]: event.target.value})
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
        <Togglable buttonLabel="Create new blog">
          <h2>create new</h2>
          <BlogForm addNewBlog={addNewBlog} newBlog={newBlog} handleInputChange={handleInputChange} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
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