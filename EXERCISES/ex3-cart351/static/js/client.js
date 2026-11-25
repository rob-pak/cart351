/* PLEASE DO NOT CHANGE THIS FRAMEWORK ....
the get requests are all implemented and working ...
so there is no need to alter ANY of the existing code:
rather you just ADD your own ... */

window.onload = function () {
  document.querySelector("#queryChoice").selectedIndex = 0;
  //create once :)
  let description = document.querySelector("#Ex4_title");
  //array to hold the dataPoints
  let dataPoints = [];

  // /**** GeT THE DATA initially :: default view *******/
  // /*** no need to change this one  **/
  runQueryDefault("onload");

  /***** Get the data from drop down selection ****/
  let querySelectDropDown = document.querySelector("#queryChoice");

  querySelectDropDown.onchange = function () {
    console.log(this.value);
    let copyVal = this.value;
    console.log(copyVal);
    runQuery(copyVal);
  };

  /******************* RUN QUERY***************************  */
  async function runQuery(queryPath) {
    // // //build the url -end point
    const url = `/${queryPath}`;
    try {
      let res = await fetch(url);
      let resJSON = await res.json();
      console.log(resJSON);

      //reset the
      document.querySelector("#childOne").innerHTML = "";
      description.textContent = "";
      document.querySelector("#parent-wrapper").style.background =
        "rgba(51,102,255,.2)";

      switch (queryPath) {
        case "default": {
          displayAsDefault(resJSON);
          break;
        }
        case "one": {
          //sabine done
          displayInCirclularPattern(resJSON);
          break;
        }
        case "two": {
          //sabine done
          displayByGroups(resJSON, "weather", "eventName");
          break;
        }
        /***** TO DO FOR EXERCISE 4 *************************
         ** 1: Once you have implemented the mongodb query in server.py,
         ** you will receive it from the get request (THE FETCH HAS ALREADY BEEN IMPLEMENTED:: SEE ABOVE)
         ** and will automatically will enter into the correct select case
         **  - based on the value that the user chose from the drop down list...)
         ** You need to design and call a custom display function FOR EACH query that you construct ...
         ** 4 queries - I want 4 UNIQUE display functions - you can use the ones I created
         ** as inspiration ONLY - DO NOT just copy and change colors ... experiment, explore, change ...
         ** you can create your own custom objects - but NO images, video or sound... (will get 0).
         ** bonus: if your visualizations(s) are interactive or animate.
         ****/
        case "three": {
          console.log("three")
          // TODO
          displayThree(resJSON);
          break;
        }
        case "four": {
          console.log("four")
          // TODO
          displayFour(resJSON);
          break;
        }

        case "five": {
          console.log("five")
          // TODO
          displayFive(resJSON);
          break;
        }
        case "six": {
          console.log("six")
          // TODO
          displaySix(resJSON);
          break;
        }
        default: {
          console.log("default case");
          break;
        }
      } //switch
    } catch (err) {
      console.log(err);
    }
  }
  //will make a get request for the data ...

  /******************* RUN DEFAULT QUERY***************************  */
  async function runQueryDefault(queryPath) {
    // // //build the url -end point
    const url = `/${queryPath}`;
    try {
      let res = await fetch(url);
      let resJSON = await res.json();
      console.log(resJSON);
      displayAsDefault(resJSON);
    } catch (err) {
      console.log(err);
    }
  }
  /*******************DISPLAY AS GROUP****************************/

  function displayByGroups(resultObj, propOne, propTwo) {
    dataPoints = [];
    let finalHeight = 0;
    //order by WEATHER and Have the event names as the color  ....

    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(51, 153, 102,1)";
    description.textContent = "BY WEATHER AND ALSO HAVE EVENT NAMES {COLOR}";
    description.style.color = "rgb(179, 230, 204)";

    let coloredEvents = {};
    let resultSet = resultObj.results;

    //reget
    let possibleEvents = resultObj.events;
    let possibleColors = [
      "rgb(198, 236, 217)",
      "rgb(179, 230, 204)",
      "rgb(159, 223, 190)",
      "rgb(140, 217, 177)",
      "rgb(121, 210, 164)",
      "rgb(102, 204, 151)",
      "rgb(83, 198, 138)",
      "rgb(64, 191, 125)",
      "rgb(255, 204, 179)",
      "rgb(255, 170, 128)",
      "rgb(255, 153, 102)",
      "rgb(255, 136, 77)",
      "rgb(255, 119, 51)",
      "rgb(255, 102, 26)",
      "rgb(255, 85, 0)",
      "rgb(230, 77, 0)",
      "rgb(204, 68, 0)",
    ];

    for (let i = 0; i < possibleColors.length; i++) {
      coloredEvents[possibleEvents[i]] = possibleColors[i];
    }

    let offsetX = 20;
    let offsetY = 150;
    // find the weather of the first one ...
    let currentGroup = resultSet[0][propOne];
    console.log(currentGroup);
    let xPos = offsetX;
    let yPos = offsetY;

    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].event_name,
          //map to the EVENT ...
          coloredEvents[resultSet[i].event_name],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point_two"
        )
      );

      /** check if we have changed group ***/
      if (resultSet[i][propOne] !== currentGroup) {
        //update
        currentGroup = resultSet[i][propOne];
        offsetX += 150;
        offsetY = 150;
        xPos = offsetX;
        yPos = offsetY;
      }
      // if not just keep on....
      else {
        if (i % 10 === 0 && i !== 0) {
          xPos = offsetX;
          yPos = yPos + 15;
        } else {
          xPos = xPos + 15;
        }
      } //end outer else

      dataPoints[i].update(xPos, yPos);
      finalHeight = yPos;
    } //for

    document.querySelector("#childOne").style.height = `${finalHeight + 20}px`;
  } //function

  /*****************DISPLAY IN CIRCUlAR PATTERN:: <ONE>******************************/
  function displayInCirclularPattern(resultOBj) {
    //reset
    dataPoints = [];
    let xPos = 0;
    let yPos = 0;
    //for circle drawing
    let angle = 0;
    let centerX = window.innerWidth / 2;
    let centerY = 350;

    let scalar = 300;
    let yHeight = Math.cos(angle) * scalar + centerY;

    let resultSet = resultOBj.results;
    let coloredMoods = {};

    let possibleMoods = resultOBj.moods;
    let possibleColors = [
      "rgba(0, 64, 255,.5)",
      "rgba(26, 83, 255,.5)",
      "rgba(51, 102, 255,.7)",
      "rgba(51, 102, 255,.4)",
      "rgba(77, 121,255,.6)",
      "rgba(102, 140, 255,.6)",
      "rgba(128, 159, 255,.4)",
      "rgba(153, 179, 255,.3)",
      "rgba(179, 198, 255,.6)",
      "rgba(204, 217, 255,.4)",
    ];

    for (let i = 0; i < possibleMoods.length; i++) {
      coloredMoods[possibleMoods[i]] = possibleColors[i];
    }

    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(0, 26, 102,1)";
    description.textContent = "BY AFTER MOOD";
    description.style.color = "rgba(0, 64, 255,.5)";

    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].event_name,
          //map to the day ...
          coloredMoods[resultSet[i].after_mood],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point_two"
        )
      );
      /*** circle drawing ***/
      xPos = Math.sin(angle) * scalar + centerX;
      yPos = Math.cos(angle) * scalar + centerY;
      angle += 0.13;

      if (angle > 2 * Math.PI) {
        angle = 0;
        scalar -= 20;
      }
      dataPoints[i].update(xPos, yPos);
    } //for

    document.querySelector("#childOne").style.height = `${yHeight}px`;
  } //function

  /*****************DISPLAY AS DEFAULT GRID :: AT ONLOAD ******************************/
  function displayAsDefault(resultOBj) {
    //reset
    dataPoints = [];
    let xPos = 0;
    let yPos = 0;
    const NUM_COLS = 50;
    const CELL_SIZE = 20;
    let coloredDays = {};
    let resultSet = resultOBj.results;
    possibleDays = resultOBj.days;
    /*
  1: get the array of days (the second entry in the resultOBj)
  2: for each possible day (7)  - create a key value pair -> day: color and put in the
  coloredDays object
  */
    console.log(possibleDays);
    let possibleColors = [
      "rgb(255, 102, 153)",
      "rgb(255, 77, 136)",
      "rgb(255, 51, 119)",
      "rgb(255, 26, 102)",
      "rgb(255, 0, 85)",
      "rgb(255, 0, 85)",
      "rgb(255, 0, 85)",
    ];

    for (let i = 0; i < possibleDays.length; i++) {
      coloredDays[possibleDays[i]] = possibleColors[i];
    }
/* for through each result
1: create a new MyDataPoint object and pass the properties from the db result entry to the object constructor
2: set the color using the coloredDays object associated with the resultSet[i].day
3:  put into the dataPoints array.
**/
    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(255,0,0,.4)";
    description.textContent = "DEfAULT CASE";
    description.style.color = "rgb(255, 0, 85)";

    //last  element is the helper array...
    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].evnet_name,
          //map to the day ...
          coloredDays[resultSet[i].day],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point"
        )
      );

      /** this code is rather brittle - but does the job for now .. draw a grid of data points ..
//*** drawing a grid ****/
      if (i % NUM_COLS === 0) {
        //reset x and inc y (go to next row)
        xPos = 0;
        yPos += CELL_SIZE;
      } else {
        //just move along in the column
        xPos += CELL_SIZE;
      }
      //update the position of the data point...
      dataPoints[i].update(xPos, yPos);
    } //for
    document.querySelector("#childOne").style.height = `${yPos + CELL_SIZE}px`;
  } //function

  /***********************************************/
  function displayThree(resultObj) {
    // bunch of styling rules for #childOne
    const parent_container = document.querySelector("#childOne");
    parent_container.innerHTML = "";
    parent_container.style.height = "70vh";
    parent_container.style.width = "unset";
    parent_container.style.margin = "0";
    parent_container.style.padding = "3rem";
    parent_container.style.display = "grid";
    parent_container.style.gap = "0.5rem";
    // css wizardry i found online, columns will auto adjust, with min width of 20px
    // might have been a google AI answer, i forgot
    parent_container.style.gridTemplateColumns = "repeat(auto-fit, minmax(min(20px, 100%), 1fr))";


    // background color + description
    const parent_wrapper = document.querySelector("#parent-wrapper");
    parent_wrapper.style.backgroundColor = "#03045e";
    description.textContent = "Positive after moods + strength";
    description.style.color = "#fff";

    // data
    const results = resultObj.results;
    const positive_moods = resultObj.positive_moods;

    const colors = [
      "#0077b6",
      "#00b4d8",
      "#90e0ef",
      "#caf0f8",
      "#023e8a",
    ]

    const colors_by_mood = {};
    // assign moods to colors
    for (let i = 0; i < positive_moods.length; i++) {
      colors_by_mood[positive_moods[i]] = colors[i];
    }

    // these were originally circles, oops
    const circles = [];
    results.forEach(r => {
      circles.push({ mood: r.after_mood, strength: r.after_mood_strength });
    });

    circles.forEach(circle => {
      // add elements to parent, height depends on after mood strength
      const circle_el = document.createElement("div");
      circle_el.style.width = `100%`;
      circle_el.style.height = `${circle.strength * 10}%`;
      circle_el.style.backgroundColor = colors_by_mood[circle.mood];
      circle_el.classList.add("translate-up");
      parent_container.appendChild(circle_el);
    })
  }

  function displayFour(resultObj) {
    // styling for container
    const parent_container = document.querySelector("#childOne");
    parent_container.innerHTML = "";
    parent_container.style.height = "unset";
    parent_container.style.width = "unset";
    parent_container.style.margin = "0";
    parent_container.style.padding = "3rem";
    parent_container.style.display = "grid";
    parent_container.style.gridTemplateColumns = "repeat(8, 1fr)";
    parent_container.style.gap = "0.25rem";

    // background + description
    const parent_wrapper = document.querySelector("#parent-wrapper");
    parent_wrapper.style.backgroundColor = "#333";
    description.textContent = "Data sorted by event";
    description.style.color = "#fff";

    const colors = [
      "#59bbcf",
      "#59aacf",
      "#5999cf",
      "#5988cf",
      "#5976cf",
      "#5965cf",
      "#5e59cf",
      "#6f59cf",
      "#8059cf",
      "#9159cf",
      "#a359cf",
      "#b459cf",
      "#c559cf",
      "#cf59c7",
      "#cf59b6",
      "#cf59a5",
      "#cf5994",
    ]

    // data
    const results = resultObj.results;
    const events = resultObj.events;

    // assign events to colors
    const colors_by_event = {};
    for (let i = 0; i < events.length; i++) {
      colors_by_event[events[i]] = colors[i];
    }

    // create bar objects
    const bars = [];
    results.forEach(r => {
      bars.push({ event: r.event_name });
    });

    // draw each bar, color depends on event
    bars.forEach(bar => {
      const bar_el = document.createElement("div");
      bar_el.style.width = `100%`;
      bar_el.style.height = `20px`;
      bar_el.style.backgroundColor = colors_by_event[bar.event];
      bar_el.classList.add("rotate");
      parent_container.appendChild(bar_el);
    })
  }

  function displayFive(resultObj) {
    // container styling
    const parent_container = document.querySelector("#childOne");
    parent_container.innerHTML = "";
    parent_container.style.height = "600px";
    parent_container.style.width = "unset";
    parent_container.style.margin = "0";
    parent_container.style.padding = "3rem";
    parent_container.style.position = "relative";

    // background + description
    const parent_wrapper = document.querySelector("#parent-wrapper");
    parent_wrapper.style.backgroundColor = "#0000ff";
    description.textContent = "Mondays & Wednesdays, speed and amplitude scaled by 'Event Affect Strength'";
    description.style.color = "#fff";

    // data + colors
    const results = resultObj.results;
    const colors = [
      "#fff",
      "#000"
    ];
    const days = ["Monday", "Wednesday"];
    // assign days to colors
    const colors_by_day = {};
    for (let i = 0; i < days.length; i++) {
      colors_by_day[days[i]] = colors[i];
    }

    const circles = [];
    // since these are absolute positions, i need to keep track of columns/rows so i can calculate the circles positions.
    let row_count = 0;
    let column_count = 0;
    const radius = 20;
    // margin
    const offset = { x: 100, y: 100 };
    results.forEach(result => {
      circles.push({
        day: result.day,
        affect_strength: result.event_affect_strength,
        radius: radius,
        x: column_count * radius * 2 + offset.x,
        y: row_count * radius * 2 + offset.y
      });
      column_count++;
      // add row after 30 cols and reset col count
      if (column_count == 30) {
        row_count++;
        column_count = 0;
      }
    })
    circles.forEach(circle => {
      // draw each circle
      const circle_el = document.createElement("div");
      circle_el.style.position = "absolute";
      circle_el.style.left = `${circle.x}px`;
      circle_el.style.top = `${circle.y}px`;
      circle_el.style.width = `${circle.radius * 2}px`;
      circle_el.style.height = `${circle.radius * 2}px`;
      circle_el.style.borderRadius = "999px";
      circle_el.style.backgroundColor = colors_by_day[circle.day];
      // save the element to animate it later
      circle.el = circle_el;
      parent_container.appendChild(circle_el);
    })


    const amplitude = 15;
    const speed = 0.002;
    const waveLength = 0.3;
    function animate(time) {
      // translate each circle with a sin function, speed and amplitude are scaled by the event affect strength (possible scale values are 1.1, 1.2, 1.3 ... up to 2)
        circles.forEach(circle => {
            const offset = Math.sin(time * (speed * (1 + circle.affect_strength/10)) + circle.x * waveLength / circle.radius) * (amplitude * (1 + circle.affect_strength / 10));
            circle.el.style.transform = `translateY(${offset}px)`;
        });
        requestAnimationFrame(animate);
    }
    // start the animation loop
    requestAnimationFrame(animate);
  }

  function displaySix(resultObj) {
    // container styling
    const parent_container = document.querySelector("#childOne");
    parent_container.innerHTML = "";
    parent_container.style.height = "unset";
    parent_container.style.width = "unset";
    parent_container.style.margin = "0";
    parent_container.style.padding = "3rem";
    parent_container.style.display = "grid";
    parent_container.style.gridTemplateColumns = "repeat(39, 1fr)";

    // background + description
    const parent_wrapper = document.querySelector("#parent-wrapper");
    parent_wrapper.style.backgroundColor = "#121829";
    description.textContent = "Bad days sorted by weather, scaled by 'event affect strength'";
    description.style.color = "#fff";

    // data
    const results = resultObj.results;
    const weather = resultObj.weather.sort();

    const colors = [
      '#4cbff0',  // clear
      '#9cb8d3',  // cloudy
      '#c2c8e0',  // fog
      '#7486aa',  // grey
      '#246dcc',  // raining
      '#cbeaf6',  // snowing
      '#3a307e',  // stormy
      '#fac038',  // sunny
    ];
    // assign colors to weather types
    const colors_by_weather = {};
    for (let i = 0; i < weather.length; i++) {
      colors_by_weather[weather[i]] = colors[i];
    }

    // create horizontal bars
    const bars = [];
    results.forEach(result => {
      bars.push({ weather: result.weather, event_affect_strength: result.event_affect_strength, height: 15 });
    });

    // draw each bar, height is scaled by event_affect_strength.
    bars.forEach(bar => {
      const bar_el = document.createElement("div");
      bar_el.style.width = `100%`;
      bar_el.style.height = `${bar.height * 2 * (1 + bar.event_affect_strength / 10)}px`;
      bar_el.style.transformOrigin = "center";
      bar_el.style.backgroundColor = colors_by_weather[bar.weather];
      bar.el = bar_el;
      parent_container.appendChild(bar_el);
    });

    // similar to FIVE function, but i scale the bars instead of translate
    function animate(time) {
      bars.forEach(bar => {
          // the bigger the affect strength, the faster it scales (i think, that was the plan at least)
          const offset = Math.sin(time / 1000 * (1 + bar.event_affect_strength / 10));
          // normalize values between 0 and 1
          bar.el.style.transform = `scale(${(offset + 1) / 2})`;
        });
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
};
