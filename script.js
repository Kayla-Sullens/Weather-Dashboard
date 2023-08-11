// Global variables
var apiKey = "658437e52533234029feec571f02f406";
var savedSearches = [];
var futureCard = document.querySelectorAll(".future-card");
console.log(futureCard);

// Create a list of previously searched cities
var searchHistoryList = function (cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    searchEntryContainer.append(searchHistoryEntry);

    var searchHistoryContainerEl = $("#city-list-box");
    searchHistoryContainerEl.append(searchEntryContainer);

    // Update savedSearches array with previously saved searches
    if (savedSearches.length > 0) {

        var previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

    // Add city name to array of saved searches
    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    // Reset search input
    $("#search-input").val("");

};

// Display saved search history entries in the search history box
var displaySearchHistory = function () {
    var savedSearchHistory = localStorage.getItem("savedSearches");

    // Return false if there is no previous saved searches
    if (!savedSearchHistory) {
        return false;
    }

    savedSearchHistory = JSON.parse(savedSearchHistory);

    for (var i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);
    }
};

// Fetch and use data from Open Weather Api.

var currentWeatherDisplay = function (cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${cityName}&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (current) {
            var cityLon = current.coord.lon;
            var cityLat = current.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`)
                .then(function (response) {
                    return response.json();
                })
                // get data from response and apply them 
                .then(function (data) {
                console.log(data);
                    currentWeather.innerHTML = `
                        <div class="card-body">
                            <h2 class="card-title" id="card-title">${current.name}</h2>
                            <p class="current-date">${new Date(current.dt*1000).toDateString()}</p>
                            <img class="d-inline" id="current-weather-icon" src="https://openweathermap.org/img/w/${current.weather[0].icon}.png" />
                            <p class="city-temperature" id="city-temperature">Temperature: ${current.main.temp} F </p>
                            <p class="city-wind-speed" id="city-wind-speed">Wind Speed: ${current.wind.speed} </p>
                            <p class="city-humidity" id="city-humidity">Humidity:${current.main.humidity}</p>
                        </div>`;

                        for(var i=0;i<futureCard.length;i++){
                            futureCard[i].children[0].textContent = date = moment().add(i, "d").format("M/D/YYYY");
                            //futureCard[i].children[1].src = `https://openweathermap.org/img/w/${.weather[i].icon}.png`;
                            futureCard[i].children[2].textContent = `Temperature: ${data.list[i].main.temp} F`;
                            futureCard[i].children[3].textContent = `Wind: ${data.list[i].wind.speed} MPH`;
                            futureCard[i].children[4].textContent = `Humidity: ${data.list[i].main.humidity} %`;

                };
        });

        // Reset search input and alert user if there is an error
        // .catch(function (err) {
        //     $("#search-input").val("");

        //     alert("City entered could not be found. Please enter a valid city name.");
        
        });
    };



// Function is called when the search form is submitted
$("#search-form").on("submit", function (event) {
    event.preventDefault();

    // get name of city searched
    var cityName = $("#search-input").val();

    if (cityName === "" || cityName == null) {
        //send alert if search input is empty when submitted
        alert("Please enter a valid city name.");
        event.preventDefault();
    } else {
        // if cityName is valid, add it to search history list and display its weather conditions
        currentWeatherDisplay(cityName);
    }
});

// Function is called when a search history entry is clicked
$("#city-list-box").on("click", "p", function () {
    var previousCityName = $(this).text();
    currentWeatherDisplay(previousCityName);

    var previousCityClicked = $(this);
    previousCityClicked.remove();
});

displaySearchHistory();