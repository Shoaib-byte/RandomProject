require('dotenv').config()
const bcrypt = require('bcrypt')
const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')


userRouter.post('/', async (request, response,next) => {
    try{
        const {username, name, password} = request.body
    
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
    
        const user = new User({
            username,
            name,
            passwordHash
        })
    
        const savedUser = await user.save()
       return response.status(201).json(savedUser)
    }catch(error){
        next(error)
    }
})

userRouter.get('/', async (request, response,next) => {
    try{
        const getAllUsers = await User.find({}).populate('blogs', {title: 1, author: 1})
        return response.json(getAllUsers)
    }catch(error){
        next(error)
    }
})

module.exports = userRouter