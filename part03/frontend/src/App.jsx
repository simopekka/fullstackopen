import { useEffect, useState } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState({ name: '', number: '' })
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)

  const hook = () => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
    }

    useEffect(hook, [])


  const addName = (event) => {
    event.preventDefault()
    console.log(newName)
    const found = persons.find(person => person.name.toUpperCase() === newName.name.toUpperCase())

    const personObject = {
      name: newName.name,
      number: newName.number
    }

    if (found) {
      if(window.confirm(`${newName.name} is already added to the phonebook, replace the old number with a new one?`)) {
        personService
          .update(found.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== found.id ? person : returnedPerson))
            setMessage(`Updated ${newName.name} phone number from ${found.number} to ${newName.number}`)
            setStatus('success')
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${newName.name}`)
          setStatus('success')
          setTimeout(() => {
            setMessage(null)
          }, 5000) 
        })
    }
    setNewName({
      name: '', number: ''
    })
  }

  const deletePerson = id => {
    console.log(id)
    const person = persons.find(person => person.id === id)
    const result = window.confirm(`Delete ${person.name}?`)
    if (result) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage(`Deleted ${person.name} ${person.number} from the phonebook`)
          setStatus('success')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(`Information of ${person.name} has already been removed from the server`)
          setStatus('error')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleInputChange = (event) => {
    setNewName({...newName, [event.target.name]: event.target.value})
  }

  const filterInput = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} status={status}/>
      <Filter filter={filter} filterInput={filterInput}/>
      <h2>Add a new</h2>
      <PersonForm addName={addName} newName={newName} handleInputChange={handleInputChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )

}

export default App