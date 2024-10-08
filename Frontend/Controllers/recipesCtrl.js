let categoryID;
let ingredientsList = []; 
function getRecipes() {
    let tartalom = document.querySelector('.tartalom');

    axios.get(`${serverUrl}/recipes`).then(res => {
        console.log(res.data);

        for (let i = 0; i < res.data.length; i++) {
            let recipeCard = document.createElement('div');
            recipeCard.id = `card${i}`;
            recipeCard.classList.add(
                
                'flex',
                'flex-row',
                'justify-center',
                'items-stretch', 
                'h-full',
                'w-3/4',
                'bg-stone-400',
                'rounded-[15px]',
                'drop-shadow-lg',
                'overflow-hidden',
                
            );

            const Content = document.createElement('div');
            Content.classList.add(
                'w-1/2',
                'flex',
                'flex-col',
                'justify-start',
                'items-center',
                'h-full', 
                'text-xl',
                'text-stone-700'
                
            );

            const Title = document.createElement('h3');
            Title.id = `title${i}`;
            Title.innerHTML = res.data[i].title;
            Title.classList.add(
                'bg-stone-500',
                'w-full',
                'rounded-tr-[15px]',
                'text-center',
                'p-5',
                'text-stone-100',
                'text-2xl'
            );

            const desc = document.createElement('p');
            desc.id = `desc${i}`;
            desc.innerHTML = res.data[i].description;
            desc.classList.add('text-stone-600', 'text-justified', "w-full");

            const time = document.createElement('p');
            time.id = `time${i}`;
            time.innerHTML ="Idő: " + res.data[i].time + " perc";

            const additions = document.createElement('ul');
            additions.id = `additions${i}`;

            const additionsArray = res.data[i].additions.split(',');

            additionsArray.forEach(addition => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `- ${addition.trim()}`;
                additions.appendChild(listItem);
            });

            const calory = document.createElement('p');
            calory.id = `calory${i}`;
            calory.innerHTML = res.data[i].calory + " Kcal";

            const kep = document.createElement('div');
            kep.classList.add('kep', 'relative', 'w-1/2', 'h-full', 'rounded-l-[15px]','self-center');

            const descContainer = document.createElement('div');
            descContainer.classList.add(
                'flex',
                'flex-col',
                'justify-evenly',
                'content-center',
                'items-center',
                'w-full',
                'h-auto',
                'px-5',
                'text-xl',
                'text-stone-700',
                'py-5',
                'gap-5'
            );

            let hozzavalok = document.createElement('h3');
            hozzavalok.innerHTML = 'Hozzávalók:'
            let leiras = document.createElement('h3');
            leiras.innerHTML = 'Leírás:'
            descContainer.appendChild(hozzavalok)
            descContainer.appendChild(additions);
            descContainer.appendChild(leiras)
            descContainer.appendChild(desc);
            descContainer.appendChild(time);
            descContainer.appendChild(calory);

            Content.appendChild(Title);
            Content.appendChild(descContainer);

            recipeCard.appendChild(kep);
            recipeCard.appendChild(Content);

            tartalom.appendChild(recipeCard);
        }
    });
}
function pushRecipes() {
    let dropBtn = document.querySelector(".dropBTN");

    if (!dropBtn) {
        console.error("Drop button not found");
        return;
    }

    let recipe = {
        catID: categoryID, 
        userID: loggedUser[0].ID,
        title: document.querySelector("#EtelNev").value, 
        description: document.querySelector("#descriptionTextarea").value, 
        time: document.querySelector(".time").value, 
        additions: ingredientsList.join(', '), // Join the ingredients list into a string
        calory: document.querySelector(".calory").value  
    };

    if (categoryID == undefined || recipe.title == "" || recipe.description == "" || recipe.time == "" || ingredientsList.length == 0 || recipe.calory == "") {
        alert("Kérjük, töltse ki az összes mezőt!");
    } else {
        axios.post(`${serverUrl}/upload/${loggedUser[0].ID}`, recipe, authorize()).then(res => {
            alert(res.data);
            // Reset the ingredient list after successful upload
            ingredientsList = [];
            // Optionally, clear the displayed ingredients
            updateIngredientsDisplay(document.querySelector(".ingredients"));
        });
    }

    console.log(recipe);
}
function getCategory(){
    const kategoriak = document.querySelector(".kategoriak");
    const dropBTN = document.querySelector(".dropBTN");

    axios.get(`${serverUrl}/category`).then(res => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++){
            let kategoria = document.createElement('li'); 
            kategoria.id = `kategoria${i}`;
            kategoria.innerHTML = res.data[i].name;
            categoryID = res.data[i].ID;

            kategoriak.appendChild(kategoria);
            kategoria.addEventListener('click', () => {
                dropBTN.innerHTML = kategoria.innerHTML;
                dropBTN.classList.add("text-stone-700");
            });  
        }
    });
}

function dropdownCheck() {
    const kategoriak = document.querySelector(".kategoriak");
    
    kategoriak.classList.toggle('visible');
    const dropBTN = document.querySelector(".dropBTN");
    dropBTN.classList.toggle('rounded-b-[15px]')
     // Toggle 'visible' class to show/hide the dropdown
}

function addAdditions() {
    const ingredients = document.querySelector(".ingredients");
    const placeholder = document.querySelector(".placeholder");
    const addition = document.querySelector(".addition").value.trim();
    const quantity = document.querySelector(".quantity").value.trim();

    if (addition !== '' && quantity !== '') {
        // Add the new ingredient to the ingredients list
        ingredientsList.push(`${addition} - ${quantity}`);
        
        // Clear the input fields
        document.querySelector(".addition").value = '';
        document.querySelector(".quantity").value = '';

        // Update the displayed ingredients
        updateIngredientsDisplay(ingredients);
        placeholder.classList.add('hidden');
    } else {
        alert("Kérjük, adjon meg egy hozzávalót és mennyiséget!");
    }
}

function updateIngredientsDisplay(ingredients) {
    // Clear the existing ingredients displayed
    ingredients.innerHTML = '';
    
    // Create and append new ingredient elements
    ingredientsList.forEach((ingredient) => {
        const listItem = document.createElement('h3');
        listItem.classList.add('text-xl', 'text-stone-200');
        listItem.innerHTML = ingredient + ',';
        ingredients.appendChild(listItem);
    });
}

window.onload = function() {
    getCategory();
};