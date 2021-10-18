let btn = document.querySelector("#collapse-btn");
let navbar = document.querySelector(".mobile-nav");
let content = document.querySelector(".content");

btn.onclick = function() {
    navbar.classList.toggle("active");
    content.classList.toggle("active");
}


function openPage(pageName, elmnt, color) {
    var tabcontent = document.getElementsByClassName("mytabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        // alert('This part fires'); //ok run
        tabcontent[i].style.display = "none";
    }

    var links = document.getElementsByClassName("links");
    for (i = 0; i < links.length; i++) {
        links[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}