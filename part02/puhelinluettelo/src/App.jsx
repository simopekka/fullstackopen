import axios from 'axios'
import { useEffect, useState } from 'react'

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

const PersonForm = ({addName, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addName}>
      <div>name:<input value={newName} onChange={handleNameChange}/></div>
      <div>number:<input value={newNumber} onChange={handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, filter}) => {
  return (
    <>
      {persons.filter((person) =>
        person.name.toUpperCase().includes(filter.toUpperCase()))
        .map(person => 
          <Person key={person.name} person={person}/>
      )}
    </>
  )
}

const Person = ({person}) => {
  return (
    <p key={person.name}>{person.name} {person.number}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
    }

    useEffect(hook, [])


  const addName = (event) => {
    const found = persons.find(person => person.name.toUpperCase() === newName.toUpperCase())
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (found) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
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
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>
    </div>
  )

}

export default App