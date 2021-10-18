window.onscroll = function(){Sticky()};

//Get the header
var header=doument.getElementById('pageHeader');

//Get the offset position of the navbar
var sticky=header.offsetTop

function Sticky(){
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
}
    