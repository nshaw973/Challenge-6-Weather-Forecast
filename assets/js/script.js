var searchBarEl = document.querySelector('#search');
var searchButton = document.querySelector('.search-button');
var searchForm = document.querySelector('.search-form');
var clearButton = document.querySelector('.clear');
var historyButton = document.querySelector('.history-buttons');

var currentCity = document.querySelector('#city-name');
var cityState = document.querySelector('#city-state');
var currentDate = document.querySelector('#city-date');
var weatherIcon = document.querySelector('#icon');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var humidity = document.querySelector('#humidity');

var forecastContainer = document.querySelector('.forecast-container');

//City Searcher ------------------------------------------------------------------//

var cityHistory = [];

searchButton.addEventListener('click', searchSubmit);
searchBarEl.addEventListener('submit', searchSubmit);

//Deletes History//
clearButton.addEventListener('click', function clearHistory() {

  historyButton.innerHTML = "";
  cityHistory = []; 

});

//Search for city depending on form value and searches for its Lon and Lat//
function searchSubmit(event) {
    event.preventDefault();

    var searchValue = document.querySelector('.search-form').value;
    var searchedCity = ""

    if (!searchValue) {

    console.error('Error empty input value')
    searchForm.setAttribute('style', 'background-color: rgb(230, 156, 156)')
    window.alert('please input a city')

    return;

    } else {

      searchForm.setAttribute('style', 'background-color: white')
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

      if (data[0] === undefined) {

        window.alert('Error city not found! Make sure the spelling is correct!')
        searchForm.setAttribute('style', 'background-color: rgb(230, 156, 156)')
        return;

      } else {

        searchForm.setAttribute('style', 'background-color: white')

      }

        console.log(data);

        //This will be used to get the coordinates needed for the weatherapi fetch
        cityData = {
          city: data[0].name,
          lon: data[0].lon,
          lat: data[0].lat,
          state: data[0].state,
        }

        cityHistory.push(cityData.city)
        
        searchHistory(cityData);
        cityWeather(cityData);
        foreCast(cityData);

    });
  }

  function searchHistory (cityData) {

    historyButton.innerHTML = ""

    for (var i = 0; i < cityHistory.length; i++) {

      var cityName = cityHistory[i]

      var liEl = document.createElement('li');
      var buttonEl = document.createElement('button');

      historyButton.append(liEl)
      liEl.append(buttonEl)

      buttonEl.textContent = cityName
      buttonEl.setAttribute('class', 'history-button')
      buttonEl.setAttribute('city', [i])

    }
  }

  //takes the lon and lat from geo api and adds them to the openweathermap api link//
  function cityWeather (cityData) {
 
    console.log('current city = ' + cityData.city);
    console.log("lat = " + cityData.lat + "lon = " + cityData.lon);

    //added impaerial units to the link//
    var cityWeatherData = 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityData.lat + '&lon=' + cityData.lon + '&units=imperial&appid=6dccc6347181beac7daedbd684110b84'
/*     var cityWeatherData = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityData.lat + '&lon=' + cityData.lon + '&units=imperial&appid=6dccc6347181beac7daedbd684110b84' */

    fetch(cityWeatherData)
      .then(function (response) {
        console.log(response);

        return response.json();

    }).then(function (data) {
      console.log(data);

      var currrentCityWeatherDetails = {
        temp: data.main.temp,
        wind: data.wind.speed,
        humidity: data.main.humidity,
        icon: data.weather[0].icon,
        date: data.dt
      }
    
    var icon = 'http://openweathermap.org/img/wn/' + currrentCityWeatherDetails.icon + '@2x.png'

      console.log(icon)

      //got this from stackoverflow, basically what it does is turns the unix time that came from the response, and gets converted to exact date and time
      //the * 1000 is based on the way javascript treats a second to = 1000, without it, it will default to 1970 epoch.
      //The .toLocaleDateString function converts the fully detailed time given to (m/d/yyyy) format.
      
      var convertedDate = new Date(currrentCityWeatherDetails.date * 1000).toLocaleDateString();

      currentCity.textContent = cityData.city;
      cityState.textContent = cityData.state;
      currentDate.textContent = convertedDate;
      weatherIcon.setAttribute('src', icon);

      temp.textContent = currrentCityWeatherDetails.temp;
      wind.textContent = currrentCityWeatherDetails.wind;
      humidity.textContent = currrentCityWeatherDetails.humidity;

      console.log(cityHistory)
    }) 
  }

  function foreCast (cityData) {

    var cityWeatherData = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityData.lat + '&lon=' + cityData.lon + '&units=imperial&appid=6dccc6347181beac7daedbd684110b84'

    fetch(cityWeatherData)
      .then(function (response) {
        console.log(response);

        return response.json();

    }).then(function (data) {
      console.log(data);



      //Forecasted Weather

      var forecastDetails = {

        date: data.list[5].dt,
        temp: data.list[5].main.temp,
        wind: data.list[5].wind.speed,
        humidity: data.list[5].main.humidity,
        icon: data.list[5].weather[0].icon

      }

      var forecastDate = new Date(forecastDetails.date * 1000).toLocaleDateString();

      console.log(forecastDate);
      console.log(forecastDetails);

      var divEl = document.createElement('div');
      var h1El = document.createElement('h1');
      var h3El = document.createElement('h3')
      var ulEl = document.createElement('ul');
      var liEl = document.createElement('li');

      forecastContainer.appendChild(divEl);
      divEl.appendChild(h1El);
      divEl.appendChild(h3El);
      divEl.appendChild(ulEl);
      ulEl.appendChild(liEl);

      h1El.textContent = cityData.name;

  })
}