$(document).ready(function () {

    // GLOBAL VARIABLES //
    var cityName = "";
    var openWeatherQueryURL = "";
    var trailAPIQueryURL = "";
    var lat = 0;
    var lon = 0;
    var trails = {};


    // DOM //
    // Declare connections with DOM as needed.


    // DATA ENTRY EVENT HANDLERS //
    // Add data entry functions with validation.
    // Take user input of preferred city.
    // Take user input of preferred date/range.
    // Take user input of preferred budget.
    // Optional: Consider taking info such as intended activity/purpose.




    //Functions -----------------------------------------

    // AJAX call to Open Weather API to import weather data. (chance of rain, wind, humidity, etc.)
    function callOpenWeatherAPI() {
        
        // Test variable
        cityName = "Phoenix"

        // ***** Add logic to prevent *****/

        openWeatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName +"&units=imperial&APPID=eaea7d39c63b0abce29025a25d630226";
        $.ajax({
            url: openWeatherQueryURL,
            method: "GET",
            crossDomain: true,
        }).then(function (openWeatherAPICall) {
            lat = openWeatherAPICall.city.coord.lat;
            lon = openWeatherAPICall.city.coord.lon;
            queryTrail(lat, lon);
            console.log(openWeatherAPICall);
            console.log("Here is the weather forcast for: " + openWeatherAPICall.city.name); 
            console.log("Lat: " + lat);
            console.log("Lon: " + lon);
            
            for(var i = 0; i < openWeatherAPICall.list.length; i++) {
                console.log(" ");
                console.log(openWeatherAPICall.list[i].dt_txt);
                console.log("Temp: " + openWeatherAPICall.list[i].main.temp);
                console.log("Max Temp: " + openWeatherAPICall.list[i].main.temp_max);
                console.log("Min Temp: " + openWeatherAPICall.list[i].main.temp_min);
                console.log("Conditions: " + openWeatherAPICall.list[i].weather[0].main);
                console.log("Ground Level: " + openWeatherAPICall.list[i].main.grnd_level);
                console.log("Wind: " + openWeatherAPICall.list[i].wind.deg + " degrees");
                console.log("Wind Speed: " + openWeatherAPICall.list[i].wind.speed);
                console.log(" ");
            }
        });
    }

    // Make AJAX call to Find Bike Trails endpoint to import 
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
            
            for (let j = 0; j < response.length; j++) {
                // Call render function and pass trail data.
                renderCard(response.name, response.thumbnail, response.rating, response.length);

                // Output data to console.
                console.log('Trail name: ' + response.name);
                console.log('Thumbnail: ' + response.thumbnail);
                console.log('Length in miles: ' + response.length);
                console.log('5-point rating: ' + response.rating);
            }

        }) // End of AJAX call to Trail API.
    } // End of function.

    
    // DATA PROCESSING FUNCTION //
    // Filter, evaluate and reorganize data before rendering.


    // SUGGEST & RENDER FUNCTION //
    // Take reorganized data and output to display.
    // Optional: Allow resorting of output by specific attribute.

    function renderCard() {
        // Complete this after DOM connections are declared.
    }


    // Optional: STORAGE FUNCTION //
    // Optional: Allow saving/tracking of multiple query data.
    // Optional: Get/set some query data in database for persistence/tracking.
    

    //End of Functions -----------------------------------------
        
        //Executable Code
        callOpenWeatherAPI();
        queryTrail(lat, lon);
        //End of executable code
        
});

