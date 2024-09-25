const AppTitle = "Online Szakácskönyv";
const Appversion = "v1.0";
const Author = "Kulimák Máté és Tátrai Dominik Oszkár";
const Company = "Bajai SZC Türr István Technikum";

loggedUser = null;

const serverUrl = 'http://localhost:3000';

let title = document.querySelector('title');
let PageTitle = document.querySelector('#PageTitle');

title.innerHTML = AppTitle + ' ' + Appversion;
PageTitle.innerHTML;
async function render(view){
    let main = document.querySelector('#main');
    main.innerHTML = await (await fetch(`Views/${view}.html`)).text();    

    switch(view){
        case 'Bejelentkezes': {
            PageTitle.innerHTML = "Bejelentkezés";
            break;
        }
        case 'Regisztracio': {
            PageTitle.innerHTML = "Regisztráció";
            break;
        }
        case 'Fooldal': {
            PageTitle.innerHTML = "Mr.Black & Mr.Blacker online szakács könyv";
            break;
        }
        case 'Receptek': {
            getRecipes();
            PageTitle.innerHTML = "Receptek";
            break;
        }
        case 'Feltoltes': {
            pushRecipes();
            PageTitle.innerHTML = "Tölts fel recepteket";
            break;
        }
    }
}

if (localStorage.getItem('szakacskonyv')){
    loggedUser = JSON.parse(localStorage.getItem('szakacskonyv'));
    render('Fooldal');
}else{
    render('Bejelentkezes');
}

function renderNavItems(){
    let lgdOutNavItems = document.querySelectorAll('.lgdOut');
    let lgdInNavItems = document.querySelectorAll('.lgdIn');
    let admNavItems = document.querySelectorAll('.lgdAdm');

    // ha nem vagyunk bejelentkezve
    if (loggedUser == null){
        lgdInNavItems.forEach(item =>{
            item.classList.add('d-none');
        });
        lgdOutNavItems.forEach(item => {
            item.classList.remove('d-none');
        });
        admNavItems.forEach(item => {
            item.classList.add('d-none');
        });
        return;
    }
    // admin vagyunk
    if (loggedUser.role == 'admin'){
        admNavItems.forEach(item => {
            item.classList.remove('d-none');
        });
    }
 
    // user vagyunk
    lgdInNavItems.forEach(item => {
        item.classList.remove('d-none');
    });

    lgdOutNavItems.forEach(item => {
        item.classList.add('d-none');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof render === 'function') {
        render('Fooldal');
    }
});