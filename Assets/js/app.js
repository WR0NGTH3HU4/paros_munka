const AppTitle = "Online Szakácskönyv";
const Appversion = "v1.0";
const Author = "Kulimák Máté és Tátrai Dominik Oszkár";
const Company = "Bajai SZC Türr István Technikum";

const serverUrl = 'http://localhost:3000';

let title = document.querySelector('title');
let header = document.querySelector('header');
let footer = document.querySelector('footer');

title.innerHTML = AppTitle + ' ' + Appversion;
header.innerHTML = AppTitle;
footer.innerHTML = Company + ' | ' + Author + ' | 2024.';