const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      title: 'HTML is easy',
      author: 'Author Author',
      url: 'http://www1',
      likes: 1
    },
    {
      title: 'Some Blog',
      author: 'Authorus deBlogus',
      url: 'http://www2',
      likes: 2
    }
  ]
  
const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author:'Author', url:'http://www', likes:1 })
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}