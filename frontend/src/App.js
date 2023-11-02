import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { BicycleList } from './Bicycle';
import { Login } from './Login';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  
  //let bicycleData = [ {name: "Red Bike", img: "images/redbike.png", speeds: 10}, {name: "Blue Bike", speeds: 21}];


  const [bicycles, setBicycles] = useState(null);
  return (
  <Router>
  <div>
    
    {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="/" element={<BicycleList bikes={bicycles} setBikes = {setBicycles} />}/>
    </Routes>
  </div>
</Router>)

}

export default App;
