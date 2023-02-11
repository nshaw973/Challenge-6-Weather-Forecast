var searchBarEl = document.querySelector('#search');
var searchButton = document.querySelector('.search-button');
var searchForm = document.querySelector('.search-form');
var clearButton = document.querySelector('.clear');
var historyButton = document.querySelector('.history-buttons');

var currentCity = document.querySelector('#city-name');
var cityState = document.querySelector('#city-state');
var cityCountry = document.querySelector('#city-country');
var currentDate = document.querySelector('#city-date');
var weatherIcon = document.querySelector('#icon');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var humidity = document.querySelector('#humidity');

var forecastCards = document.querySelector('.forecast-cards');

//City Searcher ------------------------------------------------------------------//

var cityHistory = [];
console.log(cityHistory)

searchButton.addEventListener('click', searchSubmit);
searchBarEl.addEventListener('submit', searchSubmit);

//Deletes History//
clearButton.addEventListener('click', function clearHistory() {

  historyButton.innerHTML = "";
  cityHistory = []; 
  storeCity();

});

//Search for city depending on form value and searches for its Lon and Lat//
function searchSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    forecastCards.innerHTML = ""

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
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchedCity + '&limit=5&appid=09f8e0e7cdfcce674876b189b8f41b9c';

    searchValue = ""

    getCity(requestUrl);
}

//This is taking the Geo APIs and searching for the lat and lon of the city searched for//
function getCity(requestUrl, requestCity, storedCity) {
    fetch(requestUrl || requestCity || storedCity)
      .then(function (response) {
     
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
          country: data[0].country
        }

        cityHistory.push(cityData)
        
        storeCity();
        searchHistory();
        cityWeather(cityData);
        foreCast(cityData);

    });
  }

  //Adds the Buttons for previously searched Cities, and allows for those cities to be clicked and it would repopulate the current day and forecasted details
  function searchHistory () {

    
    historyButton.innerHTML = ""

    for (var i = 0; i < cityHistory.length; i++) {

      var cityName = cityHistory[i].city;

      var liEl = document.createElement('li');
      var buttonEl = document.createElement('button');

      historyButton.append(liEl)
      liEl.append(buttonEl)

      buttonEl.textContent = cityName
      buttonEl.setAttribute('class', 'history-button')
      buttonEl.setAttribute('city', cityName)
      buttonEl.setAttribute('city-index', [i])
      buttonEl.setAttribute('lat', cityHistory[i].lat)
      buttonEl.setAttribute('lon', cityHistory[i].lon) 

      console.log(buttonEl.value)
      
      buttonEl.addEventListener('click', function recallCity (event) {
        event.preventDefault()
        event.stopPropagation();

        var citySavedName = this.getAttribute('city')
        var cityIndex = this.getAttribute('city-index')

        //prevents from creating more buttons when clicking previously searched cities
        cityHistory.splice(cityIndex, 1)

        console.log(citySavedName)
 
        var requestCity = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySavedName + '&limit=5&appid=09f8e0e7cdfcce674876b189b8f41b9c';
        console.log(requestCity)

        forecastCards.innerHTML = ""


        getCity(requestCity);

      })
    }
     
  }

  //takes the lon and lat from geo api and adds them to the openweathermap api link//
  function cityWeather (cityData) {

    //added impaerial units to the link//
    var cityWeatherData = 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityData.lat + '&lon=' + cityData.lon + '&units=imperial&appid=09f8e0e7cdfcce674876b189b8f41b9c'

    fetch(cityWeatherData)
      .then(function (response) {

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

      //got this from stackoverflow, basically what it does is turns the unix time that came from the response, and gets converted to exact date and time
      //the * 1000 is based on the way javascript treats a second to = 1000, without it, it will default to 1970 epoch.
      //The .toLocaleDateString function converts the fully detailed time given to (m/d/yyyy) format.
      
      var convertedDate = new Date(currrentCityWeatherDetails.date * 1000).toLocaleDateString();

      currentCity.textContent = cityData.city + ", ";
      cityState.textContent = cityData.state;
      cityCountry.textContent = " " + cityData.country;
      currentDate.textContent = convertedDate;
      weatherIcon.setAttribute('src', icon);

      temp.textContent = currrentCityWeatherDetails.temp;
      wind.textContent = currrentCityWeatherDetails.wind;
      humidity.textContent = currrentCityWeatherDetails.humidity;

      console.log(cityHistory)
    }) 
  }

  function foreCast (cityData) {

    forecastCards.innerHTML = ""
    var cityWeatherData = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityData.lat + '&lon=' + cityData.lon + '&units=imperial&appid=09f8e0e7cdfcce674876b189b8f41b9c'

    fetch(cityWeatherData)
      .then(function (response) {

        return response.json();

    }).then(function (data) {

      //Forecasted Weather

      //Specific indexes per day//
      var index = [5, 13, 21, 29, 37];

      for (var i = 0; i < index.length; i++) {

        if (index.length > 5) {
          return
        } else {

      var forecastDetails = {

        date: data.list[index[i]].dt,
        temp: data.list[index[i]].main.temp,
        wind: data.list[index[i]].wind.speed,
        humidity: data.list[index[i]].main.humidity,
        icon: data.list[index[i]].weather[0].icon

      }

      //This fetches the icon from the openweather api, and creates the 5 day forecast with details.//
      var icon = 'http://openweathermap.org/img/wn/' + forecastDetails.icon + '@2x.png'
      var forecastDate = new Date(forecastDetails.date * 1000).toLocaleDateString();

      var divEl = document.createElement('div');

      var imgEl = document.createElement('img')
      var h3El = document.createElement('h3')
      var ulEl = document.createElement('ul');
      var temp = document.createElement('li');
      var wind = document.createElement('li');
      var humidity = document.createElement('li');

      forecastCards.appendChild(divEl);
      divEl.appendChild(h3El);
      divEl.appendChild(imgEl);
      divEl.appendChild(ulEl);
      ulEl.appendChild(temp);
      ulEl.appendChild(wind);
      ulEl.appendChild(humidity);

      h3El.textContent = forecastDate;
      imgEl.setAttribute('src', icon);
      imgEl.setAttribute('class', "forecast-icon");
      wind.textContent = "Wind: " + forecastDetails.wind + " mph";
      temp.textContent = "Temp: " + forecastDetails.temp + "F°"
      humidity.textContent = "Humidity: " + forecastDetails.humidity + "%";

    }}
  })
  
}

function storeCity() {

  localStorage.setItem("city-history", JSON.stringify(cityHistory))
}

function init() {
  var storedCities = JSON.parse(localStorage.getItem("city-history"));
  if (!storedCities){
    return;
  }


  console.log(storedCities)

  for (var i = 0; i < storedCities.length; i++){

   var storedCityName = storedCities[i].city

   var storedCity = 'http://api.openweathermap.org/geo/1.0/direct?q=' + storedCityName + '&limit=5&appid=09f8e0e7cdfcce674876b189b8f41b9c';
   
   console.log(storedCityName)

    getCity(storedCity)

  } 
}
init();