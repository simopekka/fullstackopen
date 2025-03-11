import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const newTestBlog = {
  title: 'testiblogi',
  author:'unknown author',
  url:'00000',
}

const testUser = {
  username: 'username',
  name: 'user'
}

test ('calls event handler with right details when new blog is added', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog}/>)

  const title = screen.getByPlaceholderText('title')
  const author = screen.getByPlaceholderText('author')
  const url = screen.getByPlaceholderText('url')
  const sendButton = screen.getByText('create')

  await user.type(title, 'testiblogi')
  await user.type(author, 'unknown author')
  await user.type(url, '00000')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testiblogi' )

})