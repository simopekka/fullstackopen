import weatherService from '../services/weather'
import { useEffect, useState } from 'react'

const Weather = ({ capital }) => {
    const [weather, setWeather] = useState(null)
    
    useEffect(() => {
        weatherService
            .getWeather(capital)
            .then(response => {
                setWeather(response)
                console.log(response)
            })
    }, [])

    if (weather === null) {
        return (
            <></>
        )
    } else {
        return (
            <>
                <p>temperature {weather.main.temp} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
                <p>Wind {weather.wind.speed} m/s</p>
            </>
        )
    }
}
export default Weather