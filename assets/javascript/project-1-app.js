// GLOBAL VARIABLES //
// Declare global variables.


// DOM //
// Declare connections with DOM.
$(document).on("click", "#search", init);

function init(init) {
    // stop page from refreshing
    event.preventDefault();
    
    $("#sign-in").slideUp().fadeout();
}


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


// DATA PROCESSING FUNCTION //
// Filter, evaluate and reorganize data before rendering.


// SUGGEST & RENDER FUNCTION //
// Take reorganized data and output to display.
// Optional: In addition to flight dates & lines, suggest things to do or places to visit at destination. Maybe hotel suggestions.


// STORAGE FUNCTION //
// Allow saving/tracking of multiple query data.
// Optional: Get/set some query data in database for persistence/tracking.