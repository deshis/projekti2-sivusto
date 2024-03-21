import { useState, useEffect, useRef } from 'react'
import Guess from './components/Guess'
import GuessForm from './components/GuessForm'
import Overlay from './components/Overlay'
import Towers from './services/Towers'
import Users from './services/Users'
import Login from './components/Login'

const App = () => {
  const [guesses, setGuesses] = useState([]);
  const [monkey, setMonkey] = useState(null);
  const [monkeyData, setMonkeyData] = useState(null);
  const [monkeys, setMonkeys] = useState([]);
  const [isResultOverlay, setIsResultOverlay] = useState(false);
  const [mainPath, setMainPath] = useState(null)
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [isScoresOverlay, setIsScoresOverlay] = useState(false);
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [dailyGame, setDailyGame] = useState(false);
  const [dailyDone, setDailyDone] = useState(false);
  
  const notificationRef = useRef(null);

  //User stays logged in even when page refreshes
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      if(!user) return;
      Users.setToken(user.token);
      setUser(user);
    }
  }, [setUser])

  useEffect(() => {
    if(user && !scores){
      Users.getScores().then(data => {setScores(data.scores)});
      Users.isDailyDone().then(data => {setDailyDone(data);});
    }
  }, [user, scores])

  useEffect(() => {
    Towers.getTowerArray().then(towers => {
      setMonkeys(towers);
    });
  }, [])

  
  const setNotification = (message) => {
    notificationRef.current.innerText = message;
    setTimeout(() => {
      notificationRef.current.innerText = "";
    }, 5000);
    
  }

  const handleLogOut = () =>{
    setUser(null);
    setIsLoginForm(false);
    window.localStorage.removeItem('loggedUser')
  }

  const handleGameStart = (isDaily) => {
    setDailyGame(isDaily);
    setGameStarted(true);

    if(isDaily){
      Towers.getDailyTower().then(tower => {
          console.log('the daily chongler');
          console.log(tower.type);
          console.log(tower.upgrades);
          setMonkey(tower);
          setMainPath(Towers.getLargestUpgrade(tower.upgrades));
          Towers.getTowerData(tower.type).then(data => setMonkeyData(data));
      });
    }else{
      Towers.getRandomTower().then(tower => {
        console.log(tower.type);
        console.log(tower.upgrades);
        setMonkey(tower);
        setMainPath(Towers.getLargestUpgrade(tower.upgrades));
        Towers.getTowerData(tower.type).then(data => setMonkeyData(data));
    });}
  }

  const handleRestart = () =>{
    setIsResultOverlay(false);
    setMonkey(null);
    setGuesses([]);
    setGameOver(false);
    setScoreSaved(false);
    setGameStarted(false);
  }

  const getTime = (d) => {
    const date = new Date(d);
    return date.toLocaleString('fi-FI', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  const saveScore = () =>{
    Users.postScore({daily: dailyGame, guesses: guesses.length, tower: monkey, time: Date.now()});
    if(dailyGame){
      Users.postDailyDone();
      setDailyDone(true);
    }
    setScoreSaved(true);
    setScores(null);
  }

  const addGuess = (newGuess) =>{
    console.log(newGuess);
    if(newGuess.monkey === undefined) {
      setNotification('Your input is empty!');
      return;
    }
    var success = monkeys.some(function(element) {
      if (newGuess.monkey.toLowerCase() === element.toLowerCase()) {
          setGuesses(guesses.concat(newGuess));  
          return true;
      }
      return false;
    });
    if(!success) setNotification('Add an acceptable monkey!');
    else if(monkey.upgrades.toString() === newGuess.paths.toString() && monkey.type === newGuess.monkey){
      setIsResultOverlay(true);
      setGameOver(true);
    }
  }
  
  return(
    <div style={{margin:'auto', width: '50%', textAlign:'center'}}>
      <h1>Guess the BloonsTD 6 tower!</h1>

      <div className='Notification' ref={notificationRef}></div>
      
      {user ? (
      <div>
        <p style={{color:"white"}}>logged in as:</p>
        <label>{user.username}</label><br/>
        <button onClick={()=>setIsScoresOverlay(!isScoresOverlay)}>scores</button>
        <button onClick={handleLogOut}>log out</button>
      </div>
      ) : (
        <button className='loginButton' onClick={()=>setIsLoginForm(!isLoginForm)}>Login?</button>
      )}
      
      {(isLoginForm && !user) ? (
        <Overlay isOpen={isLoginForm} close={() => setIsLoginForm(false)} >
          <Login setUser={setUser} setNotification={setNotification}/>
        </Overlay>
      ): null}

      {(isScoresOverlay && user && scores) ? (
        <Overlay isOpen={isScoresOverlay} close={() => setIsScoresOverlay(false)} >
          {scores.map((score) => 
            <div key={score.tower.type}>
              <label>{getTime(score.time)}</label> <br/>
              <label>Guesses: {score.guesses}</label> <br/>
              <label>{score.tower.type} {score.tower.upgrades.join('-')}</label>  <br/><br/>
            </div>
          )}
        </Overlay>
      ): null}

      
      {gameStarted ? (
        <>
          <label>{dailyGame ? 'Daily game' : 'Normal game'}</label>
          <GuessForm createGuess={addGuess} options={monkeys}/>
        </>
      ) : (
        <>
        <br/>
        <label>start game</label> <br/>
        <button onClick={()=>handleGameStart(false)}>normal</button>
        
        {user ? (dailyDone ? <label style={{color: "#bf3c2e"}}>daily done!</label> : <button style={{color: "#bf3c2e"}} onClick={()=>handleGameStart(true)}>daily</button>) : null}
        </>
      )}
      <br/>
      
      {guesses.length > 0 ? (
      <div className="row">  
        <div className="column" >type</div> 
        <div className="column" >category</div>
        <div className="column" >top</div>
        <div className="column" >mid</div>
        <div className="column" >bot</div>
        <div className="column" >cost</div>
      </div>
      ): null}
      
      {guesses.map((guess, i) =>
        <Guess key={i} guess={guess} answer={monkey} index={i}/>
      )}

      {gameOver ? (<button onClick={handleRestart}>new game?</button>) : null}

      <Overlay isOpen={isResultOverlay} close={() => setIsResultOverlay(false)}>
          {monkey && monkeyData && mainPath ? ( 
          <div>
            <div className='overlayText'>
              <div>{monkey.type} {monkey.upgrades.join("-")}</div>
              {(mainPath.tier >= 0) ? monkeyData.upgrades[mainPath.path][mainPath.tier].name : monkeyData.type} <br/>
              Category: {monkeyData.category}<br/><br/>
              {(mainPath.tier >= 0) ? monkeyData.upgrades[mainPath.path][mainPath.tier].description : monkeyData.description}<br/><br/>
            </div>
            <div className='overlayImage'>
              <br/>
              <img src={(mainPath.tier >= 0) ? monkeyData.upgrades[mainPath.path][mainPath.tier].image : monkeyData.image} alt="monkey"/>
            </div>
            <br/>
            Total guesses: {guesses.length} <br/>
            {!scoreSaved ? <button onClick={saveScore}>save score</button> : <><br/>score saved as {user.username}<br/></> }
            <button onClick={handleRestart}>new game?</button>
          </div> ) : null
          }
      </Overlay>

    </div>
  )
}

export default App
