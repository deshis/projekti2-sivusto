import { useState } from 'react';

const Tutorial = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const content = [
        <label>Welcome to the Guess the BloonsTD 6 Tower game! Your goal in this game is to guess a random Bloons Tower Defence tower and its upgrades in the least guesses possible.</label>,
        <div>
            <label>If you aren't that familiar with Bloons the each tower has three upgrade paths: Top, middle and bottom. Each upgrade path has 5 tiers of upgrades. Each tower can be upgraded in one tier up to 5 tiers and also a second path but only up to two tiers.</label>
            <br/><br/>
            <img style={{marginLeft: "auto", marginRight: "auto", display: "block"}} alt="example"src={"https://i.ytimg.com/vi/RIMo9kPbJRY/maxresdefault.jpg"}/>
        </div>,
        <label>The game has three modes.
            <ul>
                <li><b>Normal</b></li>
                <ul>
                    <li>You'll be given a random tower to guess. You can play as many times as you want and save your score!</li>
                </ul>
                <li><b>Daily</b></li>
                <ul>
                    <li>You'll be given the daily tower to guess. You can once a day and save your score! You have to be logged in to play this mode. </li>
                </ul>
                <li><b>Versus</b></li>
                <ul>
                    <li>Versus is a one vs one gamemode. You can create or join a room where a other player can also play. You'll be given a random tower to guess and you'll take turns with the other player trying to guess the tower. You have to be logged in to play this mode.</li>
                </ul>
            </ul>
        </label>,
        <div>
            <label>If you're logged in you can save your score in normal and daily modes. To see them go to the scores section. There is also a leaderboard for daily scores.</label>
        </div>
    ]

    const updatePage = (change) => {
        setCurrentPage(currentPage+change);
    }

    return (
        <div className='tutorial'>
            {currentPage > 0 ? <button className="left" onClick={()=>updatePage(-1)}>⬅️</button> : <div className="left"/>}
            <label className='date'><b>Tutorial</b></label>
            {currentPage +1 >= content.length ? <div className="right"/> : <button className="right" onClick={()=>updatePage(1)}>➡️</button>}
            <div className='tutorialContent'>{content[currentPage]}</div>
        </div>
    )
}

export default Tutorial;