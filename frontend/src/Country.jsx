import React from 'react'

const Country = ({ country,weather }) => {
    return (
        <div>
            <h2>{country?.name?.common}</h2>

            <p>{country?.capital}</p>
            <p> {country?.area} </p>

            <h3>Languages</h3>
            <ul>
                {Object.entries(country?.languages).map(([code, lang]) => (
                    <li key={code}>{lang}</li>
                ))}
            </ul>

            <span style={{ fontSize: 100 }}> {country?.flag} </span>

            <h3>Weather in {country?.name?.common}</h3>
            <p>Temparature - {weather?.main.temp} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`} />
            <p>{weather?.wind.speed} mph</p>


        </div>
    )
}

export default Country
