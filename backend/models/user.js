const mongoose = require('mongoose')
const config = require('../utils/config')

const url = config.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(result => {
        console.log('connected to db')
    })
    .catch(error => {
        console.log('error connecting to db', error.message)
    })

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
      },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})


module.exports = mongoose.model('User', userSchema)