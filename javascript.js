//define master type obj that stores a single type obj per key
const types = {
	normal: {
		color: "#9fa19f",
		weak: ["fighting"],
		resist: [],
		immune: ["ghost"],
	},
	fighting: {
		color: "#ff8000",
		weak: ["flying", "psychic", "fairy"],
		resist: ["rock", "bug", "dark"],
		immune: [],
	},
	flying: {
		color: "#81b9ef",
		weak: ["rock", "electric", "ice"],
		resist: ["fighting", "bug", "grass"],
		immune: ["ground"],
	},
	poison: {
		color: "#9141cb",
		weak: ["ground", "psychic"],
		resist: ["fighting", "poison", "grass", "bug", "fairy"],
		immune: [],
	},
	ground: {
		color: "#915121",
		weak: ["water", "grass", "ice"],
		resist: ["poison", "rock"],
		immune: ["electric"],
	},
	rock: {
		color: "#afa981",
		weak: ["fighting", "ground", "water", "grass", "steel"],
		resist: ["normal", "flying", "poison", "fire"],
		immune: [],
	},
	bug: {
		color: "#91a119",
		weak: ["flying", "rock", "fire"],
		resist: ["fighting", "ground", "grass"],
		immune: [],
	},
	ghost: {
		color: "#704170",
		weak: ["ghost", "dark"],
		resist: ["poison", "bug"],
		immune: ["normal", "fighting"],
	},
	steel: {
		color: "#60a1b8",
		weak: ["fighting", "ground", "fire"],
		resist: ["normal", "flying", "rock", "bug", "steel", "grass", "psychic", "ice", "dragon", "fairy"],
		immune: ["poison"],
	},
	fire: {
		color: "#e62829",
		weak: ["ground", "rock", "water"],
		resist: ["bug", "fire", "grass", "steel", "ice", "fairy"],
		immune: [],
	},
	water: {
		color: "#2980ef",
		weak: ["grass", "electric"],
		resist: ["fire", "water", "ice", "steel"],
		immune: [],
	},
	grass: {
		color: "#3fa129",
		weak: ["flying", "poison", "bug", "fire", "ice"],
		resist: ["ground", "water", "grass", "electric"],
		immune: [],
	},
	electric: {
		color: "#fac000",
		weak: ["ground"],
		resist: ["flying", "electric", "steel"],
		immune: [],
	},
	psychic: {
		color: "#ef4179",
		weak: ["bug", "ghost", "dark"],
		resist: ["fighting", "psychic"],
		immune: [],
	},
	ice: {
		color: "#3dcef3",
		weak: ["fighting", "rock", "fire", "steel"],
		resist: ["ice"],
		immune: [],
	},
	dragon: {
		color: "#5060e1",
		weak: ["ice", "dragon", "fairy"],
		resist: ["fire", "water", "grass", "electric"],
		immune: [],
	},
	dark: {
		color: "#624d4e",
		weak: ["fighting", "bug", "fairy"],
		resist: ["ghost", "dark"],
		immune: ["psychic"],
	},
	fairy: {
		color: "#ef70ef",
		weak: ["poison", "steel"],
		resist: ["fighting", "bug", "dark"],
		immune: ["dragon"],
	},
}

//make a global queue that stores the first two choices and removes the first thing if capacity is exceeded
let typeQueue = [];
//also this so we can access the button ref that corresponds to the types in the typeQueue
let btnQueue = [];

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
		if (typeQueue.length > 2) {
			typeQueue.shift();//take out first element in array
			btnQueue[0].classList.remove("selected");
			btnQueue.shift();//take out first element in array
		}
	}
	//console.log(typeQueue);
	calculateTypes(typeQueue);
}


//take the strings from an array containing type names to create results obj
function calculateTypes(typeArray) {

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
		combinedWeaknesses.splice(0, 0, ...types[type].weak);
		combinedResistances.splice(0, 0, ...types[type].resist);
		combinedImmunities.splice(0, 0, ...types[type].immune);
	}

	// console.log("weak: " + combinedWeaknesses);
	// console.log("resist: " + combinedResistances);
	// console.log("immune: " + combinedImmunities);

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

function fillResultsPage(results) {
	//clear all previous results
	document.querySelectorAll(".resultElement").forEach(e => e.remove());

	const createResultElement = (type) => {
		const element = document.createElement("div");
		element.innerText = type;
		element.style.setProperty("--typeColor", types[type].color);
		element.classList.add("resultElement");
		return element;
	}

	for (let result in results) {
		const resultDiv = document.querySelector("#" + result);
		const headerTag = resultDiv.previousElementSibling;
		headerTag.style.display = "none";//hide until we fill with elements

		results[result].forEach((type) => {
			headerTag.style.display = "block";
			const newElement = createResultElement(type);
			resultDiv.appendChild(newElement);
		});
	}
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

//show neutral results at the start
calculateTypes([]);
