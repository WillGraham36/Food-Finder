
const api_url = "https://api.spoonacular.com/recipes/findByIngredients";

const addInput = document.querySelector("#enterIngredientBar");
const addBtn = document.querySelector("#addIngredientBtn");
const searchBtn = document.querySelector("#searchBtn");
const clearBtn = document.querySelector("#clearBtn");
const minimizeMissingBtn = document.querySelector("#minimizeMissingBtn");
const loadMoreBtn = document.querySelector("#loadMoreBtn");

const table = document.querySelector('.resultsTable').querySelector("table");
const tbody = document.getElementById("tableBody");

let ingredients = [];
let listOfRecipes;

const generateFinalUrl = (ingredients, number, ranking) => {
    let final_url = api_url + "?apiKey=" + api_key + "&ingredients=";
    for(let i = 0; i < ingredients.length - 1; i++) {
        final_url += ingredients[i] + ",";
    }
    final_url += ingredients[ingredients.length - 1];

    final_url += "&number=" + number;
    final_url += "&ranking=" + ranking;
    final_url += "&ignorePantry=" + true;
    return final_url;
};

async function getRecipes(final_url) {
    fetch(final_url)
        .then(response => {
            if(!response.ok) {
                throw new Error("HTTP error");
            }
            return response.json();
        })
        .then(data => {
            listOfRecipes = data;
            addToResults();
            document.getElementById("loader").style.display = "none";
        })
        .catch(error => {
            console.log(error);
        });
}


function addToResults() {
    if(listOfRecipes.length == 0) {
        loadMoreBtn.style.display = "none";
        tbody.innerHTML = "<tr><td colspan='4'>No results found</td></tr>";
        tbody.setAttribute("class", "tableName");
        return;
    }

    for(let i = 0; i < listOfRecipes.length; i++) {
        let missingIngredients = "";
        for(let j = 0; j < listOfRecipes[i].missedIngredients.length; j++) {
            missingIngredients += "<li>" + listOfRecipes[i].missedIngredients[j].original + "</li>";
        }

        let ingredients = "";
        for(let j = 0; j < listOfRecipes[i].usedIngredients.length; j++) {
            ingredients += "<li>" + listOfRecipes[i].usedIngredients[j].original + "</li>";
        }

        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        const tdIngredients = document.createElement('td');
        const tdMissingIngredients = document.createElement('td');
        const tdImage = document.createElement('td');


        tdImage.innerHTML = "<img class='imageInTable' src=" + listOfRecipes[i].image + ">";
        tdImage.setAttribute("class", "tableImage");

        tdName.innerHTML = "<a href='recipeinstructions.html' target='_blank' onclick='saveRecipeIdToLocal(" + listOfRecipes[i].id + ");'>" + listOfRecipes[i].title + "</a>";
        tdName.setAttribute("class", "tableName");

        tdIngredients.innerHTML = ingredients;
        tdIngredients.setAttribute("class", "tableIngredients");

        tdMissingIngredients.innerHTML = missingIngredients;
        tdMissingIngredients.setAttribute("class", "tableMissingIngredients");

        tr.appendChild(tdImage);
        tr.appendChild(tdName);
        tr.appendChild(tdIngredients);
        tr.appendChild(tdMissingIngredients);

        tbody.appendChild(tr);
        loadMoreBtn.style.display = "block";
    }
}

function saveRecipeIdToLocal(id) {
    //if there is NO recipe id in local storage or its the same one
    if(localStorage.getItem("recipeId") == null || localStorage.getItem("recipeId") != id) {
        localStorage.setItem("recipeId", id);
        console.log("added ID to local storage");
    } else {
        console.log("recipe id is already in local storage");
    } // if there is ALREADY a recipe id in local storage
}

function loadRecipes(num) {
    document.getElementById("loader").style.display = "block";
    let ranking = minimizeMissingBtn.checked ? 2 : 1;
    const final_url = generateFinalUrl(ingredients, num, ranking);
    tbody.innerHTML = "";
    getRecipes(final_url);
}

var numRecipes = 5;
loadMoreBtn.addEventListener("click", () => {
    numRecipes += 5;
    loadRecipes(numRecipes);
});

searchBtn.addEventListener("click", () => {
    loadRecipes(5);
    numRecipes = 5;
});


function removeFromList(value) {
    const index = ingredients.indexOf(value);
    if(index > -1) {
        ingredients.splice(index, 1);
    }
    localStorage.setItem("ingredientsInPantry", JSON.stringify(ingredients));
}

function addTolist() {
    if(addInput.value.split(' ').join('') != "") {
        const ul = document.getElementById("ingredientsList");
        const li = document.createElement('li');
        ingredients.push(addInput.value);
        localStorage.setItem("ingredientsInPantry", JSON.stringify(ingredients));
        li.innerHTML = "<span class='close' onclick='this.parentNode.remove(); removeFromList(\"" + addInput.value + "\"); return false;'>x</span> " + addInput.value;
        li.setAttribute("class", "ingredient");
        addInput.value = '';
        ul.appendChild(li);
    } else {
        addInput.value = "";
    }
}

function loadIngredientsFromStorage() {
    if(localStorage.getItem("ingredientsInPantry") != null && localStorage.getItem("ingredientsInPantry") != "[]") {
        const ingredientsInStorage = JSON.parse(localStorage.getItem("ingredientsInPantry"));   
        for(let i = 0; i < ingredientsInStorage.length; i++) {
            const ul = document.getElementById("ingredientsList");
            const li = document.createElement('li');
            ingredients.push(ingredientsInStorage[i]);
            li.innerHTML = "<span class='close' onclick='this.parentNode.remove(); removeFromList(\"" + ingredientsInStorage[i] + "\"); return false;'>x</span> " + ingredientsInStorage[i];
            li.setAttribute("class", "ingredient");
            ul.appendChild(li);
        }
    } //empty if otherwise
}

clearBtn.addEventListener("click", () => {
    const ul = document.getElementById("ingredientsList");
    ul.innerHTML = "";
    ingredients.length = 0;
    localStorage.setItem("ingredientsInPantry", JSON.stringify(ingredients));
});




addBtn.addEventListener("click", () => {
    addTolist();
});

addInput.addEventListener("keyup", (event) => {
    if(event.keyCode === 13) {
        addTolist();
    }
});
