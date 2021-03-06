"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var ChoiceStore = require("../stores/choiceStore.js");

var SetDropdown = React.createClass({
	displayName: "set-dropdown",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		index: React.PropTypes.number.isRequired,
		sets: React.PropTypes.array.isRequired,
		value: React.PropTypes.string,
		choiceStore: React.PropTypes.instanceOf(ChoiceStore).isRequired,
		label: React.PropTypes.string,
	},
	handleChange: function (evt) {
		this.setValue(evt.target.value);
	},
	setValue: function (newValue) {
		this.props.dispatcher.dispatch({
			action: "choice",
			id: this.props.choiceStore.id(),
			index: this.props.index,
			value: newValue,
		});
	},
	randomize: function () {
		var sets = this.props.sets;
		// First entry is blank; we don't want that one
		var index = Math.floor(Math.random() * (sets.length - 1)) + 1;
		this.setValue( sets[index].name );
	},
	render: function () {
		var theReplacer = /^The /i;

		var contents = [
			React.createElement(
				"select",
				{
					className: "set-dropdown--select form-control",
					value: this.props.value,
					onChange: this.handleChange,
					key: "select",
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
			),
			React.createElement("button", {
				className: "btn btn-default",
				onClick: this.randomize,
				key: "button",
			}, React.createElement("span", { className: "glyphicon glyphicon-random" })),
		];

		if ( this.props.label ) {
			contents.unshift(this.props.label);
		}

		return React.createElement("div", { className: "set-dropdown" }, contents);
	},
});

module.exports = SetDropdown;
