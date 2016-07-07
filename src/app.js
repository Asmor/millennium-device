var Dispatcher = require("flux/lib/Dispatcher");

var React = require("react");
var ReactDOM = require("react-dom");

var sets = require("./data/sets.json");

var SetStore = require("./stores/setStore.js");

var SetDropdown = require("./components/setDropdown.js");

var store = new SetStore(sets);

function n(count) {
	var out = [];
	for ( var i = 0; i < count; i++ ) {
		out.push(i);
	}

	return out;
}

var setTypes = [
	{ type: "Expansion", count: 5 },
	{ type: "Premium",   count: 4 },
	{ type: "Master",    count: 3 },
	{ type: "Bronze",    count: 2 },
	{ type: "Silver",    count: 2 },
	{ type: "Gold",      count: 1 },
];

var dropdowns = setTypes.reduce(function (out, defs) {
	out[defs.type] = n(defs.count).map(function (i) {
		return React.createElement(SetDropdown, { sets: store.types[defs.type], key: defs.type + i });
	});

	return out;
}, {});

var rootElement = React.createElement("div", {}, Object.keys(dropdowns).reduce(function (elements, type) {
	// Add header
	elements.push(React.createElement("h3", { key: type }, type));
	// Add dropdowns
	elements.splice(elements.length, 0, dropdowns[type]);

	return elements;
}, []));

window.addEventListener("load", function () {
	ReactDOM.render(rootElement, document.getElementById("content"));
});
