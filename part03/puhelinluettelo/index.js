const http = require('http')

const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')

morgan.token('body', req => {
    return JSON.stringify(req.body)
})
  
app.use(morgan(':method :url :status :response-time ms :body'))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number:"040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number:"39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number:"12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number:"39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const info = `Phonebook has info for ${persons.length} people`
    const date = new Date()

    response.send(`${info}<br>${date}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Content missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    console.log(`adding person: ${person.name} ${person.number}`)
    const found = persons.find(person => person.name === body.name)
    if (!found) {
    persons = persons.concat(person)
    response.json(person)
    } else {
        console.log(`${person.name} is already added to the phonebook!`)
        return response.status(400).json({
            error: `${person.name} is already added to the phonebook!`
        })
    }
})

const PORT = 3001
app.listen(PORT)
console.log(`Server runnin on port ${PORT}`)