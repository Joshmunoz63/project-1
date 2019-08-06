$(document).ready(function () {

    // GLOBAL VARIABLES //
    var state = "";
    var cityName = "";
    var date = "";

    var openWeatherQueryURL = "";
    var trailAPIQueryURL = "";
    var lat = 0;
    var lon = 0;
    var trails = {};


    // DOM //
    // Declare connections with DOM as needed.


    //Functions -----------------------------------------

    // AJAX call to Open Weather API to import weather data. (chance of rain, wind, humidity, etc.)
    function callOpenWeatherAPI() {

        openWeatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName +"&units=imperial&APPID=eaea7d39c63b0abce29025a25d630226";
        $.ajax({
            url: openWeatherQueryURL,
            method: "GET",
            crossDomain: true,
        }).then(function (openWeatherAPICall) {
            lat = openWeatherAPICall.city.coord.lat;
            lon = openWeatherAPICall.city.coord.lon;
            
            // ***** Rewrite later to separate this from this ajax call. Current has scope issue. ***** //
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
            var data = response.data;
            console.log('Response length: ' + data.length);
            console.log('Type: '+ typeof data);
            console.log('');

            for (let j = 0; j < data.length; j++) {
                // Call render function and pass trail data.
                renderCard(data[j].name, data[j].thumbnail, data[j].rating, data[j].length);
                // Optional: Write a function that stores data in an object first.

                // Output data to console.
                console.log('Description: ' + data[j].description);
                console.log('Difficulty: ' + data[j].difficulty);
                console.log('Singletracks ID: ' + data[j].id);
                console.log('Trail name: ' + data[j].name);
                console.log('Length in miles: ' + data[j].length);
                console.log('5-point rating: ' + data[j].rating); // Is 0 if no review exists.
                console.log('Thumbnail: ' + data[j].thumbnail); // URL to low-res thumbnail.
                // Singletracks.com has Trail widget if higher res pic is needed, but may need to show other info.
                console.log('Length in miles: ' + data[j].url); // URL to profile page.
                console.log(' ');
            }

        }) // End of AJAX call to Trail API.
    } // End of function.

    

    // DATA PROCESSING FUNCTION //
    // Filter, evaluate and reorganize data before rendering.



    // SUGGEST & RENDER FUNCTION //
    // Take reorganized data and output to display.
    // Optional: Allow resorting of output by specific attribute.

    function renderCard() {
        // Create cards and output them to DOM.
    }



    // Optional: STORAGE FUNCTION //
    // Optional: Allow saving/tracking of multiple query data.
    // Optional: Get/set some query data in database for persistence/tracking.
    


    //End of Functions -----------------------------------------        



    // DATA ENTRY EVENT HANDLERS //
    // Optional: Consider taking info such as intended activity/purpose.

    // This function handles events where the  button is clicked.
    $('.btn').on('click', function (event) {
        event.preventDefault();

        state = $('#state').val().trim();
        cityName = $('#name').val().trim();
        date = $('#date').val().trim();

        // ***** ADD VALIDATION FUNCTIONS FOR ALL ENTRY ***** //

        callOpenWeatherAPI();
    });
    
    // Optional: ADD KEYBOARD NAVIGATION FUNCTION

});

