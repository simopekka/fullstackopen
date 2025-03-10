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
  const [newBlog, setNewBlog] = useState({ title:'', author:'',url:'' })
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
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

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlogs => {
        setBlogs(blogs.concat(returnedBlogs))
        setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setStatus('success')
      })
      .catch(error => {
        setMessage(error.message)
        setStatus('error')
      })
    setTimeout(() => {
      setMessage(null)
      setStatus(null)
    }, 5000)
    setNewBlog({ title:'', author:'',url:'' })
  }

  const updateBlog = ( blog ) => {
    console.log(blog)
    const updatedBlog = {
      user: blog.user,
      author: blog.author,
      title: blog.title,
      likes: blog.likes + 1,
      url: blog.url
    }

    blogService
      .update(blog.id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog :returnedBlog))
      })
      .catch(error => {
        console.log(error.response.data)
      })
  }

  const deleteBlog =  id  => {
    const blog = blogs.find(blog => blog.id === id)
    const confirm = window.confirm(`Delete ${blog.title}?`)
    if (confirm) {
      blogService
        .deleteBlog(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          setMessage(`Deleted ${blog.title}`)
          setStatus('success')
        })
        .catch(error => {
          setMessage(error.message)
          setStatus('error')
        })
    }
    setTimeout(() => {
      setMessage(null)
    }, 5000)
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
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog}/>
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