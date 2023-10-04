import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { BicycleList } from './Bicycle';

function App() {
  
  //let bicycleData = [ {name: "Red Bike", img: "images/redbike.png", speeds: 10}, {name: "Blue Bike", speeds: 21}];


  const [bicycles, setBicycles] = useState(null);

  useEffect( () => {
    fetch("/api/bicycles")
    .then( response => response.json() )
    .then( setBicycles )
    .catch( e => console.log(e.message));
  }, [])

  if( bicycles == null ) return;

  return (
    <div>
      <h1>Bicycle Website</h1>
      <BicycleList bikes={bicycles} setBikes = {setBicycles}/>
    </div>
  
  )
}

export default App;
