import { useState } from 'react';

const Tutorial = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const content = [
        <label>Welcome to the Guess the BloonsTD 6 Tower game! Your goal in this game is to guess a random Bloons Tower Defence tower and its upgrades in the least guesses possible.</label>,
        <div><label>If you aren't that familiar with Bloons the each tower has three upgrade paths: Top, middle and bottom. Each upgrade path has 5 tiers of upgrades. Each tower can be upgraded in one tier up to 5 tiers and also a second path but only up to two tiers.</label><img alt="example"src={"https://i.ytimg.com/vi/RIMo9kPbJRY/maxresdefault.jpg"}/></div>
    ]

    const updatePage = (change) => {
        setCurrentPage(currentPage+change);
    }

    return (
        <div className='tutorial'>
            {currentPage > 0 ? <button className="left" onClick={()=>updatePage(-1)}>⬅️</button> : <div className="left"/>}
            <label className='date'><b>Tutorial</b></label>
            {currentPage +1 >= content.length ? <div className="right"/> : <button className="right" onClick={()=>updatePage(1)}>➡️</button>}
            <div style={{flexBasis: "100%"}}><br/>{content[currentPage]}</div>
        </div>
    )
}

export default Tutorial;