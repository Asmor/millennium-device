"use strict";

var Dispatcher = require("flux/lib/Dispatcher");
var bladeDispatcher = new Dispatcher();

var React = require("react");
var ReactDOM = require("react-dom");

var SetsPage = require("./components/setsPage.js");

var rootElement = React.createElement(SetsPage, {
	sets: require("./data/sets.json"),
	dispatcher: bladeDispatcher,
});

window.addEventListener("load", function () {
	ReactDOM.render(rootElement, document.getElementById("content"));
});
