"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var ChoiceStore = require("../stores/choiceStore.js");
var SetDropdown = require("./setDropdown.js");
var { shuffle } = require("../util.js");

var SetChooser = React.createClass({
	displayName: "set-chooser",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		choiceStore: React.PropTypes.instanceOf(ChoiceStore).isRequired,
		options: React.PropTypes.array.isRequired,
		header: React.PropTypes.string.isRequired,
		label: React.PropTypes.array,
	},
	getInitialState: function () {
		var choiceStore = this.props.choiceStore;
		var initialState = {};

		for ( var i = 0; i < choiceStore.size(); i++ ) {
			initialState["options" + i] = this.generateOptions(i);
		}

		return initialState;
	},
	componentDidMount: function () {
		this.props.choiceStore.bind("update", this.choicesChanged);
	},
	choicesChanged: function (args) {
		var { index } = args;
		var stateUpdate = {};
		stateUpdate["options" + index] = this.generateOptions(index);
		this.setState(stateUpdate);
	},
	generateOptions: function (index) {
		// clone state stuff so so we don't mutate it
		var choiceStore = this.props.choiceStore;

		var options = choiceStore.complement(this.props.options);

		var currentValue = choiceStore.get(index) || "";
		if ( currentValue ) {
			options.push({ name: currentValue });
		}

		return options;
	},
	randomize: function () {
		var count = this.props.choiceStore.size();
		var id = this.props.choiceStore.id();
		var shuffled = shuffle(this.props.options.map(o => o.name));
		var selected = shuffled.slice(0, count);

		// If this category has labels, the order is important so don't sort
		if ( !this.props.labels ) {
			selected.sort();
		}

		selected.forEach(
			(value, index) => this.props.dispatcher.dispatch({ action: "choice", id, index, value })
		);
	},
	render: function () {
		var {choiceStore, header, labels} = this.props;
		var dropdowns = [];
		var size = choiceStore.size();
		var currentValue;
		var props;

		for ( var i = 0; i < size; i++ ) {
			currentValue = choiceStore.get(i) || "";

			props = {
				dispatcher: this.props.dispatcher,
				index: i,
				choiceStore: choiceStore,
				value: currentValue,
				sets: this.state["options" + i],
				key: i,
			};

			if ( labels ) {
				props.label = labels[i];
			}

			dropdowns.push(React.createElement(SetDropdown, props));
		}

		return React.createElement("div", { className: "set-chooser" },
			React.createElement("h3", { key: header }, header,
				React.createElement("button", { onClick: this.randomize }, "Randomize")
			),
			dropdowns
		);
	},
});

module.exports = SetChooser;
