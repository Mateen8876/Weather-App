import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

const API_KEY = '38246cd25d23ead38c7f1f7d4fed3f5f';
const DEFAULT_CITY = 'RahimYar Khan';

const Weatherapp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [newCity, setNewCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [inputError, setInputError] = useState('');
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    retrieveCity();
  }, []);

  useEffect(() => {
    fetchWeatherData();
    fetchForecastData();
  }, [city]);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setWeatherData(data);
      console.log('Weather Data:', data);
    } catch (error) {
      setError(`Error fetching weather data: ${error.message}`);
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecastData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setForecastData(data.list);
      setHourlyData(data.list.slice(0, 8));
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const handleSearch = () => {
    if (newCity.trim() === '') {
      setInputError('Please enter a city name.');
      return;
    }
    setInputError('');
    setCity(newCity);
    setNewCity('');
    storeCity(newCity);
  };

  const storeCity = async (city) => {
    try {
      await AsyncStorage.setItem('city', city);
    } catch (error) {
      console.error('Error storing city:', error);
    }
  };

  const retrieveCity = async () => {
    try {
      const storedCity = await AsyncStorage.getItem('city');
      if (storedCity) {
        setCity(storedCity);
      }
    } catch (error) {
      console.error('Error retrieving city:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeatherData();
    await fetchForecastData();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.container}>
        <Text>Enter a city to see the weather.</Text>
      </View>
    );
  }

  const {
    main: { temp, humidity },
    wind: { speed },
    weather: [{ description, icon }],
    visibility,
  } = weatherData;

  const getWeatherImage = (weather) => {
    switch (weather) {
      case 'Rain':
        return require('../image/rain.png');
      case 'Clouds':
        return require('../image/cloud.png');
      case 'broken clouds':
        return require('../image/brokencloud.png');
      case 'haze':
        return require('../image/haxe.png');
      case 'Clear':
        return require('../image/sun.png');
      case 'Snow':
        return require('../image/snow.png');
      case 'few clouds':
        return require('../image/fewclouds.png');
      case 'Broken clouds':
        return require('../image/brokencloud.png');
      case 'Overcast clouds':
        return require('../image/overcast.png');
      case 'Light rain':
        return require('../image/light.png');
      case 'Scattered clouds':
        return require('../image/scattered.png');
      case 'Thunderstorm':
        return require('../image/thunder.png');
      default:
        return require('../image/sun.png');
    }
  };

  const weatherImage = getWeatherImage(description);

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const rainPrediction = () => {
    if (weatherData.weather[0].main === 'Rain') {
      return (
        <View style={styles.rainPredictionContainer}>
          <Text style={styles.rainPredictionText}>Rain is expected today.</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.rainPredictionContainer}>
          <Text style={styles.rainPredictionText}>No rain is expected today.</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter city..."
              placeholderTextColor="black"
              value={newCity}
              onChangeText={(text) => setNewCity(text)}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          {inputError ? (
            <Text style={styles.error}>{inputError}</Text>
          ) : null}
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.date}>
            {todayDate}
          </Text>
        </View>

        <View style={styles.currentWeather}>
          <Image source={weatherImage} style={styles.icon} />
          <Text style={styles.temp}>{temp}°C</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.details}>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Wind</Text>
              <Text style={styles.detailValue}>{speed} mph</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Humidity</Text>
              <Text style={styles.detailValue}>{humidity}%</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Visibility</Text>
              <Text style={styles.detailValue}>{visibility / 1000} km</Text>
            </View>
          </View>
        </View>

        {rainPrediction()}

        <Text style={styles.forecastTitle}>5-Day Forecast</Text>
        <Forecast city={city} />

        <Text style={styles.hourlyForecastTitle}>3-Hour Forecast</Text>
        <HourlyForecast city={city} />
      </View>
    </ScrollView>
  );
};

const Forecast = ({ city }) => {
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setForecastData(data);
        console.log('Forecast Data:', data);
      } catch (error) {
        setError('Error fetching forecast data. Please check your internet connection or try a different city.');
        console.error('Error fetching forecast data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecastData();
  }, [city]);

  if (isLoading) {
    return <View style={styles.forecastContainer}>
      <Text>Loading forecast data...</Text>
    </View>;
  }

  if (error) {
    return <View style={styles.forecastContainer}>
      <Text style={styles.error}>{error}</Text>
    </View>;
  }

  if (!forecastData) {
    return (
      <View style={styles.forecastContainer}>
        <Text>No forecast data available.</Text>
      </View>
    );
  }

  // Extract forecast data (adjust this based on API response)
  const dailyForecast = forecastData.list.filter((item, index) => index % 8 === 0);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWeatherImage = (weather) => {
    switch (weather.main) {
      case 'Rain':
        return require('../image/rain.png');
      case 'broken clouds':
        return require('../image/brokencloud.png');
      case 'haze':
        return require('../image/haxe.png');
      case 'Clouds':
        return require('../image/overcast.png');
      case 'Clear':
        return require('../image/sun.png');
      case 'Snow':
        return require('../image/snow.png');
      case 'Thunderstorm':
        return require('../image/thunder.png');
      case 'Mist':
        return require('../image/misty.png');
      case 'light rain':
        return require('../image/light.png');
      default:
        return require('../image/sun.png');
    }
  };

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.forecastContainer}>
      {dailyForecast.map((item, index) => (
        <View key={index} style={styles.forecastItem}>
          <Text style={styles.forecastDate}>{formatDate(item.dt * 1000)}</Text>
          <Image
            source={getWeatherImage(item.weather[0])}
            style={styles.forecastIcon}
          />
          <Text style={styles.forecastTemp}>{item.main.temp}°C</Text>
          <Text style={styles.forecastDescription}>{item.weather[0].description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const HourlyForecast = ({ city }) => {
  const [hourlyForecastData, setHourlyForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHourlyForecastData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setHourlyForecastData(data);
        console.log('Hourly Forecast Data:', data);
      } catch (error) {
        setError('Error fetching hourly forecast data. Please check your internet connection or try a different city.');
        console.error('Error fetching hourly forecast data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHourlyForecastData();
  }, [city]);

  if (isLoading) {
    return <View style={styles.hourlyForecastContainer}>
      <Text>Loading hourly forecast data...</Text>
    </View>;
  }

  if (error) {
    return <View style={styles.hourlyForecastContainer}>
      <Text style={styles.error}>{error}</Text>
    </View>;
  }

  if (!hourlyForecastData) {
    return (
      <View style={styles.hourlyForecastContainer}>
        <Text>No hourly forecast data available.</Text>
      </View>
    );
  }


  const hourlyForecast = hourlyForecastData.list.filter((item, index) => index % 1 === 0);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWeatherImage = (weather) => {
    switch (weather.main) {
      case 'Rain':
        return require('../image/rain.png');
      case 'haze':
        return require('../image/haxe.png');
      case 'Clouds':
        return require('../image/overcast.png');
      case 'Clear':
        return require('../image/sun.png');
      case 'Snow':
        return require('../image/snow.png');
      case 'Thunderstorm':
        return require('../image/thunder.png');
      case 'Broken':
        return require('../image/brokencloud.png');
      case 'Mist':
        return require('../image/misty.png');
      case 'light rain':
        return require('../image/light.png');
      default:
        return require('../image/sun.png');
    }
  };

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.hourlyForecastContainer}>
      {hourlyForecast.map((item, index) => (
        <View key={index} style={styles.hourlyForecastItem}>
          <Text style={styles.hourlyForecastTime}>{formatTime(item.dt * 1000)}</Text>
          <Image
            source={getWeatherImage(item.weather[0])}
            style={styles.hourlyForecastIcon}
          />
          <Text style={styles.hourlyForecastTemp}>{item.main.temp}°C</Text>
          <Text style={styles.hourlyForecastDescription}>{item.weather[0].description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7 ',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  searchButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  city: {
    fontSize: 28,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  date: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  currentWeather: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    width: 180,
    height: 120,
    resizeMode: 'contain',
  },
  temp: {
    fontSize: 48,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  description: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  details: {
    flexDirection: 'row',
    padding: 10,
  },
  detail: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    color: 'black',
    margin: 10,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  detailValue: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  forecastTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    padding: 10,
  },
  forecastContainer: {
    padding: 10,
  },
  forecastItem: {
    alignItems: 'center',
    padding: 10,
    margin: 10,
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
  },
  forecastDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  forecastIcon: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
  forecastTemp: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  forecastDescription: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  hourlyForecastTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    padding: 10,
  },
  hourlyForecastContainer: {
    padding: 10,
  },
  hourlyForecastItem: {
    alignItems: 'center',
    padding: 10,
    margin: 10,
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
  },
  hourlyForecastTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  hourlyForecastIcon: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
  hourlyForecastTemp: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  hourlyForecastDescription: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  rainPredictionContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
  },
  rainPredictionText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
});

export default Weatherapp;
