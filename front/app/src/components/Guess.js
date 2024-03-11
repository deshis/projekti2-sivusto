import { useEffect, useRef } from "react";
import Towers from "../services/Towers"

const Guess = ({ guess, answer, index}) => {
  const type = useRef(null);
  const categoryRef = useRef(null); 
  const costRef = useRef(null);
  const topRef = useRef(null);
  const midRef = useRef(null);
  const botRef = useRef(null);

  useEffect(() => {
    Towers.getTowerData(guess.monkey).then(data =>{
      const category = data.category;
      Towers.getTowerData(answer.type).then(data =>{
        type.current.innerText = data.type === guess.monkey ? "✔️" : "❌";
        categoryRef.current.innerText = data.category === category ? "✔️" : "❌";
        topRef.current.innerText = answer.upgrades[0] === guess.paths[0] ? "✔️" : answer.upgrades[0] > guess.paths[0] ? "⏫" : "⏬";
        midRef.current.innerText = answer.upgrades[1] === guess.paths[1] ? "✔️" : answer.upgrades[1] > guess.paths[1] ? "⏫" : "⏬";
        botRef.current.innerText = answer.upgrades[2] === guess.paths[2] ? "✔️" : answer.upgrades[2] > guess.paths[2] ? "⏫" : "⏬";
      });
    });
    Towers.getTowerTotalCost(guess.monkey, guess.paths).then(data =>{
      const cost = data;
      Towers.getTowerTotalCost(answer.type, answer.upgrades).then(data =>{
        costRef.current.innerText = data === cost ? "✔️" : data > cost ? "⏫" : "⏬";
      });
    });
  });
  
  return (
      
    <div className="guessEntry" key={index}>
      <label>{guess.monkey} {guess.paths.join('-')}</label>
      <div className="row">
  
        <div key="type" className="column" ref={type}></div> 
        <div key="category" className="column" ref={categoryRef}></div>
        <div key="top" className="column" ref={topRef}></div>
        <div key="middle" className="column" ref={midRef}></div>
        <div key="bottom" className="column" ref={botRef}></div>
        <div key="cost" className="column" ref={costRef}></div>

      </div>
    </div>
  )
}
  
export default Guess