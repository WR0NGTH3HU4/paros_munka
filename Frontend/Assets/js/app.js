const AppTitle = "Online Szakácskönyv";
const Appversion = "v1.0";
const Author = "Kulimák Máté és Tátrai Dominik Oszkár";
const Company = "Bajai SZC Türr István Technikum";

loggedUser = null;

const serverUrl = 'http://localhost:3000';

let title = document.querySelector('title');
let header = document.querySelector('header');
let footer = document.querySelector('footer');

title.innerHTML = AppTitle + ' ' + Appversion;
header.innerHTML;
footer.innerHTML = Company + ' | ' + Author + ' | 2024.';

async function render(view){
    let main = document.querySelector('main');
    main.innerHTML = await (await fetch(`Views/${view}.html`)).text();
    header.innerHTML = String(view);

    switch(view){
        case 'profile': {
            getMe();
            break;
        }
        case 'users': {
            getUsers();
            break;
        }
        case 'steps': {
            getStepDatas();
            break;
        }
        case 'statistics': {
            getUserStats();
            getAdminStats(); // feltételhez kell kötni! hogy admin-e a bejelentkezett user
            break;
        }
    }
}

if (localStorage.getItem('szakacskonyv')){
    loggedUser = JSON.parse(localStorage.getItem('szakacskonyv'));
    render('Főoldal');
}else{
    render('Bejelentkezés');
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
        render('Főoldal');
    }
});