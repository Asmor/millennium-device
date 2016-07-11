"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var PlayerStore = require("../stores/playerStore.js");

var PlayerSetup = React.createClass({
	displayName: "player-setup",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		playerStore: React.PropTypes.instanceOf(PlayerStore).isRequired,
	},
	getInitialState: function () {
		return this.copyState();
	},
	copyState: function () {
		var { playerStore } = this.props;
		return {
			playerCount: playerStore.playerCount,
			players: JSON.parse(JSON.stringify(playerStore.players))
		};
	},
	componentDidMount: function () {
		var { playerStore } = this.props;
		playerStore.bind("player-count-change", this.playerCountChanged);
	},
	componentWillUnmount: function () {
		// TODO
	},
	playerCountChanged: function (newCount) {
		this.setState({ playerCount: newCount });
	},
	render: function () {
		var { dispatcher, playerStore } = this.props;
		var { minPlayers, maxPlayers } = PlayerStore;
		var countButtons = [];
		var buttonClasses;

		for ( var i = minPlayers; i <= maxPlayers; i++ ) {
			buttonClasses = [ "player-setup--count-button btn" ];

			if ( i === playerStore.playerCount ) {
				buttonClasses.push("btn-default disabled");
			} else {
				buttonClasses.push("btn-default");
			}

			countButtons.push(React.createElement("button", {
				className: buttonClasses.join(" "),
				key: i,
				onClick: dispatcher.dispatch.bind(dispatcher, { action: "set-player-count", count: i }),
			}, i));
		}

		return React.createElement("div", { className: "player-setup" },
			React.createElement("div", { className: "player-setup--buttons" },
				React.createElement("div", { className: "player-setup--count-buttons btn-group" }, countButtons)
			)
		);
	},
});

module.exports = PlayerSetup;
