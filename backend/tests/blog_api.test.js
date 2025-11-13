const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)



beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlog) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})


describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const testUser = new User({ username: 'root', passwordHash })
    await testUser.save()
  })
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'TEST',
      name: 'some name',
      password: 'password'
    }

    await api.post('/api/user')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtEnd.length, usersAtStart.length + 1)

    const userNames = userAtEnd.map(u => u.username)
    assert(userNames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/user')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

test('likes defaulting to 0', async () => {
  const newBlog = {
    title: 'async/await blog',
    author: 'test',
    url: 'example.com'
  }

  const result = await api
    .post('/api/blog')
    .send('likes' in newBlog ? newBlog : { ...newBlog, likes: 0 }
    )
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(result.body.likes, 0)

})

test('unique identifier is named id', async () => {
  const blogs = await helper.blogsInDb()
  const isId = blogs.some(b => 'id' in b)
  assert.strictEqual(isId, true)
})

test('a specific blog can be added', async () => {
  const blogs = await helper.blogsInDb()
  const blogToView = blogs[0]

  const resultBlog = await api.get(`/api/blog/getById/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await blog',
    author: 'test',
    url: 'example.com',
    likes: 4
  }

  await api
    .post('/api/blog')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blog')
  const titles = response.body.map(b => b.title)
  assert.strictEqual(response.body.length, helper.initialBlog.length + 1)
  assert(titles.includes('async/await blog'))
})

test('blog can be deleted', async () => {
  const blogs = await helper.blogsInDb()
  const blogToView = blogs[0]

  await api.delete(`/api/blog/deleteById/${blogToView.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)
  assert(!titles.includes(blogToView.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length - 1)
})

test('a blog without title cannot be added', async () => {
  const newBlog = {
    author: 'test',
    url: 'example.com',
    likes: 4,
  }

  await api.post('/api/blog')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blog')
  assert.strictEqual(response.body.length, helper.initialBlog.length + 1)
})

test('blog are returned as json', async () => {
  await api
    .get('/api/blog')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blog')

  assert.strictEqual(response.body.length, helper.initialBlog.length)
})

test('a specific blog is within the returned blog', async () => {
  const response = await api.get('/api/blog')

  const titles = response.body.map(e => e.title)
  assert(titles.includes('HTML is easy'))
})
after(async () => {
  await mongoose.connection.close()
})

