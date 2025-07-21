//define master type obj that stores a single type obj per key
const types = {
	grass: {
		weak: ["flying", "poison", "bug", "fire", "ice"],
		resist: ["ground", "water", "grass", "electric"],
		immune: [],
	},
	water: {
		weak: ["grass", "electric"],
		resist: ["fire", "water", "ice", "steel"],
		immune: [],
	},
	fire: {
		weak: ["ground", "rock", "water"],
		resist: ["bug", "fire", "grass", "steel", "ice", "fairy"],
		immune: [],
	},
}

//make a global queue that stores the first two choices and removes the first thing if capacity is exceeded
let typeQueue = [];

function addToQueue(typeName) {
	//if we've already added this type, remove it
	if (typeQueue.includes(typeName)) {
		const toRemove = typeQueue.findIndex((item) => item === typeName);
		typeQueue.splice(toRemove, 1);
	}
	else {
		typeQueue.push(typeName);
		if (typeQueue.length > 2) {
			typeQueue.shift();//take out first element in array
		}
	}
	console.log(typeQueue);
	calculateTypes(typeQueue);
}

function includesMultiple(array, toSearch) {
	return array.indexOf(toSearch) !== array.lastIndexOf(toSearch);
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

	console.log("weak: " + combinedWeaknesses);
	console.log("resist: " + combinedResistances);
	console.log("immune: " + combinedImmunities);

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

	console.log(results);
}


//create buttons of each available type
const container = document.querySelector("#buttons");
for (let type in types) {
	const btn = document.createElement("button");
	btn.addEventListener("click", () => addToQueue(type));
	//console.log(types[type]);
	//just type on its own is a string
	btn.innerText = type;
	container.appendChild(btn);
}
