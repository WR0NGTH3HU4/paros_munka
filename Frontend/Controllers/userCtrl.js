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
        console.log(res.data[0].role)
        localStorage.setItem('szakacskonyv', JSON.stringify(loggedUser));
        if(res.data.role == "user"){
            render('Receptek');
            console.log(res.data[0].role)
        }
        else{
            render('admin');
        }

    });
}

function logout(){
    localStorage.removeItem('szakacskonyv');
    loggedUser = null;
    renderNavItems();
    render('Fooldal');
}


function updatePassword() {
    let data = {
        oldpass: document.querySelector('#oldpass').value,
        newpass: document.querySelector('#newpass').value,
        confirm: document.querySelector('#confirm').value
    };

    // Ellenőrizzük, hogy a bejelentkezett felhasználó ID-ja elérhető
    if (!loggedUser || !loggedUser[0]) {
        alert('Jelentkezz be a jelszó módosításához!');
        return;
    }

    // Axios PATCH kérés küldése
    axios.patch(`${serverUrl}/passmod/${loggedUser[0].ID}`, data, { headers: { Authorization: loggedUser[0].ID } })
        .then(res => {
            alert(res.data); // Értesítés a válaszról

            if (res.status === 200) {
                // Töröljük a mezők értékét a sikeres módosítás után
                document.querySelector('#oldpass').value = "";
                document.querySelector('#newpass').value = "";
                document.querySelector('#confirm').value = "";
            }
        })
}

function updateEmail() {
    let data = {
        newEmail: document.querySelector('#newEmail').value,
        currentPassword: document.querySelector('#passwd').value
    };

    // Ellenőrizzük, hogy a bejelentkezett felhasználó ID-ja elérhető
    if (!loggedUser || !loggedUser[0]) {
        alert('Jelentkezz be az e-mail cím módosításához!');
        return;
    }

    // Ellenőrizzük, hogy az új e-mail és a jelszó megvan
    if (!data.newEmail || !data.currentPassword) {
        alert('Kérjük, töltse ki az összes mezőt!');
        return;
    }

    // Axios PATCH kérés küldése
    axios.patch(`${serverUrl}/emailmod/${loggedUser[0].ID}`, data, { headers: { Authorization: loggedUser[0].ID } })
        .then(res => {
            alert(res.data); // Értesítés a válaszról

            if (res.status === 200) {
                // Töröljük a mezők értékét a sikeres módosítás után
                document.querySelector('#newEmail').value = "";
                document.querySelector('#passwd').value = "";
            }
        })
        .catch(err => {
            alert('Hiba történt az e-mail cím módosítása közben!'); // Hibakezelés
            console.error(err);
        });
}


function getMe(){
    axios.get(`${serverUrl}/me/${loggedUser[0].ID}`, authorize()).then(res =>{
        console.log(res.data[0].name)
    });
}