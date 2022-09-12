require('dotenv').config()
const express = require('express')
const app = express()
const Persons = require('./models/phonebook')
const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))

app.get('/api/persons', (request, response) => {
    Persons.find({}).then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
    Persons.find({'_id': request.params.id}).then(person => response.json(person))
})

app.get('/info', (request, response) => {
    Persons.find({}).then(persons => {
        response.send(`
            <p>Phonebook has info for ${persons.length} people<p>
            <p>${new Date()}
        `)
    })
    
})

app.delete('/api/persons/:id', (request, response) => {
    Persons.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => console.log(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name && body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Persons({
        name: body.name,
        number: body.number

    })

    person.save().then(savedPerson => response.json(savedPerson))

})

app.put('api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Persons.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => console.log(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})