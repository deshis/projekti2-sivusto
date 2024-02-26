import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  
  const [monkey, setMonkey] = useState()
  
  useEffect(() => {
    axios
      .get('https://projekti2-sivusto.onrender.com/api/randomtower')
      .then(response => {
        console.log('promise fulfilled')
        console.log(response.data.type)
        setMonkey(response.data.type)      
      })
  }, [])

  
  
  return(
    <div>
      <h1>Definitely the app ever!</h1>
      <p>{monkey}</p>
    </div>
  )
}

export default App
