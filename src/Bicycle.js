

export function BicycleList( {bikes} ) {

    return (
        bikes.map((bike, i) => {
            return <Bicycle name={bike.name}/> 
        })
    )
}

function Bicycle( {name, img} ) {

    return (
        <div>
            <p>{name}</p>
            <img src={img} />
        </div>
        
    )
}