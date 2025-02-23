const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})
describe('fetching blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returned blogs have valid identifier property', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.id !== 'undefined', true)
  })
})
describe('adding blogs', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'test blog',
      author: 'unknown tester',
      url: 'test',
      likes: 7
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, helper.initialBlogs.length +1)

    assert(titles.includes('test blog'))
  })

  test('blog has number value', async () => {

    const newBlog = {
      title: 'test blog',
      author: 'unknown tester',
      url: 'test',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const likes = response.body.map(r => r.likes)

    assert.strictEqual(likes.length, 3)
  })

  test('new blog includes url & title or returns 400', async () => {
    const newBlog = {
      author: 'unknown author'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('deletion of a blog', () => {
  test('blogs can be deleted', async () => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  })
})

describe('blog updates', () => {
  test('blog likecount can be changed', async () => {
    const blogs = await helper.blogsInDb()
    const blogToUpdate = blogs[0]
    const updatedBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 777
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const response = await api.get('/api/blogs')
    console.log(response.body[0].likes)
    assert.strictEqual(updatedBlog.likes, (response.body[0]).likes)
  })
})


after(async () => {
  await mongoose.connection.close()
})