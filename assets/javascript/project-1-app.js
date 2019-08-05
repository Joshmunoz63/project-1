$(document).ready(function () {
// GLOBAL VARIABLES //
// Declare global variables.

var cityName = "";
var openWeatherQueryURL = "";
var trailAPIQueryURL = "";
var lat = 0;
var lon = 0;
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
    cityName = "College Station"
    openWeatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName +",us&units=imperial&APPID=eaea7d39c63b0abce29025a25d630226";
    $.ajax({
        url: openWeatherQueryURL,
        method: "GET",
        crossDomain: true,
    }).then(function (openWeatherAPICall) {
        lat = openWeatherAPICall.city.coord.lat;
        lon = openWeatherAPICall.city.coord.lon;
        
        console.log(openWeatherAPICall);
        console.log("Here is the weather forcast for: " + openWeatherAPICall.city.name); 
        console.log("Lat: " + lat);
        console.log("Lon: " + lon);
        
        
        for(var i = 0; i < openWeatherAPICall.list.length; i++) {
            console.log(" ");
            console.log(openWeatherAPICall.list[i].dt_txt);
            checkWeatherConditions(openWeatherAPICall, i);
            console.log("Temp: " + openWeatherAPICall.list[i].main.temp);
            console.log("Max Temp: " + openWeatherAPICall.list[i].main.temp_max);
            console.log("Min Temp: " + openWeatherAPICall.list[i].main.temp_min);
            console.log("Conditions: " + openWeatherAPICall.list[i].weather[0].main);
            console.log("Ground Level: " + openWeatherAPICall.list[i].main.grnd_level);
            console.log("Wind: " + openWeatherAPICall.list[i].wind.deg + " degrees");
            console.log("Wind Speed: " + openWeatherAPICall.list[i].wind.speed);
            console.log("--End of record--");
            console.log(" ");
        }
    });
}

function checkWeatherConditions(openWeatherAPICall, i) {
    if(openWeatherAPICall.list[i].main.temp > 100){
        console.log("Please be cautious! It's over 100 degrees");
    } else if(openWeatherAPICall.list[i].main.temp < 50) {
        console.log("-----------------------");
        console.log("Please be cautious! It's pretty cold outside!");
        console.log("-----------------------");
    }

    if(openWeatherAPICall.list[i].main.temp_max > 100) {
        console.log("-----------------------");
        console.log("It might get over 100 degrees! Bring some water incase!");
        console.log("-----------------------");
    }

    if(openWeatherAPICall.list[i].main.temp_min < 60) {
        console.log("-----------------------");
        console.log("It might be pretty cool outside. Bring a jacket just incase!");
        console.log("-----------------------");
    }

    if(openWeatherAPICall.list[i].wind.speed > 20) {
        console.log("-----------------------");
        console.log("It's going to be pretty windy outside. Be careful driving!");
        console.log("-----------------------");
    }

    switch(openWeatherAPICall.list[i].weather[0].main) {
        case "Thunderstorm": 
        console.log("Maybe not the best day to go hiking!");
        break;

        case "Rain": 
        console.log("-----------------------");
        console.log("Bring a rain coat!");
        console.log("-----------------------");
        break;

        case "Snow": 
        console.log("Don't forget your snow shoes!");
        break;
    }
}

function queryTrail(lat, lon) {
    trailAPIQueryURL = "https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=" + lat +"&lon=" + lon;
    $.ajax({
        url: trailAPIQueryURL,
        method: 'GET',
        headers: {
            "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
            "x-rapidapi-key": "cfbae3bd13msh660a849870aa5cap194a7fjsnd973bfb99523"
        }
    }).then(function (response) {
        console.log(response);
    }) // End of AJAX call to Trail API.
} // End of function.

// Make AJAX call to Trail API on load.
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

//Not sure how to make the queryTrail function standalone just yet.
//queryTrail(lat, lon);


//End of executable code
    
});

