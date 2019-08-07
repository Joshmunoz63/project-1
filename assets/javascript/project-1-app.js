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
        
        // ***** Add logic to prevent *****/

        openWeatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&APPID=eaea7d39c63b0abce29025a25d630226";
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
                console.log('Profile page: ' + data[j].url); // URL to profile page.
                console.log(' ');
            }

        }) // End of AJAX call to Trail API.
    } // End of function.

    

    // DATA PROCESSING FUNCTION //
    // Filter, evaluate and reorganize data before rendering.



    // SUGGEST & RENDER FUNCTION //
    // Take reorganized data and output to display.
    // Optional: Allow resorting of output by specific attribute.

    function renderCard(na, th, ra, le) {
        // Create divs that contain trail info.
        var cardCont = $('<div>').addClass('card-container col col-lg-3 col-md-4 col-sm-12 text-light');
        var cardWrap = $('<div>').addClass('card-wrapper').attr('id', na);
        
        // Create trail line items.
        var thumbnail = $('<img>').addClass('image').attr('src', th);
        var name = $('<h3>').addClass('header').text(na);
        var length = $('<p>').addClass('length').text(le + ' mi.');
        var rating = $('<p>').addClass('rating').text(ra + ' rating');


        // ***** ADD FUNCTION THAT ADDRESSES TRAILS THAT ARE MISSING CERTAIN INFO ***** //
        // THIS MAY INVOLVE CREATING AN OBJECT TO STORE AJAX RESPONSE.


        // Append line items to container and wrapper.
        $(cardWrap).append(thumbnail, name, length, rating);
        $(cardCont).append(cardWrap);

        // Append container to output.
        $('#trailList').append(cardCont);
    }



    // Optional: STORAGE FUNCTION //
    // Optional: Allow saving/tracking of multiple query data.
    // Optional: Get/set some query data in database for persistence/tracking.
    


    //End of Functions -----------------------------------------        



    // DATA ENTRY EVENT HANDLERS //
    // Optional: Consider taking info such as intended activity/purpose.

    // This function handles events where the Submit button is clicked.
    $('.btn').on('click', function (event) {
        event.preventDefault();

        state = $('#state').val().trim();
        cityName = $('#name').val().trim();
        date = $('#date').val().trim();

        // ***** ADD VALIDATION FUNCTIONS FOR ALL ENTRY ***** //
        console.log(cityName);
        callOpenWeatherAPI(cityName);
    });
    
    // ***** ADD EVENT HANDLER FOR TRAIL CARD BEING CLICKED ***** //

    // Optional: ADD KEYBOARD NAVIGATION FUNCTION

});

