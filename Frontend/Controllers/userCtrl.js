function registration(){
    console.log('Belépett');
    let newUser = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        passwd: document.querySelector('#passwd').value,
        confirm: document.querySelector('#confirm').value,
        telefon: document.querySelector('#telefon').value
    }

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
        console.log("Ide belepett!");
        if (res.status != 200){
            alert(res.data);
            return;
        }

        loggedUser = res.data;
        localStorage.setItem('szakacskonyv', JSON.stringify(loggedUser));
        render('Főoldal');
    });
}

function logout(){
    localStorage.removeItem('szakacskonyv');
    loggedUser = null;
    renderNavItems();
    render('Főoldal');
}