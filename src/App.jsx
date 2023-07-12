import React, { useEffect, useState } from 'react'
import '../src/app.css'
import LoadingSpinner from './components/LoadingSpinner';
import axios from 'axios';



const places = [
    { 'location': 'Kumasi', 'lat': 6.6666, 'lon': -1.6163, },
    { 'location': 'Accra', 'lat': 5.6037, 'lon': -0.1870, },
    { 'location': 'Cape coast', 'lat': 5.1315, 'lon': -1.2795, },
    { 'location': 'Eastern region', 'lat': 6.5781, 'lon': -0.4502, },
]
var locationIndex = 0;
var metaData = {
    'mintemp': 25,
    'maxtemp': 25,
    'currtemp': 25,
    'pressure': 0,
    'windspeed': 0,
    'icon': 'public/weather.png',
    'summary': 'Unavailable',
    'location': places[locationIndex].location,
    'time': new Date().toLocaleTimeString(),
}



export default function App() {

    const [isLoading, setIsLoading] = useState(false)

    const locationDrops = places.map((location) =>
        <option
            value={location.location}>
            {location.location}
        </option>
    )


    async function handleLocationChange(e) {
        try {
            setIsLoading(true)
            const selected = e.target.value
            locationIndex = places.findIndex(e => e.location == selected)
            const response = await makeWeatherCall()
            const iconId = response.weather[0].icon
            metaData.mintemp = response.main['temp_min']
            metaData.maxtemp = response.main['temp_max']
            metaData.currtemp = response.main['temp']
            metaData.icon = `https://openweathermap.org/img/wn/${iconId}@2x.png`
            metaData.pressure = response.main['pressure']
            metaData.windspeed = response.wind['speed']
            metaData.summary = response.weather[0]['description']
            metaData.location = response.name
            metaData.time = new Date().toLocaleTimeString()

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }


    async function makeWeatherCall() {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${places[locationIndex].lat}&lon=${places[locationIndex].lon}&appid=8296f3d12905c10450118d0faf584dd7&units=metric`
        const response = await axios.get(url);
        return response.data;
    }


    useEffect(() => {
        makeWeatherCall()
    }, [])




    return (
        <div className='app'>
            <div className='background-info'>
                <p>RANS Forcast</p>
                <div className='card-wrapper'>
                    <p className='temperature'>{metaData.currtemp} deg</p>
                    <div className='time-place'>
                        <h3 className='place'>{metaData.location}</h3>
                        <h6 className='place'>Time {metaData.time}</h6>
                    </div>
                </div>
            </div>
            <div className='card-info'>
                <div className='card-row place-line'>
                    <label>Please select a location</label>
                    <select name='locations' id='locations'
                        onChange={handleLocationChange}>
                        {...locationDrops}
                    </select>
                    {
                        isLoading &&
                        <LoadingSpinner />
                    }

                </div>
                <div className='card-row metadata-card'>
                    <div className='middle-data'>
                        <div className='pressure-line'>
                            <span>Pressure</span>
                            <span className='meta-value pressure-value'>{metaData.pressure} hPa</span>
                        </div>
                        <div className='windspeed-line'>
                            <span>Wind speed</span>
                            <span className='meta-value windspeed-value'>{metaData.windspeed} m/s</span>
                        </div>
                        <div >
                            <img src={metaData.icon}
                                className='weather-icon'
                            />
                        </div>
                        <div className='windspeed-line'>
                            <span>Min temperature</span>
                            <span className='meta-value min-temp'>{metaData.mintemp} ℃</span>
                        </div>
                        <div className='windspeed-line'>
                            <span>Max temperature</span>
                            <span className='meta-value max-temp'>{metaData.maxtemp} ℃</span>
                        </div>
                    </div>
                    <div className='summary-line'>
                        <span>Sumary</span>
                        <span className='meta-value summary-value'>{metaData.summary}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}
