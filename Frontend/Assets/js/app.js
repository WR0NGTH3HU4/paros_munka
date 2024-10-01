const AppTitle = "Online Szakácskönyv";
const Appversion = "v1.0";
const Author = "Kulimák Máté és Tátrai Dominik Oszkár";
const Company = "Bajai SZC Türr István Technikum";
const pic = document.querySelector('.pic');
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
            pic.classList.add('pic');
            break;
        }
        case 'Regisztracio': {
            PageTitle.innerHTML = "Regisztráció";
            pic.classList.add('pic');
            break;
        }
        case 'Fooldal': {
            PageTitle.innerHTML = "Mr.Black & Mr.Blacker online szakács könyv";
            pic.classList.add('pic');
            break;
        }
        case 'Receptek': {
            getRecipes();
            PageTitle.innerHTML = "Receptek";

            pic.classList.remove('pic');

            break;
        }
        case 'Feltoltes': {
            getMe();
            getCategory();
            pic.classList.add('pic');
            PageTitle.innerHTML = "Tölts fel recepteket";
            break;
        }
        case 'Email': {
            PageTitle.innerHTML = "E-mail cím megváltoztatása";
            pic.classList.add('pic');
            break;
        }
        case 'Password':{
            PageTitle.innerHTML = "Jelszó megváltoztatása";
            pic.classList.add('pic');
            break;
        }
        case 'admin':{
            PageTitle.innerHTML = "Admin felület";
            pic.classList.add('pic');
            break;
        }
        case 'Profil':{
            PageTitle.innerHTML = "Profil";
            pic.classList.add('pic');
            break;
        }
        case 'Felhasznalok':{
            getUsers();
            PageTitle.innerHTML = "Profil";
            break;
        }
    }

    let lgdOutNavItems = document.querySelectorAll('.lgdOut');
    let lgdInNavItems = document.querySelectorAll('.lgdIn');
    let admlgdInNavItems = document.querySelector('.admlgdIn');

    // Admin fül elrejtése alapértelmezetten
    admlgdInNavItems.classList.add('hidden');

    if (loggedUser == null) {
        lgdInNavItems.forEach(item => {
            item.classList.add('hidden');
        });
        lgdOutNavItems.forEach(item => {
            item.classList.remove('hidden');
        });
        return;
    }

    lgdInNavItems.forEach(item => {
        item.classList.remove('hidden');
    });

    lgdOutNavItems.forEach(item => {
        item.classList.add('hidden');
    });

    // Ellenőrizzük, hogy a felhasználó admin-e
    if (loggedUser[0].role === 'admin') {
        admlgdInNavItems.classList.remove('hidden'); // Admin fül megjelenítése
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

function authorize() {
    return {
        headers: {
            "Authorization": `Bearer ${loggedUser[0].ID}`  
        }
    };
}