import {useState, useEffect } from 'react'
import countriesService from './services/countries'
import Search from './components/Search'
import Find from './components/Find'


function App() {
  const [input, setInput] = useState('')
  const [countries, setCountries] = useState([])

  const hook = () => {
    countriesService
      .getAll()
      .then(response => {
        setCountries(response)
    })    
  }

  useEffect(hook, [])

  const handleSearch = (event) => {
    console.log(event.target.value)
    setInput(event.target.value)
  }

  return (
    <>
      <Search handle={handleSearch}/>
      <Find countries={countries} input={input} handle={handleSearch}/>
    </>
  )
}

export default App
