const http = require('http')

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
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
        .then(result => {
            const body = result
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
    const body = request.body
    console.log(request.params.id)

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate (request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server runnin on port ${PORT}`)