
var searchBarEl = document.querySelector('#search')
var currentCity = document.querySelector('#city-name')
var cityState = document.querySelector('#city-state');
var weatherIcon = document.querySelector('#icon');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var humidity = document.querySelector('#humidity');

//City Searcher ------------------------------------------------------------------//
 
searchBarEl.addEventListener('submit', searchSubmit);

function searchSubmit(event) {
    event.preventDefault();

    var searchValue = document.querySelector('.search-form').value;
    var searchedCity = ""

    if (!searchValue) {
    console.error('Error empty input value')
    window.alert('please input a city')
    return;
    }

    searchedCity = searchValue
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchedCity + '&limit=5&appid=6dccc6347181beac7daedbd684110b84';

    console.log("search Value " + searchValue)
    getCity(requestUrl);
}

function getCity(requestUrl) {
    fetch(requestUrl)
      .then(function (response) {
        console.log(response);
     
        return response.json();

    }).then(function (data) {

        console.log(data);

        //This will be used to get the coordinates needed for the weatherapi fetch
        cityData = {
          city: data[0].name,
          lon: data[0].lon,
          lat: data[0].lat,
          state: data[0].state,
        }

        cityWeather(cityData);

    });
  }

  function cityWeather (cityData) {
 
    console.log('current city = ' + cityData.city);
    console.log("lat = " + cityData.lat + "lon = " + cityData.lon);

    //added impaerial units to the link, as well as a total count of 6 instead of the default 40//
    var cityWeatherData = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityData.lat + '&lon=' + cityData.lon + '&units=imperial&cnt=6&appid=6dccc6347181beac7daedbd684110b84'

    fetch(cityWeatherData)
      .then(function (response) {
        console.log(response);

        return response.json();

    }).then(function (data) {
      console.log(data);

      var cityWeatherDetails = {
        temp: data.list[0].main.temp,
        wind: data.list[0].wind.speed,
        humidity: data.list[0].main.humidity,
        icon: data.list[0].weather[0].icon,
        id: data.list[0].weather[0].id
      }
    
    var icon = 'http://openweathermap.org/img/wn/' + cityWeatherDetails.icon + '@2x.png'

      console.log(icon)

      currentCity.textContent = cityData.city;
      cityState.textContent = cityData.state;
      weatherIcon.setAttribute('src', icon)

      temp.textContent = cityWeatherDetails.temp;
      wind.textContent = cityWeatherDetails.wind;
      humidity.textContent = cityWeatherDetails.humidity;

    }) 
  }

