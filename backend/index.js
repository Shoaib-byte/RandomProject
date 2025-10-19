const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const unknownEndpoint = (req,res) => {
    res.status(404).send({error : "unknown endpoint"})
}

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())




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

app.get('/persons', (request,response) => {
    response.json(persons)
})

app.get('/api/persons/:name', (request,response) => {
    const name = request.params.name
    const person = persons.find(n=> n.name === name)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
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

app.post('/api/persons',(request,response) => {
    const body = request.body
    const check = Object.values(persons).some(person => person.name.trim().toLowerCase() === body.name.trim().toLowerCase())

    if(!body.name){
        return response.status(400).json({
            error: 'name missing'
        })
    }else if(!body.number){
        return response.status(400).json({
            error: "number is missing"
        })
    }else if(check){
        return response.status(400).json({
            error: "name already exists"
        })
    }
    const person = {
        id: Math.random(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id',(request,response) => {
    const id = request.params.id
    persons = persons.filter(person=> person.id !== id)
    response.status(204).end()

})

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})