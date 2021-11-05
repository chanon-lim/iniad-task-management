// Sidebar to navbar (Responsive)
let btn = document.querySelector("#collapse-btn");
let navbar = document.querySelector(".mobile-nav");
let content = document.querySelector(".content");

btn.onclick = function () {
    navbar.classList.toggle("active");
    content.classList.toggle("active");
}

// Date for today tab
let today = new Date();
let date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
document.querySelector(".today-date").innerHTML = date;

// Datepicker
$(function () {
    $("#id_date").datepicker({
        dateFormat: 'yy/mm/dd',
        changeMonth: true,
        changeYear: true,
    });
});

// Timepicker
$('#id_time').timepicki({
    show_meridian: false,
    start_time: ["00", "00"],
    max_hour_value: 23
});

// Calendar
document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
        businessHours: true,
        dayMaxEvents: true,
        themeSystem: 'bootstrap',
        height: 400,
        // dateClick: function (info) {
        //     alert('Clicked on: ' + info.dateStr);
        //     alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        //     alert('Current view: ' + info.view.type);
        //     // change the day's background color just for fun
        //     // info.dayEl.style.backgroundColor = 'red';
        // }
    });
    calendar.render();
});

class CalendarEvent {
    constructor(title, content, tag, notifyTime) {
        this.title = title;
        this.content = content;
        this.tag = tag;
        this.notifyTime = notifyTime;
    }

    getNotifyTime() {
        /**
         * Return the this.notifyTime
         */
        return this.notifyTime;
    }

    getTitle() {
        return this.title;
    }

    getContent() {
        return this.content;
    }

    getTag() {
        return this.tag;
    }
}

let eventFlow = []; //max 20 next event
let monthData = {}; // this moment for this year only, key is month ID year%month eg 2021%5
let dayData = {}; // this moment for this year only, key is day ID year%month%day eg 2021%10%19
let tagData = {}; // key is tag name, the event is sorted

let timeoutID; // ID for waiting for the event
let nextEvent; //next notified event, make this global is a bad programming behaviour, should use class

/**Pop up the input box */
function openPopup() {
    //alert("fired");
    // let inputField = document.getElementsByClassName("my-input-field");
    // for (let field of inputField) {
    //     field.value = "";
    // }
    document.getElementById("mycreateEventBox").classList.add("active");
}

/**Close the input box and clear all the input in
 * Note: even not clear each field -> still auto delete
*/
function onClose() {
    let createEventBox = document.getElementById("mycreateEventBox");
    let inputField = document.getElementsByClassName("my-input-field");

    createEventBox.classList.remove("active");
    for (let field of inputField) {
        field.value = "";
    }
}

/**Get the input data from user, return array in form [Title, date, time, content, tag]*/
function getInputData() {
    let inputField = document.getElementsByClassName("my-input-field");
    let result = [];
    for (let field of inputField) {
        console.log('Type of data: ', typeof(field.value));
        result.push(field.value);
    }
    return result
}

/**Make float notification */
function notifyEvent() {
    let title = nextEvent.getTitle();
    let message = nextEvent.getContent();
    var notification = new Notification(title, {
        body: message,
        icon: "static/images/clock_icon.png"
    });
    run();
}

/**This method return the color will be display of event title banner in Event Flow
 * The color depends on the urgency of event
 * if 1 day left -> red
 * if 1 < ... < 3 -> yellow
 * else green
*/
function setEventTitleBannerColor(eventObj) {
    let now = new Date();
    let eventNotifyTime = eventObj.getNotifyTime();
    if ((eventNotifyTime - now) < 1*24*60*60*1000) {
        //less than 1 day
        return "red";
    }
    else if ((eventNotifyTime - now) < 3*24*60*60*1000) {
        // more than 1 day but less than 3 days
        return "yellow";
    }
    else {
        return "green"
    }
}

/**This method create event title in event flow 
 * eventObj is the CalendarEvent object
 * use that to get the data for event title
*/
function createEventTitle(eventObj) {
    // alert("fired!")
    let title = eventObj.getTitle();
    let content = eventObj.getContent();
    let deadline = eventObj.getNotifyTime();

    let eventFlowPane = document.getElementById("event-flow");

    let divCard = document.createElement("div");
    // divCardBody contains Title, due, ...
    let divCardBody = document.createElement("div");
    let eventTitleBannerColor = setEventTitleBannerColor(eventObj);

    // Create heading for event card
    let heading = document.createElement("h5");
    let headtext = document.createTextNode(title);
    heading.classList.add("card-title");
    heading.appendChild(headtext);

    // Create deadline for event card
    let deadlineSection = document.createElement("h6");
    let deadlineMonth = deadline.getMonth() + 1;
    let deadlineDate = deadline.getDate();
    let deadlineHours = deadline.getHours();
    let deadlineMins = deadline.getMinutes();
    let deadlineDisplay = deadlineMonth + "/" + deadlineDate + " " + deadlineHours + ":" + deadlineMins;
    let deadlineText = document.createTextNode(deadlineDisplay);
    deadlineSection.classList.add("card-subtitle");
    deadlineSection.appendChild(deadlineText);
    
    //Add style to event card
    divCard.classList.add("card", eventTitleBannerColor);
    divCard.appendChild(divCardBody);
    divCardBody.classList.add("card-body");
   
    divCardBody.appendChild(heading);
    divCardBody.appendChild(deadlineSection);


    eventFlowPane.appendChild(divCard);
}

function displayNoUpcomingEvent(parentElement) {
    // this is the <p> tag for display "There is no upcoming event" text
    let div = document.createElement("div");
    let img = document.createElement("i");
    let noUpcomingEvent = document.createElement("p");
    let text = document.createTextNode("There is no upcoming event!");
    
    div.classList.add("no-task");
    div.appendChild(img);
    div.appendChild(noUpcomingEvent);
    img.classList.add("fas", "fa-tasks");
    noUpcomingEvent.appendChild(text);

    parentElement.appendChild(div);
}

/**This method update the Event flow pane  
 * It will delete all current event in the Event Flow then create new Event title
*/
function updateEventFlow() {
    let eventFlowPane = document.getElementById("event-flow");
    let allEvent = eventFlowPane.childNodes;
    let allEventNumber = allEvent.length;
    console.log('Length of allEvent:', allEvent.length);
    console.log(allEvent); //0 if the first time
    // for (let event of allEvent) {
    //     eventFlowPane.removeChild(event);
    //     event.remove();
    // }
    if (allEventNumber === 0) {
        //do nothing
    }
    else {
    let firstEventTitle = eventFlowPane.firstElementChild;
    while (firstEventTitle) {
        firstEventTitle.remove();
        firstEventTitle = eventFlowPane.firstElementChild;
    }
    }
    for (let event of eventFlow) {
        createEventTitle(event);
    }
    // when there is no upcoming event, display "there is no upcoming event"
    if (eventFlow.length === 0) {
        displayNoUpcomingEvent(eventFlowPane);
    }
}

/**This function will create new Event and add that event to the store structure*/
function onSave() {
    let data = getInputData();
    // alert(data); //abc,abc,2021/10/23,0816,khan
    let title = data[0];
    let content = data[3];
    let tag = data[4];
    let datedata = data[1].split('/');
    console.log('datedata: ', datedata);
    console.log('type of datedata:', typeof(datedata));
    // alert(datedata); //2021,10,23
    let year = Number(datedata[0]);
    // alert(typeof(year)); //Number
    let month = Number(datedata[1]);
    let day = Number(datedata[2]);
    console.log('Time: ', data[3]);
    // The time format in form 23:15 -> need to slice the String
    let hour = Number(data[2].slice(0, 2));
    console.log('Hour', hour);
    let min = Number(data[2].slice(3, 5));
    console.log('Min: ', min);
    let eventdate = new Date(year, month-1, day, hour, min);
    // alert(year, month, day, hour, min);
    let event = new CalendarEvent(title, content, tag, eventdate);
    
    //now add to the data structure
    eventFlow.push(event);
    eventFlow.sort(function(a, b){return a.notifyTime - b.notifyTime});

    let monthID = String(year) + "@" + String(month);
    // alert(monthID); OK
    if (monthData.hasOwnProperty(monthID)) {
        monthData[monthID].push(event);
        monthData[monthID].sort(function(a, b){return a.notifyTime - b.notifyTime});
    }
    else {
        monthData[monthID] = [];
        monthData[monthID].push(event);
    }

    let dayID = String(year) + "@" + String(month) + '@' + String(day);
    // alert(monthID); OK
    if (dayData.hasOwnProperty(dayID)) {
        dayData[dayID].push(event);
        dayData[dayID].sort(function(a, b){return a.notifyTime - b.notifyTime});
    }
    else {
        dayData[dayID] = [];
        dayData[dayID].push(event);
    }

    let tagID = tag;
    // alert(monthID); OK
    if (tagData.hasOwnProperty(tagID)) {
        tagData[tagID].push(event);
        tagData[tagID].sort(function(a, b){return a.notifyTime - b.notifyTime});
    }
    else {
        tagData[tagID] = [];
        tagData[tagID].push(event);
    }
    // alert(dayData);
    // console.log(dayData);
    // let nextEvent = eventFlow[0];
    // let now = new Date();
    // let timeUntilNotify = (nextEvent.getNotifyTime() - now)/1000; //convert to sec
    // alert(now);
    // alert(nextEvent.getNotifyTime());
    // alert(timeUntilNotify);
    console.log('eventFlow: ', eventFlow);
    // This is a strange approach but it is worked at this moment.
    // Make a different input with submit function, and when click the button save -> trigger that submit button
    //alert('after send data!!');
    onClose(); //close the input box
    run();
}

/**The main process 
 * will check the next event and set reminder
*/
function run() {
    while (true) {
        if (eventFlow.length === 0) {
            updateEventFlow();
            break;
        }
        let now = new Date();
        nextEvent = eventFlow[0];
        let timeUntilNotify = (nextEvent.getNotifyTime() - now); 
        if (timeUntilNotify < 0) { //if the next event is passed -> pop that and move to next one
            eventFlow.shift();
        }
        else {
            //need delete old timeout
            clearTimeout(timeoutID);
            timeoutID = setTimeout(notifyEvent, timeUntilNotify);
            // alert(timeUntilNotify);
            updateEventFlow();
            break;
        }
    }
}
//run();

//the following code run the first time when the page load
//update the event flow pane

for (let eventData of firstTimeLoadDataJson) {
    console.log(eventData); //ok worked
    let title = eventData["fields"]["title"];
    let content = eventData["fields"]["content"];
    let tag = "";
    let deadline = eventData["fields"]["deadline"].split("T");
    let date = deadline[0];
    let time = deadline[1];
    time = time.slice(0, time.length-1); //to cut the last Z in time "11:00:00Z"
    time = time.split(":");
    date = date.split("-");
    let year = Number(date[0]);
    let month = Number(date[1]-1);
    let day = Number(date[2]);
    let hour = Number(time[0]);
    let min = Number(time[1]);
    let eventDate = new Date(year, month, day, hour, min);

    let event = new CalendarEvent(title, content, tag, eventDate);
    eventFlow.push(event);
    // console.log(deadline);
    // console.log(typeof(deadline));
    //console.log(deadline.split("T"));
    // console.log("time", time);
    // console.log(title) //ok worked
}
eventFlow.sort(function(a, b){return a.notifyTime - b.notifyTime});

// populate the event flow pane for the first time when page load
run();

/**This function run when the Save button clicked
 * will close the create event popup form
 * and send data to the server
 * This action actually click a hidden form button
 * this is a weird approach but now not have better solution
 */
function onSaveButtonClicked() {
    let submitTestBtn = document.getElementById("submitTestBtn");
    submitTestBtn.click();
}



//Test make AJAX POST request, when user press button 'Save' -> will send POST request to server and get back response
//test if this block work?
//console.log("{% url 'ajax' %}"); // result: /ajax/
// yes, this block work
$(".popup-form").submit(function (e) {
    e.preventDefault();
    var serializedData = $(this).serialize();
    console.log("Ajax function fired!");
    onSave();
    $.ajax({
        type: "POST",
        url: ajax_handle_url, //this url is variable from the template html
        data: serializedData,
        success: function (response) {
            console.log("Make the POST request successfully"); //yay, success
            console.log(response);
            console.log(typeof(response));
            let a = JSON.parse(response); //perfect solution!!!!, change the array string to array muahaha
            console.log(a);
        },
        error: function (response) {
            console.log("Fail in making POST request");
        }
    });
});
