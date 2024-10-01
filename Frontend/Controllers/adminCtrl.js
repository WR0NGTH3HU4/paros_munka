function getUsers() {
    const userLines = document.querySelector(".userLines");

    axios.get(`${serverUrl}/users`, authorize()).then(res => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
            const userLine = document.createElement('span');
            userLine.classList.add('flex', 'flex-row', 'justify-evenly', 'content-center', 'items-center', 'p-3', 'rounded-[15px]', 'text-xl', 'text-stone-200', 'gap-5', "w-full", "bg-stone-400");

            const deleteBTN = document.createElement('span');
            deleteBTN.classList.add('p-3', 'bg-red-600', 'rounded-[15px]', 'text-xl', 'text-stone-200');
            deleteBTN.innerHTML = "Törlés";
            deleteBTN.id = `user-${res.data[i].ID}`; 

            let id = document.createElement('h3');
            id.innerHTML = res.data[i].ID;
            
            let name = document.createElement('h3');
            name.innerHTML = res.data[i].name;
            let email = document.createElement('h3');
            email.innerHTML = res.data[i].email;
            let role = document.createElement('h3');
            role.innerHTML = res.data[i].role;
            let status = document.createElement('h3');
            status.innerHTML = Boolean(res.data[i].status);

            userLine.appendChild(id); 
            userLine.appendChild(name);
            userLine.appendChild(email);
            userLine.appendChild(role);
            userLine.appendChild(status);
            userLine.appendChild(deleteBTN);
            userLines.appendChild(userLine);
        }
    }).catch(err => {
        console.error(err);
    });
}