export function Login() {
    
    const onLoginClicked = async () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch("api/login", requestOptions)
            .then(response => response.json())
            .then(result => localStorage.setItem("token", result.token))
            .catch(error => console.log('error', error));
    }

    const onLogOutClicked = () => {
        localStorage.removeItem("token");
    }


    return ( 
    <>
    <button onClick={onLoginClicked} >
        
        Login

    </button>
    <button onClick={onLogOutClicked} >
        
        Logout

    </button>
    </> )
}