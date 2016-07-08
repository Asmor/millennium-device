"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var ChoiceStore = require("../stores/choiceStore.js");

var SetDropdown = React.createClass({
	displayName: "set-dropdown",
	getInitialState: function () {
		return { value: this.props.initialValue };
	},
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		index: React.PropTypes.number.isRequired,
		sets: React.PropTypes.array.isRequired,
		initialValue: React.PropTypes.string,
		choiceStore: React.PropTypes.instanceOf(ChoiceStore).isRequired,
	},
	handleChange: function (evt) {
		var newValue = evt.target.value;
		this.setState({ value: newValue });
		this.props.dispatcher.dispatch({
			action: "choice",
			id: this.props.choiceStore.id(),
			index: this.props.index,
			value: newValue,
		});
	},
	render: function () {
		var theReplacer = /^The /i;

		return React.createElement("div", { className: "set-dropdown" },
			React.createElement("select", {
					value: this.state.value,
					onChange: this.handleChange,
				},
				React.createElement("option", { value: ""}),
				this.props.sets
				.sort(function (a, b) {
					var compA = a.name.replace(theReplacer, "").toLowerCase();
					var compB = b.name.replace(theReplacer, "").toLowerCase();
					return compA > compB ? 1 : -1;
				})
				.map(function (set) {
					return React.createElement("option", { value: set.name, key: set.name }, set.name);
				})
			)
		);
	},
});

module.exports = SetDropdown;
