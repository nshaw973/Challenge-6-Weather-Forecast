
var searchBarEl = document.querySelector('#search')
var searchedCity = [""]
console.log("This is the Searched City " + searchedCity)

//City Searcher ------------------------------------------------------------------//
 
searchBarEl.addEventListener('submit', searchSubmit);

function searchSubmit(event) {
    event.preventDefault();

    var searchValue = document.querySelector('.search-form').value;

    if (!searchValue) {
    console.error('Error empty input value')
    return;
    }

    searchedCity = searchValue
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchedCity + '&limit=5&appid=6dccc6347181beac7daedbd684110b84';

    console.log("search Value " + searchValue)
    getApi(requestUrl);
}

function getApi(requestUrl) {
    fetch(requestUrl)
      .then(function (response) {
        console.log(response);
        return response.json();
        
    });
  }


