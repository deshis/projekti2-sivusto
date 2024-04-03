import { useEffect, useRef, useState } from "react";
import Towers from "../services/Towers"

const Guess = ({ guess, answer, index}) => {
  const [cost, setCost] = useState(0);

  const type = useRef(null);
  const categoryRef = useRef(null); 
  const costRef = useRef(null);
  const topRef = useRef(null);
  const midRef = useRef(null);
  const botRef = useRef(null);

  useEffect(() => {
    Towers.getTowerData(guess.type).then(data =>{
      const category = data.category;
      Towers.getTowerData(answer.type).then(data =>{
        type.current.innerText = data.type === guess.type ? "✔️" : "❌";
        categoryRef.current.innerText = data.category === category ? "✔️" : "❌";
        topRef.current.innerText = answer.upgrades[0] === guess.upgrades[0] ? "✔️" : answer.upgrades[0] > guess.upgrades[0] ? "⏫" : "⏬";
        midRef.current.innerText = answer.upgrades[1] === guess.upgrades[1] ? "✔️" : answer.upgrades[1] > guess.upgrades[1] ? "⏫" : "⏬";
        botRef.current.innerText = answer.upgrades[2] === guess.upgrades[2] ? "✔️" : answer.upgrades[2] > guess.upgrades[2] ? "⏫" : "⏬";
      });
    });
    Towers.getTowerTotalCost(guess.type, guess.upgrades).then(data =>{
      setCost(data);
      Towers.getTowerTotalCost(answer.type, answer.upgrades).then(data =>{
        costRef.current.innerText = data === cost ? "✔️" : data > cost ? "⏫" : "⏬";
      });
    });
  });
  
  return (
      
    <div className="guessEntry" key={index}>
      <label><label className="towerName">{guess.type}</label> <b>{guess.upgrades.join('-')}</b> <label className="cost">${cost}</label></label>
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