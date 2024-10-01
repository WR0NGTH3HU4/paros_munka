function getUsers(){
    const userLine = document.createElement('span');
    userLine.classList.add('flex', 'flex-row', 'jutify-evenly', 'content-center', 'items-center', 'p-3', 'rounded-[15px]', 'text-xl', 'text-stone-200');
    const deleteBTN = document.createElement('span');
    deleteBTN.classList.add('p-3', 'bg-red-600', 'rounded-[15px]', 'text-xl', 'text-stone-200')
    deleteBTN.innerHTML = "Törlés"

    

}