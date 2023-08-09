// Global variables
var apiKey = "658437e52533234029feec571f02f406";
var savedSearches = [];

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
// Fetch and use data from Open Weather current weather Api for the Current Weather Section
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
                // get data from response and apply them to the current weather section
                .then(function ({ list: forecast }) {

                    currentWeather.innerHTML = `
                        <div class="card-body">
                            <h2 class="card-title" id="card-title">${current.name}</h2>
                            <p class="current-date">${new Date(current.dt*1000).toDateString()}</p>
                            <img class="d-inline" id="current-weather-icon" src="https://openweathermap.org/img/w/${current.weather[0].icon}.png" />
                            <p class="city-temperature" id="city-temperature">Temperature: ${current.main.temp} </p>
                            <p class="city-wind-speed" id="city-wind-speed">Wind Speed: ${current.wind.speed} </p>
                            <p class="city-humidity" id="city-humidity">Humidity:${current.main.humidity}</p>
                        </div>`;

                        for(var i;i<forecast.length;i=i+8){
                            forecastWeather.innerHTML `
                                <div class="future-card bg-primary rounded">
                                                <p class="future-date" id="date-1">${new Date(forecast[i].dt*1000).toDateString()}</p>
                                                <img id="future-icon-1" src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="">
                                                <p class="future-temp" id="temp-1">${forecast.main.temp}</p>
                                                <p class="future-wind" id="wind-1">${forecast.wind.speed}</p>
                                                <p class="future-humidity" id="humidity-1">${forecast.main.humidity}</p>
                                            </div>`};


                    // searchHistoryList(cityName);

                    // // add current weather container with border to page
                    // var results = $("#results");
                    // results.addClass("results");

                    // // add city name, date, and weather icon to current weather section title
                    // var cardTitle = $("#card-title");
                    // var currentDay = moment().format("M/D/YYYY");
                    // cardTitle.text(`${cityName} (${currentDay})`);
                    // var currentIcon = $("#current-weather-icon");
                    // currentIcon.addClass("current-weather-icon");
                    // var currentIconCode = response.current.weather[0].icon;
                    // currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

                    // // add current temperature to page
                    // var cityTemperature = $("#city-temperature");
                    // cityTemperature.text("Temperature: " + response.city.temp + " \u00B0F");

                    // // add current wind speed to page
                    // var cityWindSpeed = $("#city-wind-speed");
                    // cityWindSpeed.text("Wind Speed: " + response.city.wind_speed + " MPH");

                    // // add current humidity to page
                    // var cityHumidity = $("#city-humidity");
                    // cityHumidity.text("Humidity: " + response.city.humidity + "%");
                })
        })
        // Reset search input and alert user if there is an error
        .catch(function (err) {
            $("#search-input").val("");

            alert("City entered could not be found. Please enter a valid city name.");
        });
};

// Fetch and use data from Open Weather current weather Api for the 5-Day Forecast Section
//Function not in use, use for reference then delete
// var fiveDayForecastSection = function(cityName) {
//     fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityName}&lon=${cityName}&appid=${apiKey}`)
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(response) {
//             var cityLon = response.coord.lon;
//             var cityLat = response.coord.lat;

//             fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(response) {
//                     console.log(response);

//                     // add 5 day forecast title
//                     var futureForecastTitle = $("#future-forecast-title");
//                     futureForecastTitle.text("5-Day Forecast:")

//                     // using data from response, set up each day of 5 day forecast
//                     for (var i = 1; i <= 5; i++) {
//                         // add class to future cards to create card containers
//                         var futureCard = $(".future-card");
//                         futureCard.addClass("future-card-details");

//                         // add date to 5 day forecast
//                         var futureDate = $("#date-" + i);
//                         date = moment().add(i, "d").format("M/D/YYYY");
//                         futureDate.text(date);

//                         // add icon to 5 day forecast
//                         var futureIcon = $("#future-icon-" + i);
//                         futureIcon.addClass("future-icon");
//                         var futureIconCode = response.daily[i].weather[0].icon;
//                         futureIcon.attr("src", `http://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + "@2x.png",
//                         temp: data.daily[i + 1].temp.day.toFixed(1),`);

//                         // add temp to 5 day forecast
//                         var futureTemp = $("#temp-" + i);
//                         futureTemp.text("Temp: " + response.daily[i].temp.day + " F");

//                         // add wind speed to 5 day forecast
//                         var futureTemp = $("#wind-" + i);
//                         futureTemp.text("Temp: " + response.daily[i].wind.day + " mph");

//                         // add humidity to 5 day forecast
//                         var futureHumidity = $("#humidity-" + i);
//                         futureHumidity.text("Humidity: " + response.daily[i].humidity + " %");
//                     }
//                 })
//         })
// };

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