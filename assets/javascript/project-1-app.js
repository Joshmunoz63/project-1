$(document).ready(function () {

    /*------------\
    | GLOBAL VARS |
    \------------*/
    var state = "";
    var cityName = "";
    var userInputDate = "";

    var geocodeURL = "";
    var openWeatherQueryURL = "";
    var trailAPIQueryURL = "";
    var lat = 0;
    var lon = 0;
    var weatherData = {};
    var trailsData = {};


    // DOM //
    // Declare connections with DOM as needed.


    //Functions -----------------------------------------

    // AJAX call to Google Maps Javascript API's geocoder class to get latitude & longitude based on State and City.
    function queryGeocode() {
        // 'state' can be either acronym or full name.
        geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?components=administrative_area:' + state + '|locality:' + cityName + '&key=AIzaSyB3Cm2EiWanz2vvfkcmsSjabHVnJmqgL4s';

        $.ajax({
            url: geocodeURL,
            crossDomain: true,
            success: function (geoData) {
                lat = geoData.results[0].geometry.location.lat;
                lon = geoData.results[0].geometry.location.lng;
    
                console.log(geoData);
                console.log('Latitude obtained: ' + lat);
                console.log('Longitude obtained: ' + lon);
                console.log('');

                console.log('Calling weather API now...')
                callOpenWeatherAPI();

                console.log('Calling trail API now...')
                queryTrail();        
            }
        });
    }


    // AJAX call to Open Weather API to import weather data. (chance of rain, wind, humidity, etc.)
    function callOpenWeatherAPI() {
        
        //openWeatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&APPID=eaea7d39c63b0abce29025a25d630226";
        openWeatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&APPID=eaea7d39c63b0abce29025a25d630226";

        $.ajax({
            url: openWeatherQueryURL,
            method: "GET",
            crossDomain: true,
        }).then(function (openWeatherAPICall) {
            // lat = openWeatherAPICall.city.coord.lat;
            // lon = openWeatherAPICall.city.coord.lon;
            
            // testing storage
            weatherData = openWeatherAPICall;

            console.log(openWeatherAPICall);
            console.log("Here is the weather forcast for: " + openWeatherAPICall.city.name); 
            console.log("Lat: " + lat);
            console.log("Lon: " + lon);
            
            for(var i = 0; i < openWeatherAPICall.list.length; i++) {
                console.log(" ");
                
                var timeANDdate = openWeatherAPICall.list[i].dt_txt;
                var time = timeANDdate.slice(11);
                var date = timeANDdate.slice(0,10);
        
                if((time == "00:00:00") || (time == "03:00:00") || (time == "00:00:00") || (time == "21:00:00")) {
                    console.log("Too early/late");
                } else {
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
            console.log("It might get over 100 degrees! Bring some water in case!");
            console.log("-----------------------");
        }
    
        if(openWeatherAPICall.list[i].main.temp_min < 60) {
            console.log("-----------------------");
            console.log("It might be pretty cool outside. Bring a jacket just in case!");
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
    function queryTrail() {
        console.log('Trail API received latitude of: ' + lat);
        console.log('Trail API received longitude of: ' + lon);
        console.log('');

        trailAPIQueryURL = "https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=" + lat +"&lon=" + lon;
        
        $.ajax({
            async: false,
            url: trailAPIQueryURL,
            method: 'GET',
            headers: {
                "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
                "x-rapidapi-key": "cfbae3bd13msh660a849870aa5cap194a7fjsnd973bfb99523"
            }
        }).then(function (response) {
            var data = response.data;
            trailsData = data;

            console.log(response);
            console.log(trailsData);            
            console.log('Response length: ' + data.length);
            console.log('Type: '+ typeof data);
            console.log('');


            // ***** ADD A FUNCTION THAT STORES AJAX RESPONSE IN AN OBJECT. ***** //
            // THIS CAN ALSO REDUCE AJAX CALLS IF WE ALLOW USER TO REQUEST SORT/FILTER CHANGES.


            for (let j = 0; j < data.length; j++) {
                // Call render function and pass trail data.
                renderCard(j, data[j].name, data[j].thumbnail, data[j].rating, data[j].length);
                // Optional: Write a function that stores data in an object first.

                // Output data to console.
                console.log('Object key: ' + j);
                console.log("State: " + data[j].region);
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


    //Date validation
    function validateDate(userInputDate) {
        var currentDate = moment();
        var currentDatePlus5 = moment(currentDate).add(5,"days");
        userInputDate = moment(userInputDate, "YYYY/MM/DD");
        console.log("Current Date: " + moment(currentDate).format("DD/MM/YYYY"));
        console.log("User Date: " + moment(userInputDate).format("DD/MM/YYYY"));
        console.log("Date 5 days from current Date: " + moment(currentDatePlus5).format("DD/MM/YYYY"));
        var checkInBetween = moment(userInputDate).isBetween(currentDate,currentDatePlus5);
        console.log(checkInBetween);

        if(checkInBetween == true) {
            console.log("True!");
            callOpenWeatherAPI(cityName);
            $("#date").removeClass("is-invalid");
        } else {
            console.log("False!");
            $("#date").addClass("is-invalid");
        }
    }

    // SUGGEST & RENDER FUNCTION //
    // Take reorganized data and output to display.
    // Optional: Allow re-sorting of output by specific attribute.

    // Call this to render trail cards.
    function renderCard(ke, na, th, ra, le) {
        // Create divs that contain trail info.
        var cardCont = $('<div>').addClass('card-container col col-lg-3 col-md-4 col-sm-12');
        var cardWrap = $('<div>').addClass('card-wrapper').attr('id', ke);
        
        // Create trail line items.
        var thumbnail = $('<img>').addClass('image').attr('src', th);
        var name = $('<h3>').addClass('header').text(na);
        var length = $('<p>').addClass('length').text(le + ' mi.');
        var rating = $('<p>').addClass('rating').text(ra + ' rating');


        // ***** ADD FUNCTION THAT ADDRESSES MISSING INFO (e.g. Thumbnail) ***** //


        // Append line items to container and wrapper.
        $(cardWrap).append(thumbnail, name, length, rating);
        $(cardCont).append(cardWrap);

        // Append container to output.
        $('#trailList').append(cardCont);
    }


    // Call this to render a trail modal.
    function renderModal(key) {
        
        
        $('#trailModal');
    }

    // Optional: STORAGE FUNCTION //
    // Optional: Allow saving/tracking of multiple query data.
    // Optional: Get/set some query data in database for persistence/tracking.
    

    //End of Functions -----------------------------------------        



    // DATA ENTRY EVENT HANDLERS //
    // Optional: Consider taking info such as intended activity/purpose.

    // This function handles events where the Submit button is clicked.
    /*------------------------\
    | ON CLICK FOR SEARCH BTN |
    \------------------------*/
    $('.btn').on('click', function (event) {
        event.preventDefault();

        state = $('#state').val().trim();
        cityName = $('#name').val().trim();
        userInputDate = $('#date').val().trim();


        // ***** ADD VALIDATION FUNCTIONS FOR ALL ENTRY ***** //


        // Geocode AJAX call is made only when search button is clicked, so we can sequentially call other AJAX calls from within.
        queryGeocode();

        // search animation
        $("#sign-in").animate({
            opacity: 0,
            top: '1000px'
        },1000);

        $(".jumbotron").animate({
            opacity: 0,
            bottom: '10000px'
        },1000);
    });
    
    
    /*-----------------------\
    | ON CLICK OF TRAIL CARD |
    \-----------------------*/

    $(document.body).on('click', '.card-wrapper', function (event) {
        event.preventDefault();

        // let trailName = $(this).attr('id');
        // console.log(trailName);

        let 

    });


    // Optional: ADD KEYBOARD NAVIGATION FUNCTION
    

    /*--------\
    | ON LOAD |
    \--------*/
    // Sign in box animation
    $("#sign-in").animate(
        // FIRST ARG CSS PROPS
        {
            opacity: 1,
            top: '0px'
        },
        // SECOND ARG TIME (MS)
        1500);

    $(".jumbotron").animate({
        opacity: 1,
        top: '0px'
    },1000);    
});



