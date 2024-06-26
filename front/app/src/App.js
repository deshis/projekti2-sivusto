import { useState, useEffect, useRef } from 'react'
import Guess from './components/Guess'
import GuessForm from './components/GuessForm'
import Overlay from './components/Overlay'
import Towers from './services/Towers'
import Users from './services/Users'
import Login from './components/Login'
import Tutorial from './components/Tutorial'

const App = () => {
  const [guesses, setGuesses] = useState([]);
  const [tower, setTower] = useState(null);
  const [towerData, setTowerData] = useState(null);
  const [towers, setTowers] = useState([]);
  const [isResultOverlay, setIsResultOverlay] = useState(false);
  const [mainPath, setMainPath] = useState(null)
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [isScoresOverlay, setIsScoresOverlay] = useState(false);
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [dailyGame, setDailyGame] = useState(false);
  const [dailyDone, setDailyDone] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);
  const [isLeaderboard, setIsLeaderboard] = useState(false);
  const [leaderboardDate, setLeaderboardDate] = useState(new Date(new Date().toDateString()));
  const [tutorial, setTutorial] = useState(false);
  const [isVersus, setIsVersus] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [roomJoined, setRoomJoined] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [yourTurn, setYourTurn] = useState(false);
  const [versusData, setVersusData] = useState(null);
  const [guessCount, setGuessCount] = useState(0);
  const [winner, setWinner] = useState("");
  const [versusGameEnded, setVersusGameEnded] = useState(false);
  const [chat, setChat] = useState([]);
  const [newChat, setNewChat] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);

  const notificationRef = useRef(null);
  const chatRef = useRef(null);
  const guessRef = useRef(null);

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
    if(!leaderboard){
      Users.getLeaderboard(leaderboardDate).then(board => {
        setLeaderboard(board);
      });
    }
  }, [leaderboard, leaderboardDate])

  useEffect(() => {
    Towers.getTowerArray().then(towers => {
      setTowers(towers);
    });
  }, [])

  useEffect(() => {
    if(!guessRef.current) return;
    guessRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [guesses]);

  useEffect(()=> {
    if(!chatRef.current) return;
    chatRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [chat]);

  useEffect(()=> {
    if(!versusData) return;

    if(!roomJoined && guesses > 0){
      setGuesses([]);
      setIsResultOverlay(false);
      return;
    }else if(!roomJoined) return;

    if(versusData.guesses.length > guesses.length){
      setGuesses(guesses.concat(versusData.guesses[guessCount-1].guess));
    }
  }, [guesses, guessCount, versusData, roomJoined]); 

  useEffect(()=> {
    if(!tower || !guesses || !roomJoined || mainPath) return;
    if(guesses <= 0) return;

    if(tower.upgrades.toString() === guesses[guesses.length-1].upgrades.toString()  && tower.type === guesses[guesses.length-1].type){
      Towers.getTowerData(tower.type).then(data => {
        setTowerData(data);
        setMainPath(Towers.getLargestUpgrade(tower.upgrades));
        handleVersusGameOver();
      });
    }
  }, [tower, guesses, roomJoined, mainPath]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=> {
    if(versusGameEnded && winner === "" && versusData.guesses.length === guesses.length)
      setWinner(versusData.guesses[versusData.guesses.length-1].user);
  }, [versusGameEnded, winner, versusData, guesses.length]);
  
  const updateDate = (change) => {
    setLeaderboard(null);
    let date = new Date(leaderboardDate);
    date.setDate(date.getDate() + change);
    setLeaderboardDate(date);
  }

  const setNotification = (message) => {
    notificationRef.current.innerText = message;
    setTimeout(() => {
      notificationRef.current.innerText = "";
    }, 5000);
    
  }

  const handleLogOut = () =>{
    setUser(null);
    setIsLoginForm(false);
    window.localStorage.removeItem('loggedUser');
    setScores(null);
  }

  const handleGameStart = (isDaily) => {
    setDailyGame(isDaily);
    setGameStarted(true);

    if(isDaily){
      Towers.getDailyTower().then(tower => {
          setTower(tower);
          setMainPath(Towers.getLargestUpgrade(tower.upgrades));
          Towers.getTowerData(tower.type).then(data => setTowerData(data));
      });
    }else{
      Towers.getRandomTower().then(tower => {
        setTower(tower);
        setMainPath(Towers.getLargestUpgrade(tower.upgrades));
        Towers.getTowerData(tower.type).then(data => setTowerData(data));
    });}
  }

  const handleRestart = () =>{
    if(isVersus){
      leaveRoom();
      return;
    }
    if(dailyGame){
      Users.postDailyDone();
      setDailyDone(true);
    }
    setTower(null);
    setGuesses([]);
    setScoreSaved(false);
    setGameStarted(false);
  }

  const getTime = (d) => {
    const date = new Date(d);
    return date.toLocaleString('fi-FI', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  const getDate = (d) => {
    const date = new Date(d);
    return date.toLocaleString('fi-FI', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  const saveScore = () =>{
    const score = {daily: dailyGame, guesses: guesses.length, tower: tower, time: Date.now()};
    Users.postScore(score);
    if(dailyGame){
      Users.postLeaderboardEntry(score);
    }
    setScoreSaved(true);
    setScores(null);
  }

  const addGuess = (newGuess) =>{
    if(newGuess.type === undefined) {
      setNotification('Your input is empty!');
      return;
    }
    var success = towers.some(function(element) {
      if (newGuess.type.toLowerCase() === element.toLowerCase()) {
          setGuesses(guesses.concat(newGuess));  
          return true;
      }
      return false;
    });
    if(!success) setNotification('Add an acceptable tower!');
    else if(tower.upgrades.toString() === newGuess.upgrades.toString() && tower.type === newGuess.type){
      setIsResultOverlay(true);
    }
  }

  const versusGuess = (newGuess) =>{
    if(newGuess.type === undefined) {
      setNotification('Your input is empty!');
      return;
    }
    
    if (towers.includes(newGuess.type)){
      Users.postVersusGuess(newGuess, roomCodeInput);
      setGuesses(guesses.concat(newGuess));
      setGuessCount(guessCount+1);
    }
    else{
        setNotification('Add an acceptable tower!');
        return;
    }
  }

  const handleVersusGameOver = () => {
    setIsResultOverlay(true);
    setVersusGameEnded(true);
  }

  const createRoom = () => {
    Users.getRandomRoomCode().then(code => {
      setRoomCodeInput(code);
      setCreatingRoom(true);
      setTimeout(() => {
        Users.postVersusJoin(code).then(data =>{
          setCreatingRoom(false);
          setRoomJoined(true);
          setWaitingForOpponent(true);
        }).catch(error => {
          setNotification(error.response.data.error);
          setCreatingRoom(false);
        });
      }, 2000);
    })
  }

  const joinRoom = (event) =>{
    event.preventDefault();
    if(roomCodeInput.length !== 5) setNotification('Room code has to be 5 digits long');
    else if(roomCodeInput.match(/[^$,.\d]/)) setNotification('Room code has to contain only numbers');
    else{
      setJoiningRoom(true);
      setTimeout(() => {
        Users.postVersusJoin(roomCodeInput).then(data =>{
          setJoiningRoom(false);
          setRoomJoined(true);
          setWaitingForOpponent(true);
        }).catch(error => {
          setNotification(error.response.data.error);
          setJoiningRoom(false);
        });
      }, 2000);
    }
  }

  const checkData = (data) =>{
    if(!roomJoined) return;
    setTimeout(() => {
      if(data.players.length === 2){
        if(!tower) setTower(data.answer);

        setWaitingForOpponent(false);
        setYourTurn(data.turn === user.username);
        setVersusData(data);
        
        if(!yourTurn && data.guesses.length > guesses.length){
          setGuessCount(data.guesses.length);
        } 
      }

      getVersusData();
    }, 500);
  }

  const checkChat = (data) =>{
    if(!roomJoined) return;
    setTimeout(() => {
      if(chat !== data.messages){
        setChat(data.messages);
      }
      getChatData();
    }, 500);
  }
  
  const getVersusData = () =>{
    Users.getVersusData(roomCodeInput, checkData);
  }

  const getChatData = () =>{
    Users.getChatMessages(roomCodeInput, checkChat);
  }

  useEffect(()=> {
    if(!roomJoined) return;

    getVersusData(roomCodeInput);
    getChatData(roomCodeInput);
  }, [roomCodeInput, roomJoined]); // eslint-disable-line react-hooks/exhaustive-deps

  const leaveRoom = () =>{
    Users.cancelVersusDataRequest();
    setVersusData(null);
    setRoomJoined(false);
    setWaitingForOpponent(false);
    setYourTurn(false);
    setTower(null);
    setGuesses([]);
    setGuessCount(0);
    setIsResultOverlay(false);
    setMainPath(null);
    setWinner("");
    setRoomCodeInput("");
    setVersusGameEnded(false);
    setChat([]);
    Users.postVersusLeave(roomCodeInput).then(data => {
        Users.resetAfterAbort();
    }).catch(error => setNotification(error.response.data.error));
  }

  const postChat = (event) => {
    event.preventDefault();
    if(newChat === ""){
      setNotification("Can't send empty chat!");
      return;
    }

    setNewChat("");
    Users.postChat(roomCodeInput, newChat).then(data => {
    }).catch(error => setNotification(error.response.data.error));
  }
  
  const backToMenu = (event) => {
    event.preventDefault();
    setIsVersus(false);
    setDailyGame(false);
    setGameStarted(false);
    handleRestart();
  } 

  return(
    <>
    <div style={{margin:'auto', textAlign:'center'}}>
      <h1>Guess the BloonsTD 6 tower!</h1>
      {user ? (
      <div>
        <div style={{display: 'inline-block'}}><p style={{color: 'white'}}>user:  <label>{user.username}</label></p></div>
        <button style={{margin:10}} onClick={handleLogOut}>log out</button> <br/>
      </div>
      ) : (
        <button className='loginButton' onClick={()=>setIsLoginForm(!isLoginForm)}>Login?</button>
      )}

      <div>
        {user ? <button onClick={()=>setIsScoresOverlay(!isScoresOverlay)}>scores</button> : null}
        <button onClick={()=>setIsLeaderboard(!isLeaderboard)}>leaderboard</button>
      </div>
      
      {(isLoginForm && !user) ? (
        <Overlay isOpen={isLoginForm} close={() => setIsLoginForm(false)} >
          <Login setUser={setUser} setNotification={setNotification}/>
        </Overlay>
      ): null}

      {(isScoresOverlay && user && scores) ? (
        <Overlay isOpen={isScoresOverlay} close={() => setIsScoresOverlay(false)}>
          <div className='scoreHolder'>
            <div className='scoreBlock'>
            <label>Daily Game</label> <br/><br/>
              {scores.filter(score => score.daily).map((score) => 
                <div key={score.tower.type}>
                  <label><label className='date'>{getDate(score.time)}</label></label> <br/>
                  <label>Guesses: <b>{score.guesses}</b></label> <br/>
                  <label><label className="type">{score.tower.type}</label> {score.tower.upgrades.join('-')}</label>
                  <img className="scoreImage" alt="scoreImage" src={Towers.getTowerImage(score.tower.type, score.tower.upgrades)}></img>  <br/><br/>
                </div>
              )}
            </div>
            <div className='scoreBlock'>
              <label>Normal Game</label> <br/><br/>
              {scores.filter(score => !score.daily).map((score) => 
                <div key={score.tower.type}>
                  <label><label className='date'>{getTime(score.time)}</label></label> <br/>
                  <label>Guesses: <b>{score.guesses}</b></label> <br/>
                  <label><label className="type">{score.tower.type}</label> {score.tower.upgrades.join('-')}</label>  <br/>
                  <img className="scoreImage" alt="scoreImage" src={Towers.getTowerImage(score.tower.type, score.tower.upgrades)}></img> <br/><br/>
                </div>
              )}
            </div>
          </div>
        </Overlay>
      ): null}

      {(leaderboard) ? (<Overlay isOpen={isLeaderboard} close={() => setIsLeaderboard(false)}>
        <div className='leaderboard'>
        <button className="left" onClick={()=>updateDate(-1)}>⬅️</button><label className='date'>{getDate(leaderboardDate)}</label> {(new Date(new Date().toDateString())) <= leaderboardDate ? <div className="right"/> : <button className="right" onClick={()=>updateDate(1)}>➡️</button>}
        <br/><br/>
        {leaderboard.scores.length > 0 ? leaderboard.scores.sort((a, b) => a.guesses - b.guesses).map((entry) => 
            <div className='leaderboardEntry' key={entry.username}>
                <label className='username'>{entry.username}</label> <br/>
                <label><label className='date'>{getTime(entry.time)}</label></label> <br/>
                <label>Guesses: <b>{entry.guesses}</b></label> <br/>
            </div>
        ): <label className='leaderboardEntry'><br/>no daily scores</label>}
        </div>
      </Overlay>) : null}

      {(tutorial) ? (
      <Overlay isOpen={tutorial} close={() => setTutorial(false)}>
        <Tutorial/>
      </Overlay>
      ): null}
      
      {!gameStarted && !isVersus ? (
        <div>
          <br/>
          <label>Play!</label><br/>
          <button onClick={()=>setTutorial(true)}>tutorial</button><br/>
          {user ? (dailyDone ? <label style={{color: "#bf3c2e"}}><br/>daily done!</label> : <button style={{color: "#bf3c2e"}} onClick={()=>handleGameStart(true)}>daily</button>) : <label style={{fontSize: 20, color: "#bf3c2e"}}><br/>login for daily</label>}
          <button style={{marginTop:0}} onClick={()=>handleGameStart(false)}>normal</button>
          {user ? <button style={{color: "#7f12a1"}} onClick={()=>setIsVersus(true)}>versus</button> : <label style={{fontSize: 20, color: "#7f12a1"}}><br/>login for versus</label>}
        </div>
      ) : !roomJoined ? <button onClick={backToMenu}>back to menu</button> : null}

      <br/>

      {gameStarted ? <label><b>{dailyGame ? 'Daily Game' : 'Normal Game'}</b></label> : null}

      <br/>
      
      {gameStarted ? (
        <div>
          <br/>
          <GuessForm createGuess={addGuess} options={towers} yourTurn={true}/>
        </div>
      ) :null}

      {isVersus && !roomJoined && !joiningRoom && !creatingRoom ? (
        <div>
          <br/><br/>
          <label style={{color: "#7f12a1"}}>Versus!</label> <br/>
          <button onClick={createRoom}>Create New Room</button><br/><br/>
          <form onSubmit={joinRoom}>
            <label>Join Room</label><br/><br/>
            <label>Code: </label><input className='roomcode' value={roomCodeInput} onChange={(text)=>setRoomCodeInput(text.target.value)}/><button type='submit'>Join</button>
          </form>
        </div>
      ) :null}

      {roomJoined ? (
          <div>
          <br/>
          <label style={{color: "#7f12a1"}}>Versus!</label> <br/>
          <label>Joined Room <i>{roomCodeInput}</i></label>
          <button onClick={leaveRoom}>leave room</button>
          <br/>
          {waitingForOpponent ? 
            <label>waiting for opponents...</label>
          :
          <div>
            <label>Game Started - {versusGameEnded ? "Game Ended" : yourTurn ? "Your Turn" : "Opponents Turn"}</label>
            <div style={{display: 'flex', maxWidth: '1300px', margin: 'auto', padding: '25px'}}>
              <GuessForm createGuess={versusGuess} options={towers} yourTurn={versusGameEnded ? false : yourTurn}/>
              <div className='chat'>
              <br/>
              <label>Chat</label>
              <div className='chatHolder'>
              {chat ? chat.map((message, i) => 
                <div className='chatMessage' key={i} ref={chatRef}>
                  <label><label className='chatUser'>{message.user}</label>: {message.message}</label>
                </div>
              ): null}
              </div>
              <div style={{marginTop: 'auto'}}>
              <form onSubmit={postChat}>
                <label>chat: </label><input className='chatInput' value={newChat} onChange={(text)=>setNewChat(text.target.value)}/><button type='submit'>Post</button>
              </form>
              </div>
              </div>
            </div>
          </div>
          }
          </div>
      ): 
      creatingRoom ? 
      <div>
        <br/>
        <label style={{color: "#7f12a1"}}>Versus!</label> <br/><br/>
        <label>Creating Room <i>{roomCodeInput}</i>...</label>
      </div>
      :
      joiningRoom ?
      <div>
        <br/>
        <label style={{color: "#7f12a1"}}>Versus!</label> <br/><br/>
        <label>Joining Room <i>{roomCodeInput}</i>...</label>
      </div>
      : null}

      <br/><br/>
      <div className='guessHolder'>
        {guesses.length > 0 ? (
        <div>
          <br/>
          <div className="row">  
            <div className="column" >Type</div> 
            <div className="column" >Category</div>
            <div className="column" >Top Path</div>
            <div className="column" >Middle Path</div>
            <div className="column" >Bottom Path</div>
            <div className="column" >Cost</div>
          </div>
        </div>
        ): null}
        {guesses.map((guess, i) =>
          <Guess key={i} guess={guess} answer={tower} index={i} guessRef={guessRef}/>
        )}
      </div>

      <Overlay isOpen={isResultOverlay} close={() => setIsResultOverlay(false)}>
          {tower && towerData && mainPath ? ( 
          <div>
            <div className='resultScreenText'>
              <label><label className='type'>{tower.type}</label> {tower.upgrades.join("-")}</label><br/>
              <label className='upgradeName'>{(mainPath.tier >= 0) ? towerData.upgrades[mainPath.path][mainPath.tier].name : towerData.type}</label> <br/>
              <label>Category: <label className='category'>{towerData.category}</label></label><br/><br/>
              <label className='desc'>{(mainPath.tier >= 0) ? towerData.upgrades[mainPath.path][mainPath.tier].description : towerData.description}</label><br/><br/>
            </div>
            <div className='resultScreenImage'>
              <br/>
              <img src={(mainPath.tier >= 0) ? towerData.upgrades[mainPath.path][mainPath.tier].image : towerData.image} alt="tower"/>
            </div>
            <br/>
            <label>Total guesses: <b>{guesses.length}</b> <br/></label>
            {isVersus && winner ? <label>winner: {winner}</label>:null}
            {isVersus ? null : (!scoreSaved ? <button onClick={saveScore}>save score</button> : <p style={{fontSize: "20px", color: "white", display: 'inline-block'}}>score saved as {user.username}</p>)}
            <button onClick={handleRestart}>new game?</button>
          </div> ) : null
          }
      </Overlay>
      <div className='Notification' ref={notificationRef}></div>
    </div>
    </>
  )
}

export default App
