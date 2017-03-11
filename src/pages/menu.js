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
					location: "presets",
				}),
			}, "Presets"),
			React.createElement("button", {
				className: "btn btn-primary btn-block btn-lg menu--button",
				onClick: () => this.props.dispatcher.dispatch({
					action: "location-change",
					location: "select-products",
				}),
			}, "Select products"),
			React.createElement("button", {
				className: "btn btn-primary btn-block btn-lg menu--button",
				onClick: () => this.props.dispatcher.dispatch({
					action: "location-change",
					location: "player-setup",
				}),
			}, "Player setup"),
			React.createElement("button", {
				className: "btn btn-primary btn-block btn-lg menu--button",
				onClick: () => this.props.dispatcher.dispatch({
					action: "location-change",
					location: "score-tracker",
				}),
			}, "Score tracker"),
			React.createElement("a", {
				className: "btn btn-info btn-block btn-lg menu--button",
				href: "https://boardgamegeek.com/blogpost/55856",
				target: "_blank",
			}, "Feedback & Updates")
		);
	},
});

module.exports = Menu;
