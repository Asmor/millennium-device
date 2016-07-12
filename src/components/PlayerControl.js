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
	},
	// getInitialState: function () {},
	componentDidUpdate: function () {},
	componentWillUnmount: function () {},
	render: function () {
		var { dispatcher, index, options, values, playerStore, setStore } = this.props;

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
						className: "player-control--name-input form-control"
					})
				),
				dropdowns
			)
		);
	},
});

module.exports = PlayerControl;
