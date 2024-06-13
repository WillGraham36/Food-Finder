const api_key = "c6bbd5619b964528b6c4a9f4b37d26fd";
let instructions;
let ingredients;

const ingredientsList = document.querySelector("#ingredientsList");
const instructionsList = document.querySelector("#instructionsList");
const recipeName = document.querySelector("#recipeName");


if(sessionStorage.getItem("recipeId") == null) {
    sessionStorage.setItem("recipeId", JSON.parse(localStorage.getItem("recipeId")));
}
const id = sessionStorage.getItem("recipeId");


function getInfoFromApi() {
    getIngredientsFromAPI();
    getInstructionsFromAPI();
}

async function getIngredientsFromAPI() {
    if(localStorage.getItem(id + "ingredients") == null) {
        const final_url = "https://api.spoonacular.com/recipes/" + id + "/information" + "?apiKey=" + api_key;
        fetch(final_url)
            .then(response => {
                if(!response.ok) {
                    throw new Error("HTTP error");
                }
                return response.json();
            })
            .then(data => {
                ingredients = data;
                localStorage.setItem(id + "ingredients", JSON.stringify(ingredients));
                recipeName.innerHTML = data.title;
                ingredients = data.extendedIngredients;
                addIngredientsToHTML();
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        ingredients = JSON.parse(localStorage.getItem(id + "ingredients"));
        recipeName.innerHTML = ingredients.title;
        ingredients = ingredients.extendedIngredients;
        console.log(ingredients);
        addIngredientsToHTML();
    }
}

async function getInstructionsFromAPI() {
    if(localStorage.getItem(id + "instructions") == null) {
        const final_url = "https://api.spoonacular.com/recipes/" + id + "/analyzedInstructions" + "?apiKey=" + api_key;
        fetch(final_url)
            .then(response => {
                if(!response.ok) {
                    throw new Error("HTTP error");
                }
                return response.json();
            })
            .then(data => {
                instructions = data[0].steps;
                localStorage.setItem(id + "instructions", JSON.stringify(instructions));
                addInstructionsToHTML();
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        instructions = JSON.parse(localStorage.getItem(id + "instructions"));
        addInstructionsToHTML();
    }
}

function addIngredientsToHTML() {
    for(let i = 0; i < ingredients.length; i++) {
        const ingredientsListNode = document.createElement("li");
        let ingredientName = ingredients[i].measures.us.amount + " " + ingredients[i].measures.us.unitLong + " " + ingredients[i].originalName;
        ingredientsListNode.innerHTML = ingredientName;
        ingredientsListNode.setAttribute("class", "ingredient");
        ingredientsList.appendChild(ingredientsListNode);
    }
}

function addInstructionsToHTML() {
    const steps = getSteps();

    for(let i = 0; i < steps.length; i++) {
        const stepsListNode = document.createElement("li");
        stepsListNode.innerHTML = steps[i][0].toUpperCase() + steps[i].slice(1);
        stepsListNode.setAttribute("class", "step");
        instructionsList.appendChild(stepsListNode);
    }
}

const getSteps = () => {
    let steps = [];
    for(let i = 0; i < instructions.length; i++) {
        steps.push(instructions[i].step);
    }
    return steps;

}