import { useState } from 'react'

const GuessForm = ({ createGuess, options }) => {
    const [newGuess, setNewGuess] = useState('')
    const [suggestions, setSugesstions] = useState([]);
    const [hideSuggestions, sethideSuggestions] = useState(false);

    const guess = (event) =>{
        event.preventDefault()
        createGuess(newGuess);
        setNewGuess('')
    }

    const handler = input => {
        setSugesstions(options.filter(i => i.toString().toLowerCase().startsWith(input.target.value.toLowerCase())));
      };
    
      const handleChange = i => {
        const input = i.target.value;
        sethideSuggestions(false);
        setNewGuess(input);
      };
    
      const hideSuggested = value => {
        setNewGuess(value);
        sethideSuggestions(true);
      };

    

    return (
        <div>
            <form onSubmit={guess}>
                <label>Who's that monkey ⁉️</label>
                <br/>
                <input 
                    className='inputfield'
                    value={newGuess} 
                    onChange={handleChange}
                    onKeyUp={handler}
                />
                <button type="submit">enter</button>
            </form>

            <div className="suggestions" style={{ display: hideSuggestions ? "none" : "block" }}>
                {suggestions.map((item, idx) => (
                <div
                    key={"" + item + idx}
                    onClick={() => {
                        hideSuggested(item);
                    }}
                >
                    {item}
                </div>
                ))}
            </div>
        </div>
    )
}

export default GuessForm