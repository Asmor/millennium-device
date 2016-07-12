"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");

var PlayerDropdown = require("../components/PlayerDropdown.js");

var PlayerControl = React.createClass({
	displayName: "player-control",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher),
	},
	// getInitialState: function () {},
	componentDidUpdate: function () {},
	componentWillUnmount: function () {},
	render: function () {
		return React.createElement("div", { className: "player-control" },
			React.createElement("div", { className: "player-control--controls" },
				React.createElement("div", { className: "player-control--form-container" },
					React.createElement("div", { className: "player-control--header" }, "Player"),
					React.createElement("input", {
						className: "player-control--name-input form-control"
					})
				),
				React.createElement("div", { className: "player-control--form-container" },
					React.createElement("div", { className: "player-control--header" }, "Character"),
					React.createElement(PlayerDropdown, {})
				),
				React.createElement("div", { className: "player-control--form-container" },
					React.createElement("div", { className: "player-control--header" }, "Starter"),
					React.createElement(PlayerDropdown, {})
				)
			)
		);
	},
});

module.exports = PlayerControl;
