

export function BicycleList( {bikes, setBikes} ) {

    return (
        bikes.map((bike, i) => {
            return <Bicycle name={bike.name} bikes={bikes} setBikes={setBikes}/> 
        })
    )
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