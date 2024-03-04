const Guess = ({ guess, answer}) => {
    return (
      <p className="guess">{guess}{guess.toLowerCase() === answer.toLowerCase() ? '✅':'❌'}</p>
    )
  }
  
  export default Guess