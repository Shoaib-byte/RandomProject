require('dotenv').config()
const express = require('express');
const blogRouter = express.Router();
const morgan = require('morgan')
const config = require('../utils/config')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog');
const User = require('../models/user');

const getToken = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer ')){
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({}).populate('user',{username: 1, name: 1})
        response.json(blogs)
    } catch (error) {
        next(error)
    }
})

blogRouter.get('/getByName/:name', async (request, response) => {
    const name = request.params.name
    const person = blog.find(n => n.name === name)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

blogRouter.get('/getById/:id', async (request, response) => {
    try {
        const id = request.params.id
        const result = await Blog.findById(id)
        if (result) {
            return response.json(result)
        } else {
            return response.status(404).end() // no person found
        }
    }
    catch (error) {
        next(error)
    }
})

blogRouter.put('/:id', async (request, response, next) => {
    try {
        const { name, number } = request.body

        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).end()
        }

        blog.name = name
        blog.number = number

        const result = await blog.save()
        return response.json(result)
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body
        const decodedToken = jwt.verify(getToken(request), process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
          }
          const user = await User.findById(decodedToken.id)

        if (!user) {
            return response.status(400).json({ error: 'user id is missing or invalid' })
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user.id
        })

        const result = await blog.save()
        user.blogs = user.blogs.concat(result.id)
        await user.save()
        return response.status(201).json(result)
    } catch (error) {
        next(error)
    }


})

blogRouter.delete('/deleteById/:id', async (request, response, next) => {
    try {
        const id = request.params.id
        const result = await Blog.findByIdAndDelete(id)

        return response.status(204).end()
    } catch (error) {
        next(error)
    }

})


module.exports = blogRouter
