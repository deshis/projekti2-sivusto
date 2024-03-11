import { useState, useEffect } from 'react'
import Guess from './components/Guess'
import GuessForm from './components/GuessForm'
import Overlay from './components/Overlay'
import Towers from './services/Towers'
import Login from './components/Login'

const App = () => {
  const [guesses, setGuesses] = useState([]);
  const [monkey, setMonkey] = useState(null);
  const [monkeyData, setMonkeyData] = useState(null);
  const [monkeys, setMonkeys] = useState([]);
  const [isResultOverlay, setIsResultOverlay] = useState(false);
  const [mainPath, setMainPath] = useState(null)
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if(!monkey){
      Towers.getRandomTower().then(tower => {
          console.log('promise fulfilled');
          console.log(tower.type);
          console.log(tower.upgrades);
          setMonkey(tower);
          setMainPath(Towers.getLargestUpgrade(tower.upgrades));
          Towers.getTowerData(tower.type).then(data => setMonkeyData(data));
      })
    }
  }, [monkey])

  useEffect(() => {
    Towers.getTowerArray().then(towers => {
      setMonkeys(towers);
    });
  }, [])

  const handleRestart = () =>{
    setIsResultOverlay(false);
    setMonkey(null);
    setGuesses([]);
  }

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
    else if(monkey.upgrades.toString() === newGuess.paths.toString() && monkey.type === newGuess.monkey){
      setIsResultOverlay(true);
    }
  }
  
  return(
    <div style={{margin:'auto', width: '50%', textAlign:'center'}}>
      <h1>Definitely the app ever!</h1>
      
      {user ? (<div><p style={{color:"white"}}>logged in as:</p> <label>{user.username}</label></div>) : null}
      {!user ? (
        <button className='loginButton' onClick={()=>setIsLoginForm(!isLoginForm)}>Login?</button>
      ): null}
      {(isLoginForm && !user) ? (
        <Overlay isOpen={isLoginForm} close={() => setIsLoginForm(false)} >
          <Login setUser={setUser}/>
        </Overlay>
      ): null}
      
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
      {guesses.map((guess, i) =>
        <Guess key={i} guess={guess} answer={monkey} index={i}/>
      )}

      <Overlay isOpen={isResultOverlay} close={() => setIsResultOverlay(false)}>
          {monkey && monkeyData && mainPath ? ( 
          <div>
            <div className='overlayText'>
              <div>{monkey.type} {monkey.upgrades.join("-")}</div>
              {monkeyData.upgrades[mainPath.path][mainPath.tier].name} <br/>
              Category: {monkeyData.category}<br/><br/>
              {monkeyData.upgrades[mainPath.path][mainPath.tier].description}<br/><br/>
            </div>
            <div className='overlayImage'>
              <br/>
              <img src={monkeyData.upgrades[mainPath.path][mainPath.tier].image} alt="monkey"/>
            </div>
            <br/>
            Total guesses: {guesses.length} <br/>
            <button onClick={handleRestart}>new game?</button>
          </div> ) : null
          }
      </Overlay>

    </div>
  )
}

export default App
