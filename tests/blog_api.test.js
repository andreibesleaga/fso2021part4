const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')

jest.setTimeout(50000)


beforeEach(async () => {
    await Blog.deleteMany({})
  
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
  
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})
  

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs:'+helper.initialBlogs.length, async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})
  
test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].title).toBe('HTML is easy')
})

test('a valid blog can be added', async () => {

    var auth = await api
      .post('/api/login')
      .send({ username: 'andrei', password: 'andrei' })
    var jwtToken = auth.body.token

    const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'some author',
        url: 'http://somwehere',
        likes: 1
    }
    
    await api
      .post('/api/blogs')
      .auth(auth.token, { type: 'bearer' })
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'async/await simplifies making async calls'
    )
})

test('blog without title/url is not added', async () => {

  var auth = await api
    .post('/api/login')
    .send({ username: 'andrei', password: 'andrei' })
  var jwtToken = auth.body.token

    const newBlog = {
      author: 'author',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .auth(auth.token, { type: 'bearer' })      
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(newBlog)
      .expect(400)
    const response = await api.get('/api/blogs')  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})


test('an entry can be deleted', async () => {

  var auth = await api
    .post('/api/login')
    .send({ username: 'andrei', password: 'andrei' })
  var jwtToken = auth.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(auth.token, { type: 'bearer' })
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
})


test('an entry can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    var blogToUpdate = blogsAtStart[0]
  
    blogToUpdate.likes = 10

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)      
      .expect(200)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )
  
    const likes = blogsAtEnd.map(r => r.likes)
    expect(likes).toStrictEqual([10,2])
})


test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'andrei',
    name: 'Andrei Besleaga',
    password: 'andrei',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  expect(usernames).toContain(newUser.username)
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('`username` to be unique')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})  


afterAll(() => {
  mongoose.connection.close()
})