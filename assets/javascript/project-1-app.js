$(document).ready(function () {
// GLOBAL VARIABLES //
// Declare global variables.

var cityName = "";
var openWeatherQueryURL = "";
// DOM //
// Declare connections with DOM.


// API CONFIGURATIONS //
// Configure connection to API endpoints.


// DATA ENTRY EVENT HANDLERS //
// Add data entry functions with validation.
// Take user input of preferred city.
// Take user input of preferred date/range.
// Take user input of preferred budget.
// Optional: Consider taking info such as intended activity/purpose.


// SKYSCANNER API //
// Make AJAX call to API to import relevant flight data. (airlines, fares, dates, etc.)


// WEATHER API //
// Make AJAX call to API to import weather data. (chance of rain, wind, humidity, etc.)


//Functions -----------------------------------------
function callOpenWeatherAPI() {
    cityName = "Houston"
    openWeatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName +"&units=imperial&APPID=eaea7d39c63b0abce29025a25d630226";
    console.log(openWeatherQueryURL);
    $.ajax({
        url: openWeatherQueryURL,
        method: "GET",
        crossDomain: true,
    }).then(function (openWeatherAPICall) {
        console.log(openWeatherAPICall);
        console.log("Here is the weather forcast for: " + openWeatherAPICall.city.name); 
        for(var i = 0; i < openWeatherAPICall.list.length; i++) {
            console.log(" ");
            console.log(openWeatherAPICall.list[i].dt_txt);
            console.log("Temp: " + openWeatherAPICall.list[i].main.temp);
            console.log("Max Temp: " + openWeatherAPICall.list[i].main.temp_max);
            console.log("Min Temp: " + openWeatherAPICall.list[i].main.temp_min);
            console.log("Conditions: " + openWeatherAPICall.list[i].weather[0].description);
            console.log(" ");
        }
    });
}
// DATA PROCESSING FUNCTION //
// Filter, evaluate and reorganize data before rendering.


// SUGGEST & RENDER FUNCTION //
// Take reorganized data and output to display.
// Optional: In addition to flight dates & lines, suggest things to do or places to visit at destination. Maybe hotel suggestions.


// STORAGE FUNCTION //
// Allow saving/tracking of multiple query data.
// Optional: Get/set some query data in database for persistence/tracking.

//End of Functions -----------------------------------------

//Executable Code
callOpenWeatherAPI();
//End of executable code
    
});

