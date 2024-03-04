import { useState, useEffect } from 'react'
import axios from 'axios'
import Guess from './components/Guess'
import GuessForm from './components/GuessForm'

const backURL = 'https://projekti2-sivusto.onrender.com';

const App = () => {
  const [guesses, setGuesses] = useState([])
  const [monkey, setMonkey] = useState('')
  const [monkeys, setMonkeys] = useState([])
  
  useEffect(() => {
    axios
      .get(backURL+"/api/towers/randomtower")
      .then(response => {
        console.log('promise fulfilled')
        console.log(response.data.type)
        setMonkey(response.data.type)      
      })
  }, [])

  useEffect(() => {
    axios
      .get(backURL+"/api/towers")
      .then(response => {
        const result = [];
        for(var monke in response.data.towers)
          result.push([response.data.towers[monke]]);
        setMonkeys(result)
      })
  }, [])

  const addGuess = (newGuess) =>{
    if(newGuess === '') {
      alert('Your input is empty!');
      return;
    }
    var success = monkeys.some(function(element) {
      if (newGuess[0].toLowerCase() === element[0].toLowerCase()) {
          setGuesses(guesses.concat(newGuess));  
          return true;
      }
      return false;
    });
    if(!success) alert('Add an acceptable monkey!');
  }
  
  return(
    <div style={{margin:'auto', width: '50%', textAlign:'center'}}>
      <h1>Definitely the app ever!</h1>
      
      <GuessForm createGuess={addGuess} options={monkeys}/>

      {guesses.map(guess =>
        <Guess key={guess} guess={guess} answer={monkey}/>
      )}

    </div>
  )
}

export default App
