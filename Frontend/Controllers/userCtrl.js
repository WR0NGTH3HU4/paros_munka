function registration() {
    let newUser = {
        name: document.querySelector('#name').value,
        passwd: document.querySelector('#passwd').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#telefon').value,
        confirm: document.querySelector('#confirm').value
    }

    console.log(newUser); // Ellenőrizd, hogy ez megjelenik-e a konzolban
    axios.post(`${serverUrl}/reg`, newUser).then(res => {
        alert(res.data);
    });
}


function login(){
    let user = {
        email: document.querySelector('#email').value,
        password: document.querySelector('#passwd').value
    }
    console.log(user);

    axios.post(`${serverUrl}/login`, user).then(res =>{
        if (res.status != 202){
            alert(res.data);
            return;
        }

        loggedUser = res.data;
        localStorage.setItem('szakacskonyv', JSON.stringify(loggedUser));
        render('Receptek');
    });
}

function logout(){
    localStorage.removeItem('szakacskonyv');
    loggedUser = null;
    renderNavItems();
    render('Fooldal');
}


function updatePassword(){
    
    let data = {
        oldpass: document.querySelector('#oldpass').value,
        newpass: document.querySelector('#newpass').value,
        confirm: document.querySelector('#confirm').value
    }

    axios.patch(`${serverUrl}/passmod/${loggedUser[0].ID}`, data, authorize()).then(res => {
        alert(res.data);

        if (res.status == 200){
            document.querySelector('#oldpass').value = "";
            document.querySelector('#newpass').value = "";
            document.querySelector('#confirm').value = "";
        }
    });
}

function getMe(){
    axios.get(`${serverUrl}/me/${loggedUser[0].ID}`, authorize()).then(res =>{
        console.log(res.data[0].name)
    });
}