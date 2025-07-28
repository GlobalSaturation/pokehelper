//GLOBALS////////////////////////

//make a queue that stores the first two choices and removes the first thing if capacity is exceeded
let typeQueue = [];
//also this so we can access the button ref that corresponds to the types in the typeQueue
let btnQueue = [];
let queueMax = 2;

const modes = Object.freeze({
	OFFENSE: "offense",
	DEFENSE: "defense",
});
let currMode;

let isGuessMode = false;

//define master type obj that stores a single type obj per key
const types = {
	normal: {
		color: "#9fa19f",
		offense: {
			weak: [],
			resist: ["rock", "steel"],
			immune: ["ghost"],
		},
		defense: {
			weak: ["fighting"],
			resist: [],
			immune: ["ghost"],
		},
	},
	fighting: {
		color: "#ff8000",
		offense: {
			weak: ["normal", "rock", "ice", "steel", "dark"],
			resist: ["flying", "poison", "bug", "psychic", "fairy"],
			immune: ["ghost"],
		},
		defense: {
			weak: ["flying", "psychic", "fairy"],
			resist: ["rock", "bug", "dark"],
			immune: [],
		},
	},
	flying: {
		color: "#81b9ef",
		offense: {
			weak: ["fighting", "bug", "grass"],
			resist: ["rock", "electric", "steel"],
			immune: [],
		},
		defense: {
			weak: ["rock", "electric", "ice"],
			resist: ["fighting", "bug", "grass"],
			immune: ["ground"],
		},
	},
	poison: {
		color: "#9141cb",
		offense: {
			weak: ["grass", "fairy"],
			resist: ["poison", "ground", "rock", "ghost"],
			immune: ["steel"],
		},
		defense: {
			weak: ["ground", "psychic"],
			resist: ["fighting", "poison", "grass", "bug", "fairy"],
			immune: [],
		},
	},
	ground: {
		color: "#915121",
		offense: {
			weak: ["poison", "rock", "fire", "electric", "steel"],
			resist: ["bug", "grass"],
			immune: ["flying"],
		},
		defense: {
			weak: ["water", "grass", "ice"],
			resist: ["poison", "rock"],
			immune: ["electric"],
		},
	},
	rock: {
		color: "#afa981",
		offense: {
			weak: ["flying", "bug", "fire", "ice"],
			resist: ["fighting", "ground", "steel"],
			immune: [],
		},
		defense: {
			weak: ["fighting", "ground", "water", "grass", "steel"],
			resist: ["normal", "flying", "poison", "fire"],
			immune: [],
		},
	},
	bug: {
		color: "#91a119",
		offense: {
			weak: ["grass", "psychic", "dark"],
			resist: ["fighting", "flying", "poison", "ghost", "steel", "fire", "fairy"],
			immune: [],
		},
		defense: {
			weak: ["flying", "rock", "fire"],
			resist: ["fighting", "ground", "grass"],
			immune: [],
		},
	},
	ghost: {
		color: "#704170",
		offense: {
			weak: ["ghost", "psychic"],
			resist: ["dark"],
			immune: ["normal"],
		},
		defense: {
			weak: ["ghost", "dark"],
			resist: ["poison", "bug"],
			immune: ["normal", "fighting"],
		},
	},
	steel: {
		color: "#60a1b8",
		offense: {
			weak: ["rock", "ice", "fairy"],
			resist: ["steel", "fire", "water", "electric"],
			immune: [],
		},
		defense: {
			weak: ["fighting", "ground", "fire"],
			resist: ["normal", "flying", "rock", "bug", "steel", "grass", "psychic", "ice", "dragon", "fairy"],
			immune: ["poison"],
		},
	},
	fire: {
		color: "#e62829",
		offense: {
			weak: ["bug", "grass", "ice", "steel"],
			resist: ["rock", "fire", "water", "dragon"],
			immune: [],
		},
		defense: {
			weak: ["ground", "rock", "water"],
			resist: ["bug", "fire", "grass", "steel", "ice", "fairy"],
			immune: [],
		},
	},
	water: {
		color: "#2980ef",
		offense: {
			weak: ["ground", "rock", "fire"],
			resist: ["water", "grass", "dragon"],
			immune: [],
		},
		defense: {
			weak: ["grass", "electric"],
			resist: ["fire", "water", "ice", "steel"],
			immune: [],
		},
	},
	grass: {
		color: "#3fa129",
		offense: {
			weak: ["ground", "rock", "water"],
			resist: ["flying", "poison", "bug", "fire", "grass", "dragon", "steel"],
			immune: [],
		},
		defense: {
			weak: ["flying", "poison", "bug", "fire", "ice"],
			resist: ["ground", "water", "grass", "electric"],
			immune: [],
		},
	},
	electric: {
		color: "#fac000",
		offense: {
			weak: ["flying", "water"],
			resist: ["grass", "electric", "dragon"],
			immune: ["ground"],
		},
		defense: {
			weak: ["ground"],
			resist: ["flying", "electric", "steel"],
			immune: [],
		},
	},
	psychic: {
		color: "#ef4179",
		offense: {
			weak: ["fighting", "poison"],
			resist: ["psychic", "steel"],
			immune: ["dark"],
		},
		defense: {
			weak: ["bug", "ghost", "dark"],
			resist: ["fighting", "psychic"],
			immune: [],
		},
	},
	ice: {
		color: "#3dcef3",
		offense: {
			weak: ["flying", "ground", "grass", "dragon"],
			resist: ["water", "ice", "steel", "fire"],
			immune: [],
		},
		defense: {
			weak: ["fighting", "rock", "fire", "steel"],
			resist: ["ice"],
			immune: [],
		},
	},
	dragon: {
		color: "#5060e1",
		offense: {
			weak: ["dragon"],
			resist: ["steel"],
			immune: ["fairy"],
		},
		defense: {
			weak: ["ice", "dragon", "fairy"],
			resist: ["fire", "water", "grass", "electric"],
			immune: [],
		},
	},
	dark: {
		color: "#624d4e",
		offense: {
			weak: ["ghost", "psychic"],
			resist: ["fighting", "dark", "fairy"],
			immune: [],
		},
		defense: {
			weak: ["fighting", "bug", "fairy"],
			resist: ["ghost", "dark"],
			immune: ["psychic"],
		},
	},
	fairy: {
		color: "#ef70ef",
		offense: {
			weak: ["fighting", "dragon", "dark"],
			resist: ["poison", "steel", "fire"],
			immune: [],
		},
		defense: {
			weak: ["poison", "steel"],
			resist: ["fighting", "bug", "dark"],
			immune: ["dragon"],
		},
	},
}

function removeAll(identifier) {
		document.querySelectorAll(identifier).forEach((e) => e.remove());
}

function addToQueue(btn, typeName) {
	//if we've already added this type, remove it
	if (typeQueue.includes(typeName)) {
		const toRemove = typeQueue.findIndex((item) => item === typeName);
		typeQueue.splice(toRemove, 1);

		//remove selected style from button before we remove it from the queue
		btnQueue[toRemove].classList.remove("selected");
		btnQueue.splice(toRemove, 1);
	}
	else {
		typeQueue.push(typeName);
		btnQueue.push(btn);

		btn.classList.add("selected");
		if (typeQueue.length > queueMax) {
			typeQueue.shift();//take out first element in array
			btnQueue[0].classList.remove("selected");
			btnQueue.shift();//take out first element in array
		}
	}
	//console.log(typeQueue);
	calculateTypes(typeQueue, currMode);
}

//take the strings from an array containing type names to create results obj
function calculateTypes(typeArray, mode) {

	let results = {
		extraEffective: [],
		effective: [],
		neutral: [],
		resistant: [],
		extraResistant: [],
		immune: [],
	}
	//create arrays of combined weaknesses, resistances, and immunities
	let combinedWeaknesses = [];
	let combinedResistances = [];
	let combinedImmunities = [];
	for (let type of typeArray) {
		combinedWeaknesses.splice(0, 0, ...types[type][mode].weak);
		combinedResistances.splice(0, 0, ...types[type][mode].resist);
		combinedImmunities.splice(0, 0, ...types[type][mode].immune);
	}

	const includesMultiple = (array, toSearch) => {
		return array.indexOf(toSearch) !== array.lastIndexOf(toSearch);
	}

	//iterate through all type strings that exist and sort each type into one of the obj keys
	for (let type in types) {
		let typeScore = 0;
		if (combinedWeaknesses.includes(type)) {
			typeScore++;//weak
			if (includesMultiple(combinedWeaknesses, type)) {
				typeScore++;//extra weak
			}
		}
		if (combinedResistances.includes(type)) {
			typeScore--;//resistant
			if (includesMultiple(combinedResistances, type)) {
				typeScore--;//extra resistant
			}
		}
		if (combinedImmunities.includes(type)) {
			typeScore = -3;//immune
		}
		switch (typeScore) {
			case 0: results.neutral.push(type); break;
			case 1: results.effective.push(type); break;
			case 2: results.extraEffective.push(type); break;
			case -1: results.resistant.push(type); break;
			case -2: results.extraResistant.push(type); break;
			case -3: results.immune.push(type); break;
		}
	}

	fillResultsPage(results);
}

//call this only once to create the results elements
function createResultElements() {
	const defaultDiv = document.querySelector("#neutral");

	for (let type in types ) {
		const element = document.createElement("div");
		element.innerText = type;
		//also set inner data to its type so that we can retrieve it for guess mode
		element.dataset.typeName = type;
		element.style.setProperty("--typeColor", types[type].color);
		element.classList.add("resultElement");
		defaultDiv.appendChild(element);
	}
}

//attach the result elements to their spots
function fillResultsPage(results) {
	for (let result in results) {
		const resultDiv = document.querySelector("#" + result);
		const headerTag = resultDiv.previousElementSibling;
		headerTag.style.display = "none";//hide until we fill with elements

		//for each type in a result section, attach an element in its correct spot
		results[result].forEach((type) => {
			headerTag.style.display = "block";
			//access element by its typeName
			//"type-name" is with dashes because of how camelCase in js is converted to dashes for css and html stuff!
			const elementToAttach = document.querySelector(`[data-type-name="${type}"]`);
			resultDiv.appendChild(elementToAttach);
		});
	}

	//create or remove guess mode type prompts
	togglePromptTypes();
}

//create buttons of each available type
const container = document.querySelector("#buttons");
for (let type in types) {
	const btn = document.createElement("button");
	const image = document.createElement("img");
	const span = document.createElement("span");

	image.src = `images/${type}.png`;
	span.innerText = type;
	btn.appendChild(image);
	btn.appendChild(span);

	btn.classList.add("typeBtn");
	btn.addEventListener("click", (e) => addToQueue(e.currentTarget,type));
	btn.style.setProperty("--typeColor", types[type].color);
	container.appendChild(btn);
}

//set all buttons and results back to defauls
function resetCalc() {
	typeQueue = [];
	btnQueue = [];
	calculateTypes([], currMode);//call with an empty results array to reset the results
	const typeBtns = document.querySelectorAll(".typeBtn");
	for (let typeBtn of typeBtns) {
		typeBtn.classList.remove("selected");
	}
}

//initialize mode buttons
const offenseBtn = document.querySelector("#offense");
const defenseBtn = document.querySelector("#defense");

//called at the beginning and whenever a mode button is pressed
function modeChange(mode, newQueueMax) {
	//determine which buttons we're referring to later based on the mode parameter
	const btn = (mode === modes.DEFENSE) ? defenseBtn : offenseBtn;
	const oppositeBtn = (mode === modes.DEFENSE) ? offenseBtn : defenseBtn;

	//unselect any type buttons and refresh calcs when mode is changed
	if (!btn.classList.contains("selected")) {
		btn.classList.add("selected");
		oppositeBtn.classList.remove("selected");
		currMode = mode;
		queueMax = newQueueMax;
		resetCalc();
	}
};
//offense
offenseBtn.addEventListener("click", () => {
	document.querySelector("#choose-types").innerText = "Choose type";
	document.querySelector("#damage-text").innerText = "Deals damage to:";
	modeChange(modes.OFFENSE, 1);
});
//defense
defenseBtn.addEventListener("click", () => {
	document.querySelector("#choose-types").innerText = "Choose types";
	document.querySelector("#damage-text").innerText = "Takes damage from:";
	modeChange(modes.DEFENSE, 2);
});

//when we update the results and are in guess mode, show what types are selected in the prompt
function togglePromptTypes() {
	removeAll("#word-container > span");

	if (isGuessMode) {
	const container = document.querySelector("#word-container");

	//create a span element for the type/s, attach it to the container
	//this is to have the flexbox wrapping work properly!
	typeQueue.forEach((type) => {
		const span = document.createElement("span");
		span.innerText = type;
		span.style.setProperty("--typeColor", types[type].color);
		container.appendChild(span);
	});
	}
}

//this is called when the guess checkbox is clicked
function handleGuessMode() {
	//reveal or hide the types
	const resultElements = document.querySelectorAll(".resultElement");
	for (let resultElement of resultElements) {
		if (isGuessMode) {
			resultElement.classList.add("mystery");
			resultElement.innerText = "?";
		} else {
			resultElement.classList.remove("mystery");
			resultElement.innerText = resultElement.dataset.typeName;
		}
	}

	togglePromptTypes();

	if (isGuessMode) {
		//create the guess ui
		const guessDiv = document.querySelector("#guess-ui");

		for (let type in types ) {
			const element = document.createElement("button");
			document.querySelector("#guess-prompt-wrapper > h2").style.display = "block";
			element.innerText = type;
			//also set inner data to its type so that we can retrieve it for guess mode
			element.dataset.typeName = type;
			element.style.setProperty("--typeColor", types[type].color);
			element.classList.add("guessElement");
			guessDiv.appendChild(element);
		}
	} else {
		//remove the guess ui
		document.querySelector("#guess-prompt-wrapper > h2").style.display ="none";
		removeAll(".guessElement");
	}
}

//initialize guess mode
const guessCheckbox = document.querySelector("#guess-mode");
guessCheckbox.addEventListener("click", () => {
	if (guessCheckbox.checked) {
		isGuessMode = true;
	} else {
		isGuessMode = false;
	}
	handleGuessMode();
});

//set defaults at the start
function startUp() {
	//don't display the guess prompt at the start
	document.querySelector("#guess-prompt-wrapper > h2").style.display ="none";
	createResultElements();
	//call this to start page in defense mode, and to give us the blank results at the start
	modeChange(modes.DEFENSE, 2);
}

startUp();
