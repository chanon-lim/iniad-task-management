// Sidebar to navbar (Responsive)
let btn = document.querySelector("#collapse-btn");
let navbar = document.querySelector(".mobile-nav");
let content = document.querySelector(".content");

btn.onclick = function () {
  navbar.classList.toggle("active");
  content.classList.toggle("active");
}

function openForm(){
  document.getElementById("requestFormBox").classList.add("active");
}

function closeForm(){
  document.getElementById("requestFormBox").classList.remove("active");
}

function seeRequest(){
  document.getElementById("yourMsg").classList.add("active");
}

function closeMsg(){
  document.getElementById("yourMsg").classList.remove("active");
}