function getRecipes() {

    let tartalom = document.querySelector('.tartalom');


    axios.get(`${serverUrl}/recipes`).then(res => {
        console.log(res.data);
        
        for (let i = 0; i < res.data.length; i++){

            let recipeCard = document.createElement('div')
            recipeCard.id= `card${i}`

            const Title = document.createElement('h3');
            Title.id = `title${i}`
            Title.innerHTML = res.data[i].title;

            const desc = document.createElement('p')
            desc.id = `desc${i}`
            desc.innerHTML = res.data[i].description

            const time = document.createElement('p')
            time.id = `time${i}`
            time.innerHTML = res.data[i].time

            const additions = document.createElement('p')
            additions.id = `additions${i}`
            additions.innerHTML = res.data[i].additions

            const calory = document.createElement('p')
            calory.id = `calory${i}`
            calory.innerHTML = res.data[i].calory

            recipeCard.appendChild(Title)
            recipeCard.appendChild(desc)
            recipeCard.appendChild(time)
            recipeCard.appendChild(additions)
            recipeCard.appendChild(calory)

           recipeCard.classList.add('flex', 'flex-col', 'justify-center', 'content-center', 'items-center', 'min-h[500px]', 'min-w-[400px]', 'bg-stone-400' ,'text-xl', 'text-stone-900', 'rounded-[15px]', 'p-3', 'drop-shadow-lg')

            tartalom.appendChild(recipeCard)
            tartalom.classList.add('flex', 'flex-row', 'justify-center', 'content-center', 'items-center', 'gap-5' ,'flex-wrap', 'w-full')  

            Title.classList.add('text-3xl')
        }
/*
        newRecipes.title.innerHTML = res.data[0].title; 
        newRecipes.description.innerHTML = res.data[0].description; 
        newRecipes.time.innerHTML = res.data[0].time; 
        newRecipes.additions.innerHTML = res.data[0].additions;
        newRecipes.calory.innerHTML = res.data[0].calory;
*/
    }).catch(error => {
        console.error("Hiba történt a receptek lekérésekor: ", error);
    });
}
