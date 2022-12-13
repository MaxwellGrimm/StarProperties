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


let weatherBlock = document.getElementById("weather-block");
window.addEventListener('load', async () => {
    console.log('loaded Page');
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '7e6ff2ddcfmsh4529807f230e281p176c6djsn5af7d489ba14',
            'X-RapidAPI-Host': 'dark-sky.p.rapidapi.com'
        }
    };
    
    await fetch('https://dark-sky.p.rapidapi.com/44.028410,-88.542440?units=auto&lang=en', options)
        .then(response => response.json())
        .then(data => {console.log(data);
            weatherBlock.innerHTML = 'The current temperature outside our office is: ' + data.currently.temperature + 'F';
        
        })
        .catch(err => console.error(err));
});
 

    


// Initialize and add the map
function initMap() {
    // The location of Uluru
    const uluru = { lat: 44.028410, lng: -88.542440 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 16,
      center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });
  }
  
  window.initMap = initMap;