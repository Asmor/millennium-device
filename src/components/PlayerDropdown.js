"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var PlayerStore = require("../stores/PlayerStore.js");

var PlayerDropdown = React.createClass({
	displayName: "player-dropdown",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		index: React.PropTypes.number.isRequired,
		options: React.PropTypes.array.isRequired,
		property: React.PropTypes.string.isRequired,
		value: React.PropTypes.string,
	},
	handleChange: function (evt) {
		this.setValue(evt.target.value);
	},
	setValue: function (newValue) {
		var { index, property } = this.props;
		var args = {
			action: "set-player-info",
			index,
		};

		args[property] = newValue;

		this.props.dispatcher.dispatch(args);
	},
	randomize: function () {
		// remove blank option
		var options = this.props.options.filter(option => option);;
		var index = Math.floor(Math.random() * (options.length));
		this.setValue( options[index] );
	},
	render: function () {
		var theReplacer = /^The /i;

		var contents = [
			React.createElement(
				"select",
				{
					className: "player-dropdown--select form-control",
					value: this.props.value,
					onChange: this.handleChange,
					key: "select",
				},
				React.createElement("option", { value: ""}),
				this.props.options
					.sort(function (a, b) {
						var compA = a.replace(theReplacer, "").toLowerCase();
						var compB = b.replace(theReplacer, "").toLowerCase();
						return compA > compB ? 1 : -1;
					})
					.map(function (name) {
						return React.createElement("option", { value: name, key: name }, name);
					})
			),
			React.createElement("button", {
				className: "btn btn-default",
				onClick: this.randomize,
				key: "button",
			}, React.createElement("span", { className: "glyphicon glyphicon-random" })),
		];

		return React.createElement("div", { className: "player-dropdown" }, contents);
	},
});

module.exports = PlayerDropdown;
