const mongoose = require('mongoose')


const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
        .then(result => {
            console.log('connected to db')
        })
        .catch(error => {
            console.log('error connecting to db',error.message)
        })

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        required: [true, 'name is required']
    },
    number: {
        type: String,
        validate: {
            validator: function(v){
                return /\d{3}-\d/.test(v)
            },
            message: props => `${props.value} is not a valid number. Allowed format 123-122132`
        },
        required : [true, 'Phone number is required']
    }
})


phoneSchema.set('toJSON',{
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Phone', phoneSchema)