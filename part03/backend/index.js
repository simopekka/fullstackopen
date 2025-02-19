const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const info = `Phonebook has info for ${persons.length} people`
    const date = new Date()
    const message = `${info}<br><br>${date}`
    response.send(message)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id)
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }

  const person =  new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  console.log(request.params.id)

  Person.findByIdAndUpdate (
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if ( error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server runnin on port ${PORT}`)