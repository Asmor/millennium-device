"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");

var PlayerDropdown = require("../components/PlayerDropdown.js");
var PlayerStore = require("../stores/playerStore.js");
var SetStore = require("../stores/setStore.js");

var PlayerControl = React.createClass({
	displayName: "player-control",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher),
		playerStore: React.PropTypes.instanceOf(PlayerStore),
		setStore: React.PropTypes.instanceOf(SetStore),
		index: React.PropTypes.number.isRequired,
		options: React.PropTypes.object.isRequired,
		values: React.PropTypes.object.isRequired,
		name: React.PropTypes.string.isRequired,
	},
	// getInitialState: function () {},
	componentDidUpdate: function () {},
	componentWillUnmount: function () {},
	handleChange: function (evt) {
		this.setName(evt.target.value);
	},
	setName: function (newValue) {
		var { index } = this.props;
		this.props.dispatcher.dispatch({
			action: "set-player-info",
			name: newValue,
			index,
		});
	},
	render: function () {
		var {
			dispatcher,
			index,
			name,
			options,
			playerStore,
			setStore,
			values,
		} = this.props;

		var dropdowns = ["Character", "Starter"].map(property => React.createElement(
			"div",
			{
				className: "player-control--form-container",
				key: property,
			},
			React.createElement("div", { className: "player-control--header" }, property),
			React.createElement(PlayerDropdown, {
				dispatcher,
				index,
				property,
				playerStore,
				setStore,
				options: options[property],
				value: values[property],
			})
		));

		return React.createElement("div", { className: "player-control" },
			React.createElement("div", { className: "player-control--controls" },
				React.createElement("div", { className: "player-control--form-container" },
					React.createElement("div", { className: "player-control--header" }, "Player"),
					React.createElement("input", {
						className: "player-control--name-input form-control",
						onChange: this.handleChange,
						value: name,
					})
				),
				dropdowns
			)
		);
	},
});

module.exports = PlayerControl;
