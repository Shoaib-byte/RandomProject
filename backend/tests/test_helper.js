const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlog = [
    {
      title: 'HTML is easy',
      author: 'test',
      url: 'example.com',
      likes: 2
    },
    {
        title: 'some title',
        author: 'test',
        url: 'example.com',
        likes: 3
    },
  ]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    initialBlog, blogsInDb,usersInDb
}