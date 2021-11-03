// Sidebar to navbar (Responsive)
let btn = document.querySelector("#collapse-btn");
let navbar = document.querySelector(".mobile-nav");
let content = document.querySelector(".content");

btn.onclick = function () {
  navbar.classList.toggle("active");
  content.classList.toggle("active");
}

// Scroll to Top Button
var scrollToTopBtn = document.querySelector("#scrollToTopBtn");

function scrollToTop() {
    // scroll to top logic
    document.documentElement.scrollTo({
        top: 0
    });
}

function handleScroll() {
    // Do something on scroll
    var scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (document.documentElement.scrollTop / scrollTotal > 0.2) {
        // Show button
        scrollToTopBtn.classList.add("showBtn");
    } else {
        // Hide button
        scrollToTopBtn.classList.remove("showBtn");
    }
}

scrollToTopBtn.addEventListener("click", scrollToTop);
document.addEventListener("scroll", handleScroll);