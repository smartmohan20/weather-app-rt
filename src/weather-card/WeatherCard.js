import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WeatherCard.css';
import SearchBox from './SearchBox';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const BlueCard = () => {
    const [geoLocation, setGeoLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
  
    // Get user's current geo location
    const getLocation = async () => {
        try {
            if (navigator.geolocation) {
                await navigator.geolocation.getCurrentPosition(
                    (position) => {
                    const { latitude, longitude } = position.coords;
                        setGeoLocation({ latitude, longitude });
                    },
                    (error) => {
                        console.error('Error getting geo location:', error);
                    }
                );
                } else {
                    console.error('Geo location is not supported by this browser.');
                }
        } catch (error) {
            console.error('Error in "getLocation" method:', error);
        }
    };

    // Handle search
    const onSearch = async (query) => {
        try {
            const endpointUrl = SERVER_BASE_URL + '/weather/search-by-location?location=' + query;
            
            try {
                const response = await axios.get(endpointUrl);
                const weatherData = response?.data?.data;
                setWeatherData(weatherData);
            } catch (error) {
                console.error('Failed to get weather data:', error);
            }
        } catch (error) {
            console.error('Error in "onSearch" method:', error);
        }
    };

    // Fetch weather data of current geo location
    const fetchWeatherDataCurrLoc = async () => {
        try {
            const { latitude, longitude } = geoLocation;
            const endpointUrl = SERVER_BASE_URL + '/weather/search-by-geo-location?lat=' + latitude + '&long=' + longitude;
            
            try {
                const response = await axios.get(endpointUrl);
                const weatherData = response?.data?.data;
                setWeatherData(weatherData);
            } catch (error) {
                console.error('Failed to get weather data:', error);
            }
        } catch (error) {
            console.error('Error in "fetchWeatherDataCurrLoc" method:', error);
        }
    };

    // Use effect hooks
    useEffect(() => {
        getLocation();
    }, []); // Run only once when the component mounts

    useEffect(() => {
        if (geoLocation) {
            setTimeout(fetchWeatherDataCurrLoc, 10000);
        }
    }, [geoLocation]); // Re-run when geoLocation changes
    
    return (
        <div className="blue-card">
            <div className="container">
                <div className='sun-cloud-icon'>
                    <img src='/assets/images/sun_cloud.png' alt="Sun Cloud Image" />
                </div>

                <div className="search-box-container">
                    <SearchBox value={ weatherData && weatherData.city } onSearch={onSearch} />
                </div>

                { weatherData ? (
                        <div className="weather-box-container">
                        <div className="weather-box">
                            <div className="image-container">
                                <img src='/assets/images/sun.png' alt="Sun Image" />
                            </div>
                        </div>
                        <div className="weather-box">
                            <div className="weather-data-container">
                                <div className='weather-data temprature-data'>
                                    { weatherData && weatherData.temperature }°C
                                </div>
                                <div type='button' className='weather-data clear-btn'>
                                    Clear
                                </div>
                                <div className='weather-data location'>
                                { weatherData && weatherData.city }, <b>{ weatherData && weatherData.country }</b>
                                </div>
                                <div className='weather-data weather-info-container'>
                                    <div className='weather-info'>
                                        <div className='weather-info-content'>
                                            <div className='weather-info-icon'>
                                                <img src='/assets/images/humidity.png' alt="Humidity Icon" />
                                            </div>
                                        </div>
                                        <div className='weather-info-content'>
                                            <div className='weather-info-data'>
                                                { weatherData && weatherData.humidity }%
                                            </div>
                                            <div className='weather-info-name'>
                                                Humidity
                                            </div>
                                        </div>
                                    </div>
                                    <div className='weather-info'>
                                        <div className='weather-info-content'>
                                            <div className='weather-info-icon'>
                                                <img src='/assets/images/wind_speed.png' alt="Wind Speed Icon" />
                                            </div>
                                        </div>
                                        <div className='weather-info-content'>
                                            <div className='weather-info-data'>
                                                { weatherData && weatherData.windSpeed } Km/h
                                            </div>
                                            <div className='weather-info-name'>
                                                Wind Speed
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='weather-data'>
                                    <div className='show-more-btn' type='button'>
                                        Show more &#9660;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                : (
                    <div>
                        <p className='no-data'>No weather data found</p>
                        <p className='no-data-info'>If permission for geolocation is granted, it will automatically fetch weather data for your current location after 10 seconds.</p>
                    </div>
                )
            }
            </div>
        </div>
    );
};

export default BlueCard;
