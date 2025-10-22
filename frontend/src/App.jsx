import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Note from './components/Note'
import Numbers from './components/Numbers'
import Search from './components/Search'
import axios from 'axios'
import personService from './services'
import Notification from './Notification'
import Country from './Country'


const Hello = (props) => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear
    return yearNow - props.age
  }
}

const Display = ({ counter }) => {
  return (
    <div>
      {counter}
    </div>
  )
}

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Statistics = ({ good, bad, neutral, handleBad, handleGood, handleNeutral, totel }) => {

  if (totel !== 0) {

    return (
      <div>
        <h4>Statistics</h4>
        <p>{good}</p>
        <p>{bad}</p>
        <p>{neutral}</p>
        <p>Total Reviews - {totel}</p>
        <p>Average - {(good + bad + neutral) / 3}</p>
      </div>
    )
  }
  {
    return (
      <div>
        <p>No Feedback given</p>
      </div>
    )
  }
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const [newName, setNewName] = useState('')
  const [newPhone, setPhone] = useState('')
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleNoteChange = (event) => {
    setNewName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    setPhone(event.target.value)
  }

  const handleSearch = (event) => {
    const term = event.target.value
    if (term){
      setSearch(term)

    }else{
      setCountry('')
      setSearch('')
    }
  }

  useEffect(() => {
    personService
      .getAll()
      .then(person => {
        setPersons(person)
        console.log(person)
      })
  }, [])

  useEffect(() => {
    if(country){
      personService
      .getWeatherData(country?.latlng[0],country.latlng[1])
      .then(response => {
        setWeather(response)
      })
    }
  },[country])


  const addPhone = (event) => {
    event.preventDefault()
    const newObject = {
      name: newName,
      number: newPhone,
    }

    const exists = persons.find(person => person.name.trim().toLowerCase() === newName.trim().toLowerCase())

    if (exists) {
      if (!window.confirm(`${exists.name} already exists, do you want to update the phone number`)) return
      const changedPhone = { ...exists, number: newPhone }

      personService
        .update(exists.id, changedPhone)
        .then(response => {
          setPersons(persons.map(person => person.id === exists.id ? response : person))
          setNewName('')
          setPhone('')
        })
        .catch(error => {
          setErrorMessage(`there was an error updating`)
        })

    } else {
      personService
        .create(newObject)
        .then(response => {
          setPersons(persons.concat(response))
          setErrorMessage(`${response.name} Added`)
          setTimeout(() => {
            setErrorMessage('')
          }, 5000)
          setNewName('')
          setPhone('')
        })
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this')) return
    personService
      .deleteObject(id)
      .then(response => {
        console.log('deleted')
        setPersons(prev => prev.filter(p => p.id !== id));
      })
      .catch(error => {
        setErrorMessage(`error deleting`)
      })
  }

  const handleShow = (name) => {
    if (name){
      personService.getByName(name)
        .then(response => {
          setCountry(response)
        })
    }
  }


  const filtered = search.trim() === '' ? [] :
    persons.filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()))

    // if (filtered.length === 1){
    //   personService
    //   .getWeatherData(filtered[0]?.latlng[0],filtered[0].latlng[1])
    //   .then(response => {
    //     setWeather(response)
    //   })
    // }

  return (
    <div>
      <h2>Phonebook</h2>
      {errorMessage &&
      <Notification message={errorMessage}/>
      }
      <form onSubmit={addPhone}>
        <div>
          name: <input value={newName} onChange={handleNoteChange} />
          phone: <input value={newPhone} onChange={handlePhoneChange} />
        </div>
        <div>

          <button type="submit">add</button>
        </div>
      </form>

      <div>
        <h3>Find Persons</h3>
        <Search value={search} onChange={handleSearch} />
      </div>

      {filtered && filtered.map((person) => (
        <ul>
          <li key={persons.id}>
            {person.name} {person.number}
          </li>
        </ul>
      ))}

      {/* <div>
        <Numbers
          countries={filtered}
          handleShow={handleShow}
          weather={weather}
        />
      </div>
      {country && (
       <Country country={country} weather={weather} />
      )} */}

     
  </div>
  )
}

export default App
