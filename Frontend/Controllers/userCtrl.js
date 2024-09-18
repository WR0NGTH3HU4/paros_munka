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
