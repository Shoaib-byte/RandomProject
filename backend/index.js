require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Phone = require('./models/Phone')

const app = express()
const unknownEndpoint = (req,res) => {
    res.status(404).send({error : "unknown endpoint"})
}

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('dist'))




let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      },
      {
        "id": "1c00",
        "name": "testiggg",
        "number": "2342342"
      }
  ]

app.get('/',(request,response) => {
    response.end('<h1>Hello World </h1>')
})

app.get('/api/persons', (request,response) => {
    Phone.find({}).then(phones => {
        response.json(phones)
    })
})

app.get('/api/persons/getByName/:name', (request,response) => {
    const name = request.params.name
    const person = persons.find(n=> n.name === name)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.get('/api/persons/:id', (request,response) => {
    const id = request.params.id
    Phone.findById(id)
    .then(result => {
        if (result) {
            response.json(result)
          } else {
            response.status(404).end() // no person found
          }
        })
        .catch(error => next(error)) // e.g. invalid ObjectId (CastError)
    })

app.put('/api/persons/:id',(request,response) => {
    const {name , number} = request.body

    Phone.findById(request.params.id)
    .then(phone => {
        if(!phone){
            return response.status(404).end()
        }
        
        phone.name = name
        phone.number = number

        return phone.save().then(result =>{
            response.json(result)
        })
        .catch(error => {
            next(error)
        })
    })
})

app.get('/info', (request, response) => {
    const total = persons.length
    const currentTime = new Date()
    const message = `Phone book info for ${total} people`
    const messages2= `current time ${currentTime}`
    const allMessages = `${message} ${messages2}
    `
    response.send(allMessages)

})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

app.post('/api/persons',(request,response,next) => {
    const body = request.body

    // if(!body.name){
    //     return response.status(400).json({
    //         error: 'name missing'
    //     })
    // }else if(!body.number){
    //     return response.status(400).json({
    //         error: "number is missing"
    //     })
    // }

    const phone = new Phone({
        name: body.name,
        number: body.number
    })

    phone.save().then(result => {
        response.json(result)
    })
    .catch(error => {
        next(error)
    })
    
})

app.delete('/api/persons/:id',(request,response,next) => {
    const id = request.params.id
    Phone.findByIdAndDelete(id)
        .then(result => {
                response.status(204).end()
        })
        .catch(error => {
           next(error)
        })

})

const errorHandler = (error, request,response,next) => {
    console.log(error.message)

    if (error.name === "CastError"){
        return response.status(400).send({error : "Malformed Id"})
    }
    if (error.name === "ValidationError"){
        return response.status(400).json({error: error.message})
    }
    
    next(error)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
app.use(unknownEndpoint)
app.use(errorHandler)
