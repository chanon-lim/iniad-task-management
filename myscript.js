let btn = document.querySelector("#collapse-btn");
let navbar = document.querySelector(".mobile-nav");
let content = document.querySelector(".content");

btn.onclick = function() {
    navbar.classList.toggle("active");
    content.classList.toggle("active");
}