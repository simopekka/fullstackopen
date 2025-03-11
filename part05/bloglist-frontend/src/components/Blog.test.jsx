import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'testiblogi',
  author:'unknown author',
  url:'00000',
  likes:'0',
  user: {
    username: 'test user',
    name: 'firstname lastname',
    id: '00000',
  }
}

const testUser = {
  username: 'username',
  name: 'user'
}

test('renders blog title', () => {

  render(<Blog blog={blog} updateBlog={null} deleteBlog={null}/>)
  const element = screen.getByText('testiblogi')

  expect(element).toBeDefined ()
})

test('renders also author, likes and url when view button is pressed', async () => {
  
  render(<Blog blog={blog} updateBlog={null} deleteBlog={null} user={testUser}/>)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const element = screen.getByText('unknown author')
  expect(element).toBeDefined ()

})

test('if like-button is pressed twice, function UpdateBlog gets is twice', async () => {
  
  const mockHandler = vi.fn()
  render(<Blog blog={blog} updateBlog={mockHandler} deleteBlog={null} user={testUser}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const button = screen.getByText('Like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
