"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");

var Menu = React.createClass({
	displayName: "menu",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher),
	},
	render: function () {
		return React.createElement("div", { className: "menu" },
			React.createElement("button", {
				className: "btn btn-primary btn-block btn-lg menu--button",
				onClick: () => this.props.dispatcher.dispatch({
					action: "location-change",
					location: "randomizer",
				}),
			}, "Randomizer"),
			React.createElement("button", {
				className: "btn btn-primary btn-block btn-lg menu--button",
				onClick: () => this.props.dispatcher.dispatch({
					action: "location-change",
					location: "select-blocks",
				}),
			}, "Select blocks"),
			React.createElement("button", {
				className: "btn btn-primary btn-block btn-lg disabled menu--button",
				title: "Not yet implemented",
				// onClick: () => this.props.dispatcher.dispatch({
				// 	action: "location-change",
				// 	location: "randomizer",
				// }),
			}, "Score tracker"),
			React.createElement("button", {
				className: "btn btn-primary btn-block btn-lg disabled menu--button",
				title: "Not yet implemented",
				// onClick: () => this.props.dispatcher.dispatch({
				// 	action: "location-change",
				// 	location: "randomizer",
				// }),
			}, "Player setup")
		);
	},
});

module.exports = Menu;
