var parseMasInt = function(mas) {
	let newMas = [];
	for (let i = 0; i < mas.length; i++) {
		newMas.push(parseInt(mas[i]));
	}
	return newMas;
};

var pushFirst = function(mas, elem) {
	let newMas = [ elem ];
	for (let i = 0; i < mas.length; i++) {
		newMas.push(mas[i]);
	}
	return newMas;
};

var masContains = function(source, mas) {
	let contains = [];
	for (let i = 0; i < mas.length; i++) {
		for (let j = 0; j < source.length; j++) {
			if (mas[i] === source[j]) {
				contains.push(mas[i]);
			}
		}
	}
	return contains;
};

module.exports = {
	parseMasInt: parseMasInt,
	pushFirst:   pushFirst,
	masContains: masContains
};