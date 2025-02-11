import { useEffect, useState } from 'react'
import personService from './services/persons'


const Filter = ({filter, filterInput}) => {
  return (
    <div>filter shown with
      <input 
          name="filter"
          value={filter}
          onChange={filterInput}
      />
    </div>
  )
}

const PersonForm = ({addName, newName, handleInputChange}) => {
  return (
    <form onSubmit={addName}>
      <div>name:<input name="name" value={newName.name} onChange={handleInputChange}/></div>
      <div>number:<input name="number" value={newName.number} onChange={handleInputChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, filter, deletePerson}) => {
  return (
    <>
      {persons.filter((person) =>
        person.name.toUpperCase().includes(filter.toUpperCase()))
        .map(person => 
          <Person key={person.id} person={person} deletePerson={deletePerson}/> 
      )}
    </>
  )
}

const Person = ({person, deletePerson}) => {
  return (
    <p key={person.id}>{person.name} {person.number}
      <button onClick={() => deletePerson(person.id)}>delete</button> 
    </p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState({
    name: '', number: ''
  })
  const [filter, setFilter] = useState('')

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
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
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
        })
    }
  }

  const handleInputChange = (event) => {
    console.log(event.target.value)
    setNewName({...newName, [event.target.name]: event.target.value})
  }

  const filterInput = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} filterInput={filterInput}/>
      <h2>Add a new</h2>
      <PersonForm addName={addName} newName={newName} handleInputChange={handleInputChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )

}

export default App