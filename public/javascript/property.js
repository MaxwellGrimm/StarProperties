let hamburger = document.getElementById('hamburgerMenue');

let div = document.getElementsByTagName('div');


hamburger.addEventListener('click', () =>{
    let nav = document.querySelector('nav');
    if(nav.classList.contains('show')){
        nav.classList.remove('show');
        hamburger.src = 'images/hamburgerMenue.png';
    }
    else{
       nav.classList.add('show'); 
       hamburger.src = 'images/xicon.png';
    }
});

for(let i = 0; i < div.length; i++){
    div[i].addEventListener('click', ()=>{
        let nav = document.querySelector('nav');
        if(nav.classList.contains('show')){
            nav.classList.remove('show');
            hamburger.src = 'images/hamburgerMenue.png';
        }
    });
}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}