import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  if(type) {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
  return (
    <div className='message'>
      {message}
    </div>
  )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <p>
      filter shown with <input
        value={filter}
        onChange={handleFilterChange}
      />
    </p>
  )
}


const PersonForm = ({ addPerson, newName, handlePersonChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input
          value={newName}
          onChange={handlePersonChange}
        />
      </div>
      <div>
        number: <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person, remove }) => {
  return (
    <div>
      <p>{person.name} {person.number}</p>
      <button onClick={remove}>remove</button>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newPerson.name)) {
      if (window.confirm(`${newPerson.name} is already added to the phonebook, update phone number?`)) {
        const oldPerson = persons.find(person => person.name === newPerson.name)
        personService.update(oldPerson.id, newPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== oldPerson.id ? p : response.data))
            setMessage(`${newPerson.name} updated`)
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(error => {
            setErrorMessage(true)
            setMessage(`${oldPerson.name} has already been deleted`)
            setPersons(persons.filter(person => person.id !== oldPerson.id))
            setTimeout(() => {
              setMessage(null)
              setErrorMessage(false)
            }, 5000)
        })
      }
    } else {
      personService
        .create(newPerson)
        .then(response => {
          setPersons(persons.concat(response.data))
          setMessage(`${newPerson.name} added`)
          setTimeout(() => setMessage(null), 5000)
        })

    }
  }

  const removePerson = (id) => {
    const person = persons.find(person => person.id === id).name

    if (window.confirm(`delete ${person}?`)) {
      setMessage(`${person} removed`)
      personService
        .remove(id)
        .then(
          () => {
            setPersons(persons.filter(person => person.id !== id))
            setTimeout(() => setMessage(null), 5000)
        })
    }
}

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={errorMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      {personsToShow.map(person =>
        <Person
          key={person.id}
          person={person}
          remove={() => removePerson(person.id)}
        />
      )}
    </div>
  )
}

export default App