var searchBarEl = document.querySelector('#search')
var searchButton = document.querySelector('.search-button')
var searchForm = document.querySelector('.search-form')
var historyButton = document.querySelector('.history-buttons')
var currentCity = document.querySelector('#city-name')
var cityState = document.querySelector('#city-state');
var currentDate = document.querySelector('#city-date')
var weatherIcon = document.querySelector('#icon');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var humidity = document.querySelector('#humidity');

//City Searcher ------------------------------------------------------------------//

var cityHistory = [""];


searchButton.addEventListener('click', searchSubmit)
searchBarEl.addEventListener('submit', searchSubmit);

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



        for (var i = 0; i < cityHistory.length; i++) {

          var liEl = document.createElement('li');
          var buttonEl = document.createElement('button');
    
          historyButton.append(liEl)
          liEl.append(buttonEl)
    
          buttonEl.textContent = cityData.city
          buttonEl.setAttribute('class', 'history-button')
          buttonEl.setAttribute('city', [i])

          cityHistory[i] = buttonEl.value

        }


        cityWeather(cityData);

    });
  }

  function cityWeather (cityData) {
 
    console.log('current city = ' + cityData.city);
    console.log("lat = " + cityData.lat + "lon = " + cityData.lon);

    //added impaerial units to the link, as well as a total count of 6 instead of the default 40//
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