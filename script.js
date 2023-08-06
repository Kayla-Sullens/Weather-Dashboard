// Global variables
var apiKey = "658437e52533234029feec571f02f406";
var savedSearches = [];

// Create a list of previously searched cities
var searchHistoryList = function(cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    searchEntryContainer.append(searchHistoryEntry);

    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    // Update savedSearches array with previously saved searches
    if (savedSearches.length > 0){
        
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
var displaySearchHistory = function() {
    displaySearchHistory = localStorage.getItem("savedSearches");

    // Return false if there is no previous saved searches
    if (!savedSearchHistory) {
        return false;
    }

    savedSearchHistory = JSON.parse(savedSearchHistory);

    for (var i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);
    }
};
// Fetch and use data from Open Weather current weather Api for the Current Weather Section
var currentWeatherSection = function(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                .then(function(response) {
                    return response.json();
                })
                // get data from response and apply them to the current weather section
                .then(function(response){
                    searchHistoryList(cityName);

                    // add current weather container with border to page
                    var resultsContainer = $("#results");
                    resultsContainer.addClass("results");

                    // add city name, date, and weather icon to current weather section title
                    var cardTitle = $("#card-title");
                    var currentDay = moment().format("M/D/YYYY");
                    cardTitle.text(`${cityName} (${currentDay})`);
                    var currentIcon = $("#current-weather-icon");
                    currentIcon.addClass("current-weather-icon");
                    var currentIconCode = response.current.weather[0].icon;
                    currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

                    // add current temperature to page
                    var cityTemperature = $("#city-temperature");
                    cityTemperature.text("Temperature: " + response.city.temp + " \u00B0F");

                    // add current wind speed to page
                    var cityWindSpeed = $("#current-wind-speed");
                    cityWindSpeed.text("Wind Speed: " + response.city.wind_speed + " MPH");

                    // add current humidity to page
                    var cityHumidity = $("#city-humidity");
                    cityHumidity.text("Humidity: " + response.city.humidity + "%");
                })
        })
        // Reset search input and alert user if there is an error
        .catch(function(err) {
            $("#search-input").val("");

            alert("City entered could not be found. Please enter a valid city name.");
        });
};

// Fetch and use data from Open Weather current weather Api for the 5-Day Forecast Section
var fiveDayForecastSection = function(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    console.log(response);

                    // add 5 day forecast title
                    var futureForecastTitle = $("#future-forecast-title");
                    futureForecastTitle.text("5-Day Forecast:")

                    // using data from response, set up each day of 5 day forecast
                    for (var i = 1; i <= 5; i++) {
                        // add class to future cards to create card containers
                        var futureCard = $(".future-card");
                        futureCard.addClass("future-card-details");

                        // add date to 5 day forecast
                        var futureDate = $("#future-date-" + i);
                        date = moment().add(i, "d").format("M/D/YYYY");
                        futureDate.text(date);

                        // add icon to 5 day forecast
                        var futureIcon = $("#future-icon-" + i);
                        futureIcon.addClass("future-icon");
                        var futureIconCode = response.daily[i].weather[0].icon;
                        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

                        // add temp to 5 day forecast
                        var futureTemp = $("#future-temp-" + i);
                        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

                        // add wind speed to 5 day forecast
                        var futureTemp = $("#future-temp-" + i);
                        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

                        // add humidity to 5 day forecast
                        var futureHumidity = $("#future-humidity-" + i);
                        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                    }
                })
        })
};

// Function is called when the search form is submitted
$("#search-form").on("submit", function() {
    event.preventDefault();
    
    // get name of city searched
    var cityName = $("#search-input").val();

    if (cityName === "" || cityName == null) {
        //send alert if search input is empty when submitted
        alert("Please enter a valid city name.");
        event.preventDefault();
    } else {
        // if cityName is valid, add it to search history list and display its weather conditions
        currentWeatherSection(cityName);
        fiveDayForecastSection(cityName);
    }
});

// Function is called when a search history entry is clicked
$("#city-list-box").on("click", "p", function() {
    var previousCityName = $(this).text();
    currentWeatherSection(previousCityName);
    fiveDayForecastSection(previousCityName);

    var previousCityClicked = $(this);
    previousCityClicked.remove();
});

loadSearchHistory();