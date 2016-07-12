"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var PlayerStore = require("../stores/playerStore.js");
var SetStore = require("../stores/setStore.js");

var PlayerControl = require("../components/PlayerControl.js");

var PlayerSetup = React.createClass({
	displayName: "player-setup",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		playerStore: React.PropTypes.instanceOf(PlayerStore).isRequired,
		setStore: React.PropTypes.instanceOf(SetStore).isRequired,
	},
	getInitialState: function () {
		var state = this.copyState();

		state.options = this.generateOptions();

		return state;
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
	generateOptions: function () {
		var { playerStore, setStore } = this.props;
		var options = {
			Characters: [],
			Starters: [],
		};

		for ( var i = 0; i < playerStore.playerCount; i++ ) {
			options.Characters.push(setStore.getAllowed("Character").map(character => character.name));
			options.Starters.push(setStore.getAllowed("Starter").map(character => character.name));
		}

		return options;
	},
	playerCountChanged: function (newCount) {
		this.setState({ playerCount: newCount });
	},
	render: function () {
		var { dispatcher, playerStore, setStore } = this.props;
		var { minPlayers, maxPlayers } = PlayerStore;
		var countButtons = [];
		var playerControls = [];
		var buttonClasses;
		var i;

		for ( i = minPlayers; i <= maxPlayers; i++ ) {
			buttonClasses = [ "player-setup--count-button btn" ];

			if ( i === playerStore.playerCount ) {
				buttonClasses.push("btn-success");
			} else {
				buttonClasses.push("btn-default");
			}

			countButtons.push(React.createElement("button", {
				className: buttonClasses.join(" "),
				key: i,
				onClick: dispatcher.dispatch.bind(dispatcher, { action: "set-player-count", count: i }),
			}, i));
		}

		for ( i = 0; i < playerStore.playerCount; i++ ) {
			playerControls.push(React.createElement(PlayerControl, {
				dispatcher,
				playerStore,
				setStore,
				index: i,
				key: i,
				options: {
					Character: this.state.options.Characters[i],
					Starter: this.state.options.Starters[i],
				},
				values: { Character: "", Starter: "" },
			}));
		}

		return React.createElement("div", { className: "player-setup" },
			React.createElement("div", { className: "player-setup--buttons" },
				React.createElement("div", { className: "player-setup--count-buttons btn-group" }, countButtons)
			),
			React.createElement("div", { className: "player-setup--players" }, playerControls)
		);
	},
});

module.exports = PlayerSetup;
