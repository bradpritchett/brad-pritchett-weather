function getWeather(event) {
  var myapi = "baf1899b809d63a415c29d9f28d7ec1c";
  var myCity = $("#city-search ").val();
  var citySearched = $("#cities-searched").append(
    `<li class="list-group-item city-history" data-city=${myCity}>${myCity}</li>`
  );
  var qUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    myCity +
    "&units=imperial&appid=" +
    myapi +
    "";

  $.ajax({
    url: qUrl,
    method: "GET",
    dataType: "json",
  }).then(processResponse);

  function processResponse(response1) {
    if ($(".hidden").hasClass("hidden")) {
      $(".hidden").removeClass("hidden");
    }
    var today = moment().format("MM/DD/YYYY");
    var cityText = response1.name + ` (` + today + `)`;
    var coordinatesLon = response1.coord.lon;
    var coordinatesLat = response1.coord.lat;
    processUV(coordinatesLon, coordinatesLat);
    processFiveDay(myCity);
    var rawTemp = response1.main.temp;
    var temp = rawTemp.toFixed(0) + `°`;
    var hum = response1.main.humidity + `%`;
    var wind = response1.wind.speed + ` MPH`;

    $("#city-name").text(cityText);
    $("#city-temperature").text(temp);
    $("#city-humidity").text(hum);
    $("#city-wind-speed").text(wind);
  }

  function processUV(coordinatesLon, coordinatesLat) {
    $("#city-uv-index").attr("class", "alert");
    var uvURL =
      "https://api.openweathermap.org/data/2.5/uvi/forecast?&appid=" +
      myapi +
      "&lat=" +
      coordinatesLat +
      "&lon=" +
      coordinatesLon +
      "&cnt=1";

    $.ajax({
      url: uvURL,
      method: "GET",
      dataType: "json",
    }).then(function (response) {
      var uv = response[0].value;
      if (uv <= 2) {
        $("#city-uv-index").addClass("alert-success");
      } else if (uv <= 5) {
        $("#city-uv-index").addClass("alert-primary");
      } else if (uv <= 10) {
        $("#city-uv-index").addClass("alert-secondary");
      } else {
        $("#city-uv-index").addClass("alert-danger");
      }

      $("#city-uv-index").text(uv);
    });
  }

  function processFiveDay(myCity) {
    var clearCards = $("#card-div").empty();
    var forecastUrl =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      myCity +
      "&units=imperial&appid=" +
      myapi;
    $.ajax({
      url: forecastUrl,
      method: "GET",
      dataType: "json",
    }).then(function (response) {
      for (var i = 0; i < response.list.length; i++) {
        var block = response.list[i];

        console.log(block);
        var time = block.dt_txt;
        var mid = moment(time).format("HH:mm");
        var day = moment(time).format("MM/DD/YYYY");
        var rawDayTemp = block.main.temp;
        var dayTemp = rawDayTemp.toFixed(0) + `°`;
        var dayHumid = block.main.humidity + `%`;
        var iconCode = block.weather[0].icon + `.png`;
        if (mid === "21:00") {
          $("#card-div").append(
            `<div class="card text-white bg-info"><div class="card-body"><h5 class="card-title">${day}</h5><img src="https://openweathermap.org/img/wn/${iconCode}" alt=""/><p class="card-text">Temp: ${dayTemp}</p><p class="card-text">Humidity: ${dayHumid}</div></div></div>`
          );
        }
      }
    });
  }
  $("#city-search").val("");
}

$("#cities-searched").on("click", "li", function () {
  $("#city-search").empty();
  var dis = this;
  var researchCity = dis.innerText;
  $("#city-search ").val(researchCity);
  getWeather();
});
