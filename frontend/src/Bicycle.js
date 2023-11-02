import { useState, useEffect } from 'react';
import history from "history/browser";
import { Navigate } from 'react-router-dom';
export function BicycleList( {bikes, setBikes} ) {

    useEffect( () => {
        fetch("/api/bicycles")
        .then( response => response.json() )
        .then( setBikes )
        .catch( e => console.log(e.message));
      }, [])
    
    // check local storage, and get the token if there is one


    //if there is a token, we display the bicycles page


    // if there is no token we redirect to the login page
    
    const token = localStorage.getItem('token');


    if( !token) {
        return (<Navigate to="/login" replace={true} />)
        
    }
    else {
        
          if( bikes == null ) return;
        
          return (
            <div>
              <h1>Bicycle Website</h1>
              {bikes.map((bike, i) => {
                return <Bicycle name={bike.name} bikes={bikes} setBikes={setBikes}/> 
            })}
              
            </div>
          
          )
    }
}

function Bicycle( {name, bikes, setBikes} ) {


    return (
        <div>
            <p>{name}</p>
            
            <button onClick={ () => {
                // make api call to backend to remove the current bicycle
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("bikename", name);

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
                };

                fetch("/api/removeBicycle", requestOptions)
                .then(response => response.json())
                .then( setBikes )
                /*.then(result => {
                    let adjustedBikes = [];
                    for( let i=0; i<bikes.length; i++ ) {
                        if( bikes[i].name != name) {
                            adjustedBikes.push(bikes[i]);
                        }
                        setBikes(adjustedBikes);
                    }
                })*/
                .catch(error => console.log('error', error));
            } }>Remove</button>
        </div>
        
    )
}