import { useState, useRef, useEffect } from 'react'

const GuessForm = ({ createGuess, options }) => {
    const [newGuess, setNewGuess] = useState('')
    const [suggestions, setSuggestions] = useState([]);
    const [hideSuggestions, sethideSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);

    const selectedRef = useRef(null); 

    useEffect(() => {
        if(selectedRef.current != null) 
            selectedRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    const guess = (event) =>{
        event.preventDefault()
        createGuess(newGuess);
        setNewGuess('')
    }

    const handler = input => {
        setSuggestions(options.filter(i => i.toString().toLowerCase().startsWith(input.target.value.toLowerCase())));
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
            console.log(suggestions)
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

                <button type="submit">submit</button>
            </form>
        </div>
    )
}

export default GuessForm