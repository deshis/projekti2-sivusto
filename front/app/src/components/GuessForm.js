import { useState } from 'react'

const GuessForm = ({ createGuess }) => {
    const [newGuess, setNewGuess] = useState('')

    const guess = (event) =>{
        event.preventDefault()
        createGuess(newGuess);
        setNewGuess('')
    }

    return (
        <div>
            <form onSubmit={guess}>
                <label>Who's that monkey ⁉️</label>
                <input value={newGuess} onChange={event => setNewGuess(event.target.value)}></input>
                <button type="submit">enter</button>
            </form>
        </div>
    )

}

export default GuessForm