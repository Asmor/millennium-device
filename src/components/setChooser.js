"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var ChoiceStore = require("../stores/choiceStore.js");
var SetDropdown = require("./setDropdown.js");

var SetChooser = React.createClass({
	displayName: "set-chooser",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		choiceStore: React.PropTypes.instanceOf(ChoiceStore).isRequired,
		options: React.PropTypes.array.isRequired,
		header: React.PropTypes.string.isRequired
	},
	componentDidMount: function () {
		this.props.choiceStore.bind("update", this.choicesChanged);
	},
	choicesChanged: function (what) {
		this.forceUpdate();
	},
	render: function () {
		var choiceStore = this.props.choiceStore;
		var header = this.props.header;
		var options = this.props.options;
		var complement = choiceStore.complement(options);
		var dropdowns = [];
		var size = choiceStore.size();
		var currentOptions;
		var currentValue;

		for ( var i = 0; i < size; i++ ) {
			currentValue = choiceStore.get(i);
			if ( currentValue ) {
				currentOptions = complement.concat({ name: currentValue });
			} else {
				currentOptions = complement;
			}

			dropdowns.push(React.createElement(SetDropdown, {
				dispatcher: this.props.dispatcher,
				index: i,
				choiceStore: choiceStore,
				initialValue: currentValue,
				sets: currentOptions,
				key: i,
			}));
		}

		return React.createElement("div", { className: "set-chooser" },
			React.createElement("h3", { key: header }, header),
			dropdowns
		);
	},
});

module.exports = SetChooser;
