
var searchBarEl = document.querySelector('#search')


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

        console.log(data)

        cityData = {
          city: data[0].name,
          lon: data[0].lon,
          lat: data[0].lat,
          state: data[0].state,
        }

        cityWeather(cityData)

    });
  }

  function cityWeather (cityData) {

    var currentCity = document.querySelector('#city-name');

    currentCity.textContent = cityData.city
    
    console.log('current city = ' + cityData.city)
    console.log("lat = " + cityData.lat + "lon = " + cityData.lon)

  }

