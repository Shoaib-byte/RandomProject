const Numbers = ({ countries,handleShow,weather }) => {
    return (
        <>
            {countries.length > 10 ? (
                <p>Too many matches, please be more specific</p>
            ) : countries.length === 1 ? (
                <div>
                    <h2>{countries[0]?.name?.common}</h2>

                    <p>{countries[0].capital}</p>
                    <p> {countries[0].area} </p>

                    <h3>Languages</h3>
                    <ul>
                      {Object.entries(countries[0].languages).map(([code,lang]) => (
                         <li key={code}>{lang}</li>
            ))}
                    </ul>

                    <span style={{fontSize: 100}}> {countries[0].flag} </span>
                    <h3>Weather in {countries[0]?.name?.common}</h3>
                    <p>Temparature - {weather?.main.temp} Celsius</p>
                    <img src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`} />
                    <p>{weather?.wind.speed} mph</p>


                </div>
            )
                :
                (
                    <ul>
                        {countries.map(country =>
                            <li key={country.name.common}>{country.name.common} 
                            <button onClick={() => handleShow(country.name.common)} >Show</button>
                            </li>
                        )}
                    </ul>
                )
            }

        </>
    )
}

export default Numbers