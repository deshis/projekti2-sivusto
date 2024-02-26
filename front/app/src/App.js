import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  
  const [monkey, setMonkey] = useState('')
  const [guesses, setGuesses] = useState([])
  const [newGuess, setNewGuess] = useState('')
  
  useEffect(() => {
    axios
      .get('https://projekti2-sivusto.onrender.com/api/randomtower')
      .then(response => {
        console.log('promise fulfilled')
        console.log(response.data.type)
        setMonkey(response.data.type)      
      })
  }, [])

  const guess = (event) =>{
    event.preventDefault()
    setGuesses(guesses.concat(newGuess))
    setNewGuess('')
  }

  const handleGuessChange = (event) => {
    setNewGuess(event.target.value)
  }

  
  return(
    <div>
      <h1>Definitely the app ever!</h1>

      <div>
        <form onSubmit={guess}>
          <label for="fname">Who's that monkey ⁉️</label>
          <input value={newGuess} onChange={handleGuessChange}></input>
          <button type="submit">enter</button>
        </form>
      </div>
      
      <ul>
          {guesses.map(guess =>
            <p>{guess} {(guess.toLowerCase()===monkey.toLowerCase())?'✅':'❌'}</p>
          )}
      </ul>

    </div>
  )
}

export default App
