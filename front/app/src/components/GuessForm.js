import { useState, useRef, useEffect } from 'react'
import Towers from '../services/Towers'

const GuessForm = ({ createGuess, options, yourTurn }) => {
    const [newGuess, setNewGuess] = useState('')
    const [suggestions, setSuggestions] = useState([]);
    const [hideSuggestions, sethideSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);
    const [topPath, setTopPath] = useState(0);
    const [midPath, setMidPath] = useState(0);
    const [botPath, setBotPath] = useState(0);

    const selectedRef = useRef(null); 
    const imageRef = useRef(null);

    useEffect(() => {
        if(selectedRef.current != null) 
            selectedRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    useEffect(()=>{
        if(options.indexOf(newGuess) > -1) imageRef.current.src = Towers.getTowerImage(newGuess, [topPath, midPath, botPath]);
        else imageRef.current.src = Towers.getDefaultTowerImage();
    }, [topPath, midPath, botPath, newGuess, options]);

    const guess = (event) =>{
        event.preventDefault()
        createGuess({type: newGuess, upgrades: [parseInt(topPath), parseInt(midPath), parseInt(botPath)]});
        setNewGuess('')
        setSuggestions([]);
        imageRef.current.src = Towers.getDefaultTowerImage();
    }

    const handler = input => {
        const isOption = options.some(function(element){
            if(element.toString().toLowerCase() === input.target.value.toLowerCase()){
                return true;
            }return false;
        });
        if(isOption) return;

        setSuggestions(options.filter(i => i.toString().toLowerCase().includes(input.target.value.toLowerCase())));
      };
    
    const handleChange = i => {
        const input = i.target.value;
        sethideSuggestions(false);
        setNewGuess(input);
    };

    const selectClicked = (value) => {
        setNewGuess(value);
        setSelectedSuggestion(0);
        setSuggestions([]);
    };

    const handleKeyDown = key => {

        if(key.keyCode === 13){
            key.preventDefault();
            if(suggestions.length > 0){
                setNewGuess(suggestions[selectedSuggestion]);
                setSelectedSuggestion(0);
                setSuggestions([]);
            }
        }

        if(key.keyCode === 38 && selectedSuggestion > 0 && suggestions.length > 0){
            setSelectedSuggestion(selectedSuggestion-1);
        }else if(key.keyCode === 40 && selectedSuggestion < suggestions.length-1 && suggestions.length > 0){
            setSelectedSuggestion(selectedSuggestion+1);
        }
    }

    const handlePathChange = (value, path, otherPaths) => {
        if(path > value) return true;
        if(otherPaths[0] > 0 && otherPaths[1] > 0) return false;
        else if(path > 1 && (otherPaths[0] > 2 || otherPaths[1] > 2)) return false;
        else return true;
    }

    return (
        <div>
            {yourTurn ?
            <form onSubmit={guess} className='guessform'>
                <br/><br/>
                <input 
                    value={newGuess} 
                    onChange={handleChange}
                    onKeyUp={handler}
                    onKeyDown={handleKeyDown}
                    placeholder="Who's that monkey ⁉️"
                />
                <br/>
                <div className="suggestions" style={{ display: hideSuggestions ? "none" : "block" }}>
                    {suggestions.map((item, i) => (
                    <div
                        key={"" + item + i}
                        className={selectedSuggestion === i ? 'active' : null}
                        ref={selectedSuggestion === i ? selectedRef : null}
                        onClick={() => {
                            selectClicked(item);
                        }}
                        
                    >
                        {item}
                    </div>
                    ))}
                </div>
                <div>
                    <div className='Upgrades'>
                        <br/>
                        <label>Upgrade Paths:</label>
                        <br/>
                        <div className='slider'>
                            <label>Top:<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></label>
                            <input type="range" value={topPath} min={0} max={5} onChange={(e)=> handlePathChange(e.target.value, topPath, [midPath, botPath]) ? setTopPath(e.target.value) : null}/>
                            <label><b>{topPath}</b></label>
                        </div>
                        <div className='slider'>
                            <label>Middle:</label>
                            <input type="range" value={midPath} min={0} max={5} onChange={(e)=> handlePathChange(e.target.value, midPath, [topPath, botPath]) ? setMidPath(e.target.value) : null}/>
                            <label><b>{midPath}</b></label>
                        </div>
                        <div className='slider'>
                            <label>Bottom:</label>
                            <input type="range" value={botPath} min={0} max={5} onChange={(e)=> handlePathChange(e.target.value, botPath, [topPath, midPath]) ? setBotPath(e.target.value) : null}/>
                            <label><b>{botPath}</b></label>
                        </div>
                        <br/>
                    </div>
                    <div className='TowerImage'>
                        <img src={Towers.getDefaultTowerImage()} alt="monkey" ref={imageRef}/>
                    </div>
                </div>

                <button type="submit">submit</button>
            </form>
            : null}
        </div>
    )
}

export default GuessForm