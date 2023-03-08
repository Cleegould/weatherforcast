$(function () {
    const apiKey = "37fa926b7061c87759d3ac546debbb32";

    //get location history
    var locationHistory = JSON.parse(localStorage.getItem('LocationHistory'));

    if (locationHistory != null) {//errors if there is no history.  null check
        //loop over history
        for (var i = 0; i < locationHistory.length; i++) {
            //get values from each history entry
            var city = locationHistory[i].city;
            var state = locationHistory[i].state;
            //write history to screen to each description block
            $("#locationHistory").append("<span class='pad-8'><a href='#' class='historyLink'>" + city + ", " + state + "</a></span>");
        }
    }

    function getLatLon(city, state, key) {

        var dataString = "q=" + city + "," + state + ",us&appId=" + key;

        $.getJSON("https://api.openweathermap.org/data/2.5/forecast?units=imperial&" + dataString, function (data) {            

            var lat = data.city.coord.lat;
            var lon = data.city.coord.lon;
            getForecast(lat, lon, apiKey);
        });

    }

    function getForecast(lat,lon,key) {

        var dataString = "lat=" + lat + "&lon=" + lon + "&appId=" + key;

        $.getJSON("https://api.openweathermap.org/data/3.0/onecall?cnt=5&exclude=minutely,hourly,alerts&units=imperial&" + dataString, function (data) {
            console.log(data); // will contain all data (and display it in console)

            var cityName = $("#cityTxt").val().toUpperCase() + ", " + $("#stateTxt").val().toUpperCase();            
            var currentDescription = data.current.weather[0].description;            
            var currentIconurl = "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";
            var currentIconDescription = data.current.weather[0].main;
            var currentTemp = data.current.temp + "&deg;F";
            var currentFeelsLike = data.current.feels_like + "&deg;F";
            var currentHumidity = data.current.humidity + "%";
            var currentWind = data.current.wind_speed + "mph";

            $("#currentWeatherResults").empty();
            $("#futureWeatherResults").empty();

            $("#currentWeatherResults").html("<div><h4>Current Weather for " + cityName + "</h4> <span class='redText'>" + dayjs.unix(data.current.dt).format('MM/DD/YYYY h:mma')  + "</span/></div>");
            $("#currentWeatherResults").append('<div><img id="wicon" src="' + currentIconurl + '" alt="' + currentIconDescription + '"><span>' + currentDescription + '</span></div>');
            $("#currentWeatherResults").append('<div>Current Temp: ' + currentTemp + '</div>');
            $("#currentWeatherResults").append('<div>Current Feels Like Temp: ' + currentFeelsLike + '</div>');
            $("#currentWeatherResults").append('<div>Current Humidity: ' + currentHumidity + '</div>');
            $("#currentWeatherResults").append('<div>Current Wind Speed: ' + currentWind + '</div>');

            //future 5 days
            $("#futureWeatherResults").append("<h4>5 Day Forecast</h4>");            
            for (var i = 1; i < 6; i++) {
                var futureDate = dayjs.unix(data.daily[i].dt).format('MM/DD/YYYY');
                var futureDescription = data.daily[i].weather[0].description;
                var futureIconurl = "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";
                var futureIconDescription = data.daily[i].weather[0].main;
                var futureMaxTemp = data.daily[i].temp.max + "&deg;F";
                var futureMinTemp = data.daily[i].temp.min + "&deg;F";                
                var futureHumidity = data.daily[i].humidity + "%";
                var futureWind = data.daily[i].wind_speed + "mph";

                $("#futureWeatherResults").append("<hr class='futureDay'>");
                $("#futureWeatherResults").append("<div class='redText'>" + futureDate + "</div>");
                $("#futureWeatherResults").append('<div><img id="wicon" src="' + futureIconurl + '" alt="' + futureIconDescription + '"><span>' + futureDescription + '</span></div>');
                $("#futureWeatherResults").append('<div>Max Temp: ' + futureMaxTemp + '</div>');
                $("#futureWeatherResults").append('<div>Min Temp: ' + futureMinTemp + '</div>');
                $("#futureWeatherResults").append('<div>Humidity: ' + futureHumidity + '</div>');
                $("#futureWeatherResults").append('<div>Wind Speed: ' + futureWind + '</div>');              
            }
        });        

    }

    $("#searchBtn").click(function () {
        var city = $("#cityTxt").val();
        var state = $("#stateTxt").val();

        //save location to history
        var locationArr = {
            city: city.toUpperCase(),
            state: state.toUpperCase()
        };
        var locationHistory = JSON.parse(localStorage.getItem("LocationHistory") || '[]');
        locationHistory.push(locationArr);
        localStorage.setItem("LocationHistory", JSON.stringify(locationHistory));

        getLatLon(city,state,apiKey);
    });

    $(".historyLink").click(function (x) {
        var city = $(this)[0].text.split(',')[0].trim();
        var state = $(this)[0].text.split(',')[1].trim();
        $("#cityTxt").val(city);
        $("#stateTxt").val(state);
        getLatLon(city, state, apiKey);
    });
    
});
