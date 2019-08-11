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
    var savedarray;
    var sixAM;
    var nineAM;
    var twelvePM;
    var threePM;
    var sixPM;

    var day1;
    var day2;
    var day3;
    var day4;
    var day5;

    var day1Forcast;
    var day2Forcast;
    var day3Forcast;
    var day4Forcast;
    var day5Forcast;

    var holdFilterHours = [];
    var dataForUse = [];


    // DOM Connections //
    const signIn =  document.querySelector('#sign-in');
    const jumboContainer = document.querySelector("#jumboCont");
    const jumboContent = document.querySelector("#jumbotron");
    const infoContainer = document.querySelector('#infoCont');


    // Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDKCCyMyN9zvULKn39PO9R_c2jYXF96SUs",
        authDomain: "uta-cb-project-1.firebaseapp.com",
        databaseURL: "https://uta-cb-project-1.firebaseio.com",
        projectId: "uta-cb-project-1",
        storageBucket: "",
        messagingSenderId: "562769266637",
        appId: "1:562769266637:web:273f52edb364aaf2"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    

    /*------------\
    |  FUNCTIONS  |
    \------------*/

    // Call this to update date input with today's date.
    function updateDate() {
        console.log("Updating date input with today...");

        let now = new Date();

        let day = ("0" + now.getDate()).slice(-2);
        let month = ("0" + (now.getMonth() + 1)).slice(-2);

        let today = now.getFullYear()+"-"+(month)+"-"+(day);
        $('#date').val(today).attr('placeholder', moment().format('MM/DD/YYYY'));

    //        updateMaxDate(today);
    }
    
    // Call this to update date input's max date. 
    // ***** Redundant if validating after input ***** //
    function updateMaxDate(today) {
        console.log("Updating max date input...");
        $('#date').attr('max', moment().add('5', 'days').format('YYYY-MM-DD'));
    }

    // Call this to get current location.
    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    // Call 
    function showPosition(position) {
        x.innerHTML = "Latitude: " + position.coords.latitude + 
        "<br>Longitude: " + position.coords.longitude; 
    };


    // AJAX call to Google Maps Javascript API's geocoder class to get latitude & longitude based on State and City.
    function queryGeocode() {
        // 'state' can be either acronym or full name.
        geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?components=administrative_area:' + state + '|locality:' + cityName + '&key=AIzaSyB3Cm2EiWanz2vvfkcmsSjabHVnJmqgL4s';

        $.ajax({
            url: geocodeURL,
            crossDomain: true,
            success: function (geoData) {
                
                console.log(geoData);
                console.log('Latitude obtained: ' + lat);
                console.log('Longitude obtained: ' + lon);
                console.log('');
                
                if (geoData.status != 'OK') {
                    console.log('Unknown ERROR! ');
                    showSignin();
                } else {
                lat = geoData.results[0].geometry.location.lat;
                lon = geoData.results[0].geometry.location.lng;

                console.log('Calling weather API now...')
                callOpenWeatherAPI();

                console.log('Calling trail API now...')
                queryTrail();
                }
            },
            error: function(error) {
                console.log('ERROR! ' + error);
            }

        })
        .catch(function(error) {
            console.log(error);
        }) // End of AJAX call to Google Maps API.
    }


    // AJAX call to Open Weather API to import weather data. (chance of rain, wind, humidity, etc.)
    function callOpenWeatherAPI() {

        //openWeatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&APPID=eaea7d39c63b0abce29025a25d630226";
        openWeatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&APPID=eaea7d39c63b0abce29025a25d630226";

        $.ajax({
            url: openWeatherQueryURL,
            method: "GET",
            crossDomain: true,
        }).then(function (openWeatherAPICall) {
            // lat = openWeatherAPICall.city.coord.lat;
            // lon = openWeatherAPICall.city.coord.lon;

            // testing storage
            savedarray = openWeatherAPICall.list;
            saveData(savedarray);
        })
        .catch(function(error) {
            console.log(error);
        }) // End of AJAX call to Open Weather API.
    }


    function saveData() {
        sixAM = savedarray.filter(function (savedarray) {
            return savedarray.dt_txt.includes("06:00:00");
        });
        nineAM = savedarray.filter(function (savedarray) {
            return savedarray.dt_txt.includes("09:00:00");
        });

        twelvePM = savedarray.filter(function (savedarray) {
            return savedarray.dt_txt.includes("12:00:00");
        });

        threePM = savedarray.filter(function (savedarray) {
            return savedarray.dt_txt.includes("15:00:00");
        });

        sixPM = savedarray.filter(function (savedarray) {
            return savedarray.dt_txt.includes("18:00:00");
        });

        holdFilterHours = sixAM.concat(nineAM, twelvePM, threePM, sixPM);
        filterDays(holdFilterHours);
    }

    function filterDays(holdFilterHours) {
        day1 = moment(day1).add(1, "days").format("YYYY-MM-DD");
        day2 = moment(day1).add(1, "days").format("YYYY-MM-DD");
        day3 = moment(day2).add(1, "days").format("YYYY-MM-DD");
        day4 = moment(day3).add(1, "days").format("YYYY-MM-DD");
        day5 = moment(day4).add(1, "days").format("YYYY-MM-DD");

        day1Forcast = holdFilterHours.filter(function (holdFilterHours) {
            return holdFilterHours.dt_txt.includes(day1);
        });

        day2Forcast = holdFilterHours.filter(function (holdFilterHours) {
            return holdFilterHours.dt_txt.includes(day2);
        });

        day3Forcast = holdFilterHours.filter(function (holdFilterHours) {
            return holdFilterHours.dt_txt.includes(day3);
        });

        day4Forcast = holdFilterHours.filter(function (holdFilterHours) {
            return holdFilterHours.dt_txt.includes(day4);
        });

        day5Forcast = holdFilterHours.filter(function (holdFilterHours) {
            return holdFilterHours.dt_txt.includes(day5);
        });
        
        dataForUse.push(day1Forcast);
        dataForUse.push(day2Forcast);
        dataForUse.push(day3Forcast);
        dataForUse.push(day4Forcast);
        dataForUse.push(day5Forcast);
        console.log(dataForUse);

        // For reset
        $('#weatherInfo').empty();

        for (var U = 0; U < 5; U++) {
            var dayOFWeek = moment(dataForUse[U][0].dt_txt);
            dayOFWeek = moment(dayOFWeek).format("dddd");
            console.log(" ")
            console.log(dayOFWeek);
            var dayOFWeekH3 = $('<h3>').addClass('header').text(dayOFWeek);
            weatherRender(dataForUse, U, dayOFWeek, dayOFWeekH3);
        }
    }

    function weatherRender(dataForUse, U, dayOFWeek, dayOFWeekH3) {

        var cardCont = $('<div>').addClass('card-container');
        var cardWrap = $('<div>').addClass('card-wrapper').attr('id', dayOFWeek);

        for (var Y = 0; Y < dataForUse[U].length; Y++) {
            console.log(dataForUse[U][Y].dt_txt);
            console.log(dataForUse[U][Y].main.temp);
            console.log(dataForUse[U][Y].main.temp_max);
            console.log(dataForUse[U][Y].main.temp_min);
            console.log(dataForUse[U][Y].weather[0].main);

            var time = $('<p>').addClass('time').text("Time: " + dataForUse[U][Y].dt_txt);
            
            if (dataForUse[U][Y].main.temp > 100) {
                var tempValue = $('<p>').addClass('hotTemp').text("Temp:" + dataForUse[U][Y].main.temp);
            } else {
                tempValue = $('<p>').addClass('temp').text("Temp:" + dataForUse[U][Y].main.temp);
            }

            if (dataForUse[U][Y].weather[0].main == "Rain") {
                var weatherValue = $('<p>').addClass('rainyWeather').text("Conditions: " + dataForUse[U][Y].weather[0].main);
            } else {
                weatherValue = $('<p>').addClass('weather').text("Conditions: " + dataForUse[U][Y].weather[0].main);
            }
            // Append line items to container and wrapper.
            $(cardWrap).append(time, tempValue, weatherValue);
            $(cardCont).append(cardWrap);

            // Append container to output.
            //$('#weatherInfo').append(dayOFWeekH3);
            $(cardWrap).prepend(dayOFWeekH3);
            $('#weatherInfo').append(cardCont);
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
            //testing var data = response.data;
            // trailsData = data;

            trailsData = response.data;
            data = trailsData;

            console.log(response);
            console.log(trailsData);            
            console.log('Response length: ' + data.length);
            console.log('Type: '+ typeof data);
            console.log('');


            // ***** ADD A FUNCTION THAT STORES AJAX RESPONSE IN AN OBJECT. ***** //
            // THIS CAN ALSO REDUCE AJAX CALLS IF WE ALLOW USER TO REQUEST SORT/FILTER CHANGES.

            if ( typeof response === 'null' ) {
                //trailsData.length === 0 does not work
                //!$.trim(response) doesn't work directly
                console.log('Trail API Promise returned null');
                debugger;
                //showSignin();  not yet working.
            } else {
                //debugger;
                for (let j = 0; j < data.length; j++) {
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
    
                    // Error-catch for blank thumbnail URL.
                    if (data[j].thumbnail === "") {
                        console.log('Thumbnail is considered blank...');
                        data[j].thumbnail ='https://images.singletracks.com/graphics/no_photo_750x500.png'
                    } else {console.log('Thumbnail looks normal.')};
    
                    // Singletracks.com has Trail widget if higher res pic is needed, but may need to show other info.
                    console.log('Profile page: ' + data[j].url); // URL to profile page.
                    console.log(' ');

                    // At this point, all AJAX calls succeeded.
                    hideSignin();
    
                    // Call render function and pass trail data.
                    renderCard(j, data[j].name, data[j].thumbnail, data[j].rating, data[j].length);
                    
                }
            }

        })
        .catch(function(error) {
            console.log(error);
        }) // End of AJAX call to Trail API.
    } // End of function.

    

    // DATA PROCESSING FUNCTION //
    // Filter, evaluate and reorganize data before rendering.


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
        console.log(thumbnail);
//        var hr = $(thumbnail).append($('<hr>'));
        var name = $('<h3>').addClass('header').text(na);
  //      var hr = $(name).append($('<hr>'));
        var length = $('<p>').addClass('length').text(le + ' mi.');
        var rating = $('<p>').addClass('rating').text(ra + ' rating');


        // ***** ADD FUNCTION THAT ADDRESSES MISSING INFO (e.g. Thumbnail) ***** //


        // Append line items to container and wrapper.
        $(cardWrap).append(thumbnail, name, length, rating);
        $(cardCont).append(cardWrap);

        // Append container to output.
        $('#trailList').append(cardCont);
    }


    /*--------------------------\
    | SIGNIN ANIMATION FUNCTION |
    \--------------------------*/

    function showSignin() {
    // Sign in box animation
    // $("#sign-in").animate(
    //     // FIRST ARG CSS PROPS
    //     {
    //         opacity: 1,
    //         top: '0px'
    //     },
    //     // SECOND ARG TIME (MS)
    //     700);
        
    //     $(".jumbotron").animate({
    //         opacity: 1,
    //         top: '0px'
    //     },1000);

        // For reset
        $('#infoCont').hide();
        jumboContainer.style.display.block;
        //let node = document.getElementById('jumbotron');
        
        //jumbotron.removeEventListener('animationend', 'slideInDown')

        //debugger;
        $('#spacer').show();
        
        // Animate.CSS
        signIn.classList.add('animated', 'slideInUp');
        jumbotron.classList.add('animated', 'slideInDown');
        //jumbotron.classList.add('animated', 'fast')

        // WILL NEED RESET FOR INFOCONTAINER IF ALLOWING RESET.
        //        infoContainer.classList.add('animated', 'animateContentIn');
    }

    function hideSignin() {
        // $("#sign-in").animate({
        //     opacity: 0,
        //     top: '1000px'
        // },2000);

        // $(".jumbotron").animate({
        //     opacity: 0,
        //     bottom: '10000px'
        // },1000)

        //debugger;

        // Animate.CSS
        signIn.classList.add('animated', 'slideOutDown');
        signIn.addEventListener('animationend', function() {
            $('#spacer').hide();
            // AnimateCSS: remove any if present.
            signIn.classList.remove('animated', 'slideOutDown')
        });
        jumbotron.classList.add('animated', 'slideOutUp');
        jumbotron.addEventListener('animationend', function() {
            $('#jumboCont').hide();
            // AnimateCSS: remove any if present.
            jumbotron.classList.remove('animated', 'slideOutUp');
            //jumbotron.classList.remove('animated', 'fast');
         });

         $('#infoCont').show();
         infoContainer.classList.add('animated', 'fadeIn');

        //     
        // signIn.addEventListener('animationend', function() { 
        //     $('#sign-in').hide() });
    }

    // function imgError(image) {
    //     image.onerror = "";
    //     image.src = "https://images.singletracks.com/graphics/no_photo_750x500.png";
    //     //"this.src='http://lorempixel.com/output/city-q-c-300-200-10.jpg'"
    //     return true;
    // }

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
        
        var currentDate = moment();

        // May need to fine-tune.
        var currentDatePlus5 = moment(currentDate).add(6,"days");
        
        userInputDate = moment(userInputDate, "YYYY/MM/DD");
        console.log("Current Date: " + moment(currentDate).format("DD/MM/YYYY"));
        console.log("User Date: " + moment(userInputDate).format("DD/MM/YYYY"));
        console.log("Date 5 days from current Date: " + moment(currentDatePlus5).format("DD/MM/YYYY"));
        var checkInBetween = moment(userInputDate).isBetween(currentDate,currentDatePlus5);
        console.log(checkInBetween);

        if(checkInBetween == true) {
            console.log("Date is within 5 days!");

            //test hideSignin();

            queryGeocode();
            $("#date").removeClass("is-invalid");
        } else {
            console.log("False!");
            $("#date").addClass("is-invalid");
            $(".errorMessage").text("Please choose one of the next 5 days.").attr('id', 'showError');
            setTimeout(() => {
                $(".errorMessage").text('').attr('id', '');
            }, 5500);
        }
        
    });
    
    
    /*-----------------------\
    | ON CLICK OF TRAIL CARD |
    \-----------------------*/

    // Populate and display a trail modal.
    $(document.body).on('click', '.card-wrapper', function (event) {
        event.preventDefault();
        
        let id = $(this).attr('id');
        let modalData = trailsData[id];
        
        console.log(modalData)
        //test $('#trailModal').empty();
        $('#trailContent').empty();
        
        //let thumb = $('<img>').attr('src', modalData.thumbnail);
//         if (modalData.thumbnail === "") {
//             // Fallback image
//             //let thumb = $('<img>').attr('src', 'https://images.singletracks.com/graphics/no_photo_750x500.png').addClass('trailImg img-thumbnail');
//             let thumb = $('<img>')
//                 .attr('src', 'https://images.singletracks.com/graphics/no_photo_750x500.png')
//                 .on('error', imgError() )
// //                "this.src='http://lorempixel.com/output/city-q-c-300-200-10.jpg'"
//                 //onerror: "imgError(" + this + ")"
//                 .addClass('trailImg img-thumbnail');
//         } else {
//             let thumb = $('<img>').attr('src', modalData.thumbnail).addClass('trailImg img-thumbnail');
//         }
        let thumb = $('<img>').attr('src', modalData.thumbnail).addClass('trailImg img-thumbnail');
        let site = $('<a>').attr('href', modalData.url).attr('id', 'imgLink').append(thumb);

        let name = $('<h3>').text(modalData.name);

        // Capitalize first letter if not already.
        let diffText = modalData.difficulty.replace(/^\w/, c => c.toUpperCase());
        let diff = $('<p>').text('DIFFICULTY: ' + diffText);

        let desc = $('<p>').text('DESCRIPTION: ' + modalData.description);
        let dir = $('<p>').text('DIRECTIONS: ' + modalData.directions);
        //let site = $('<a>').attr('href', modalData.url).text(modalData.url);

        //$('#trailContent').append(thumb, name, diff, desc, dir, site);
        $('#trailContent').append(site, name, diff, desc, dir);

        $('#trailModal').show();

        // Animate.CSS on modal.
        const animateModal =  document.querySelector('#trailModal');
        animateModal.classList.add('animated', 'slideInDown');
    });

    // When the user clicks outside of the modal, close modal.
    window.onclick = function (event) {
        var modal = $('#trailModal')[0];
        // console.log(modal);
        // console.log(event.target);
        // Consider: $(event.target)
        if (event.target == modal) {
        // modal.style.display = 'none';
        $('#trailModal').hide();
        }
    }

    $(document).on('click', '#imgLink', function (event) {
        event.preventDefault();
        setTimeout(() => window.open($(this).attr('href')), 1000);
    })
    
    // Optional: ADD KEYBOARD NAVIGATION FUNCTION
    

        
    
    /*--------\
    | ON LOAD |
    \--------*/

    updateDate();
    
    showSignin();

});


