import { useState, useEffect } from 'react'
import Guess from './components/Guess'
import GuessForm from './components/GuessForm'
import Towers from './services/Towers'

const App = () => {
  const [guesses, setGuesses] = useState([])
  const [monkey, setMonkey] = useState(null)
  const [monkeys, setMonkeys] = useState([])
  
  useEffect(() => {
    Towers.getRandomTower().then(tower => {
        console.log('promise fulfilled')
        console.log(tower.type)
        console.log(tower.upgrades)
        setMonkey(tower)
      })
  }, [])

  useEffect(() => {
    Towers.getTowerArray().then(towers => {
      setMonkeys(towers)
    });
  }, [])

  const addGuess = (newGuess) =>{
    console.log(newGuess);
    if(newGuess.monkey === undefined) {
      alert('Your input is empty!');
      return;
    }
    var success = monkeys.some(function(element) {
      if (newGuess.monkey.toLowerCase() === element.toLowerCase()) {
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
      <br/>
      <div className="row">
        
        <div className="column" >type</div> 
        <div className="column" >category</div>
        <div className="column" >top</div>
        <div className="column" >mid</div>
        <div className="column" >bot</div>
        <div className="column" >cost</div>

      </div>
      {guesses.map(guess =>
        <Guess key={guess} guess={guess} answer={monkey}/>
      )}

    </div>
  )
}

export default App
