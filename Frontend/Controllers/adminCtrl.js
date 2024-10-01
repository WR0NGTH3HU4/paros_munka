function getUsers(){


    axios.get(`${serverUrl}/users`, authorize()).then(res =>{

        for(let i = 0; i> res.data.length; i++){
            const userLine = document.createElement('span');
            userLine.classList.add('flex', 'flex-row', 'jutify-evenly', 'content-center', 'items-center', 'p-3', 'rounded-[15px]', 'text-xl', 'text-stone-200', 'gap-5');
            const deleteBTN = document.createElement('span');
            deleteBTN.classList.add('p-3', 'bg-red-600', 'rounded-[15px]', 'text-xl', 'text-stone-200');
            deleteBTN.innerHTML = "Törlés";
            deleteBTN.id= `user-${res.data.ID}`

            userLine.appendChild(res.data.ID);
            userLine.appendChild(res.data.name);
            userLine.appendChild(res.data.email);
            userLine.appendChild(res.data.password);
            userLine.appendChild(res.data.role);
            userLine.appendChild(res.data.status);
            userLine.appendChild(deleteBTN);
        }

    });

}