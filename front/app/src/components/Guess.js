const Guess = ({ guess, answer}) => {
    return (
      <li>{guess}{guess.toLowerCase() === answer.toLowerCase() ? '✅':'❌'}</li>
    )
  }
  
  export default Guess