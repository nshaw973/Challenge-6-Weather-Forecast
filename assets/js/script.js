
var searchBarEl = document.querySelector('#search')


//City Searcher ------------------------------------------------------------------//
 
searchBarEl.addEventListener('submit', searchSubmit);

function searchSubmit(event) {
    event.preventDefault();

    var searchValue = document.querySelector('.search-form').value;
    var searchedCity = ""

    if (!searchValue) {
    console.error('Error empty input value')
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

    }).then(function (obj) {
/*         console.log(obj[1].lat);
        console.log(obj[1].lon); */
        var cityLat = obj[1].lat
        var cityLon = obj[1].lon
        var cityName = obj[1].name

        cityWeather(cityLat, cityLon, cityName)

    });
  }

  function cityWeather (cityLat, cityLon, cityName) {
    console.log('current city = ' + cityName)
    console.log("lat = " + cityLat + "lon = " + cityLon)

  }

