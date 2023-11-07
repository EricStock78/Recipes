import { useState, useEffect } from 'react';

export function Login() {
    
    const [googleURL, setGoogleURL] = useState('');

    useEffect( () => {
        fetch("/api/google/oauthURL")
        .then(
            
            response =>  {
                if( !response.ok) {
                    let code = response.status.toString();
                    throw new Error( `${code} ${response.statusText}`);
                }
                return response.json();

        })
        .then( data => setGoogleURL(data.url))
        .catch( e => {
            console.log("Error!!!");
            console.log(e.message);
            localStorage.clear();
            return (<h2>Error getting OAUTH url</h2>)    
        });
        
      }, [])


    const onLoginClicked = async () => {
        window.location.href = googleURL;
    }

    const onLogOutClicked = () => {
        localStorage.removeItem("token");
    }


    return ( 
    <>
    <button disabled = {!googleURL} onClick={onLoginClicked} >
        
        Login with Google

    </button>
    <br></br>
    <button onClick={onLogOutClicked} >
        
        Logout

    </button>
    <br>
    </br>
    
    </> )
}