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