const { test, after, beforeEach } = require('node:test')
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

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returned blogs have valid identifier property', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.id !== 'undefined', true)
})

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

after(async () => {
  await mongoose.connection.close()
})