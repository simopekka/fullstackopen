import axios from "axios";

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?'
const api_key = import.meta.env.VITE_SOME_KEY

const getWeather = capital => {
    console.log(`fetching ${capital} weather`)
    const response = axios.get(`${baseUrl}q=${capital}&appid=${api_key}&units=metric`)
    return response.then(response => response.data)
}

export default { getWeather }
