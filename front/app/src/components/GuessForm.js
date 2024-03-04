import { useState, useRef, useEffect } from 'react'

const GuessForm = ({ createGuess, options }) => {
    const [newGuess, setNewGuess] = useState('')
    const [suggestions, setSuggestions] = useState([]);
    const [hideSuggestions, sethideSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);
    const [topPath, setTopPath] = useState(0);
    const [midPath, setMidPath] = useState(0);
    const [botPath, setBotPath] = useState(0);

    const selectedRef = useRef(null); 

    useEffect(() => {
        if(selectedRef.current != null) 
            selectedRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    const guess = (event) =>{
        event.preventDefault()
        createGuess(newGuess);
        setNewGuess('')
        setSuggestions([]);
    }

    const handler = input => {
        const isOption = options.some(function(element){
            if(element.toString().toLowerCase() === input.target.value.toLowerCase())
                return true;
            return false;
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
        }else if(key.keyCode === 40 && selectedSuggestion < options.length-1 && suggestions.length > 0){
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
                <br/>
                <label>Paths:</label>
                <br/>
                <div className='slider'>
                    <label>{topPath}</label>
                    <input type="range" value={topPath} min={0} max={5} onChange={(e)=> handlePathChange(e.target.value, topPath, [midPath, botPath]) ? setTopPath(e.target.value) : null}/>
                </div>
                <div className='slider'>
                    <label>{midPath}</label>
                    <input type="range" value={midPath} min={0} max={5} onChange={(e)=> handlePathChange(e.target.value, midPath, [topPath, botPath]) ? setMidPath(e.target.value) : null}/>
                </div>
                <div className='slider'>
                    <label>{botPath}</label>
                    <input type="range" value={botPath} min={0} max={5} onChange={(e)=> handlePathChange(e.target.value, botPath, [topPath, midPath]) ? setBotPath(e.target.value) : null}/>
                </div>
                
                <br/>

                <button type="submit">submit</button>
            </form>
        </div>
    )
}

export default GuessForm