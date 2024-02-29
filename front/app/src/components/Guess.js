const Guess = ({ guess, answer}) => {
    return (
      <li className="guess">{guess}{guess.toLowerCase() === answer.toLowerCase() ? '✅':'❌'}</li>
    )
  }
  
  export default Guess