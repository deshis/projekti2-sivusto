import { useState, useEffect } from 'react'
import axios from 'axios'
import Guess from './components/Guess'
import GuessForm from './components/GuessForm'

const App = () => {
  const [guesses, setGuesses] = useState([])
  const [monkey, setMonkey] = useState('')
  
  useEffect(() => {
    axios
      .get('https://projekti2-sivusto.onrender.com/api/randomtower')
      .then(response => {
        console.log('promise fulfilled')
        console.log(response.data.type)
        setMonkey(response.data.type)      
      })
  }, [])

  const addGuess = (newGuess) =>{
    setGuesses(guesses.concat(newGuess))
  }
  
  return(
    <div>
      <h1>Definitely the app ever!</h1>
      
      <GuessForm createGuess={addGuess}/>

      <ul>
          {guesses.map(guess =>
            <Guess key={guess} guess={guess} answer={monkey}/>
          )}
      </ul>

    </div>
  )
}

export default App
