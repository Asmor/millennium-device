"use strict";

var Dispatcher = require("flux/lib/Dispatcher");

var React = require("react");
var ReactDOM = require("react-dom");

var rawSets = require("./data/sets.json");

var SetStore = require("./stores/setStore.js");
var ChoiceStore = require("./stores/choiceStore.js");

var SetChooser = require("./components/setChooser.js");

var bladeDispatcher = new Dispatcher();

var setsStore = new SetStore(rawSets);
var choiceStores = {
	Expansion: new ChoiceStore(5),
	Premium: new ChoiceStore(4),
	Master: new ChoiceStore(3),
	Bronze: new ChoiceStore(2),
	Silver: new ChoiceStore(2),
	Gold: new ChoiceStore(1),
};

var setChoosers = {};

Object.keys(choiceStores).forEach(function (type) {
	var choiceStore = choiceStores[type];

	choiceStore.registerDispatcher(bladeDispatcher);

	setChoosers[type] = React.createElement(SetChooser, {
		dispatcher: bladeDispatcher,
		choiceStore: choiceStore,
		options: setsStore.types[type],
		header: type,
		key: type,
	});
});

var rootElement = React.createElement("div", {}, Object.keys(setChoosers).map(key => setChoosers[key]));

window.addEventListener("load", function () {
	ReactDOM.render(rootElement, document.getElementById("content"));
});
