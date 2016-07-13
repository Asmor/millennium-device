"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var PlayerStore = require("../stores/playerStore.js");

var PlayerControl = require("../components/PlayerControl.js");

var ScoreTracker = React.createClass({
	displayName: "score-tracker",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		playerStore: React.PropTypes.instanceOf(PlayerStore).isRequired,
	},
	// getInitialState: function () {
	// 	return this.generateState();
	// },
	// generateState: function () {
	// 	var { playerStore } = this.props;

	// 	return {
	// 		playerCount: playerStore.playerCount,
	// 		players: JSON.parse(JSON.stringify(playerStore.players)),
	// 		options: this.generateOptions(),
	// 		values: this.generateValues(),
	// 	};
	// },
	// updateState: function () {
	// 	this.setState(this.generateState());
	// },
	// componentDidMount: function () {
	// 	var { playerStore } = this.props;
	// 	playerStore.bind("player-count-change", this.updateState);
	// 	playerStore.bind("player-info-change", this.updateState);
	// 	playerStore.bind("players-reset", this.updateState);
	// },
	// componentWillUnmount: function () {
	// 	var { playerStore } = this.props;
	// 	playerStore.unbind("player-count-change", this.updateState);
	// 	playerStore.unbind("player-info-change", this.updateState);
	// 	playerStore.unbind("players-reset", this.updateState);
	// },
	// generateOptions: function () {
	// 	var { playerStore, setStore } = this.props;
	// 	var options = {
	// 		Characters: [],
	// 		Starters: [],
	// 	};

	// 	var usedCharacters = playerStore.players.map(player => player.Character);
	// 	var usedStarters = playerStore.players.map(player => player.Starter);
	// 	var availableCharacters = setStore.getAllowed("Character")
	// 		.map(character => character.name)
	// 		.filter( character => usedCharacters.indexOf(character) === -1 );
	// 	var availableStarters = setStore.getAllowed("Starter")
	// 		.map(starter => starter.name)
	// 		.filter( starter => usedStarters.indexOf(starter) === -1 );

	// 	for ( var i = 0; i < playerStore.playerCount; i++ ) {
	// 		let { Character, Starter } = playerStore.players[i];
	// 		options.Characters.push(availableCharacters.concat(Character));
	// 		options.Starters.push(availableStarters.concat(Starter));
	// 	}

	// 	return options;
	// },
	// generateValues: function () {
	// 	var { playerStore } = this.props;

	// 	return {
	// 		Characters: playerStore.players.map(player => player.Character),
	// 		Starters: playerStore.players.map(player => player.Starter),
	// 	};
	// },
	handleChange: function (evt) {
		var { dispatcher } = this.props;
		var index = evt.target.getAttribute("data-index");
		var round = evt.target.getAttribute("data-round");
		var phase = evt.target.getAttribute("data-phase");
		var value = evt.target.value;

		dispatcher.dispatch({
			action: "set-score",
			index, round, phase, value
		});

		// TODO: Figure out better way to update this
		this.forceUpdate();
	},
	generateHeaderRow: function (index) {
		var cells = [];

		cells.push(React.createElement("td", {
			key: "placeholder",
		}));
		this.props.playerStore.players.forEach(function (player, index) {
			cells.push(React.createElement("td", {
				className: "score-tracker--header-cell score-tracker--header-cell__name",
				key: index,
			}, player.name));
		});

		return React.createElement("tr", {
			className: "score-tracker--row score-tracker--row__last-of-section",
			key: index,
		}, cells);
	},
	generateDualRow: function (args) {
		var self = this;
		var { round, index, name, phase, suffix } = args;
		var { playerStore } = self.props;
		var criterionCells = [];
		var vpCells = [];
		let property = {
			tournament: "rp",
			collection: "size",
			money: "amount",
		}[phase];

		criterionCells.push(React.createElement("td", {
			className: "score-tracker--header-cell score-tracker--header-cell__label",
			key: "label",
		}, name));
		vpCells.push(React.createElement("td", {
			className: "score-tracker--header-cell score-tracker--header-cell__label",
			key: "label",
		}, "VP"));
		playerStore.players.forEach(function (player, index) {
			var value = player.scores[round][phase][property] || "";

			criterionCells.push(React.createElement(
				"td",
				{
					className: "score-tracker--cell score-tracker--cell__input",
					key: index,
				},
				React.createElement("input", {
					className: "form-control score-tracker--input",
					type: "number",
					pattern: "\\d*",
					value: value,
					onChange: self.handleChange,
					"data-index": index,
					"data-round": round,
					"data-phase": phase,
				})
			));

			vpCells.push(React.createElement("td", {
				className: "score-tracker--cell score-tracker--cell__display",
				key: index,
			}, player.scores[round][phase].vp ));
		});

		return [
			React.createElement(
				"tr",
				{
					key: index + "header",
				},
				React.createElement("td", {
					className: "score-tracker--section-header",
					colSpan: playerStore.playerCount + 1,
				}, round + " " + suffix)
			),
			React.createElement("tr", {
				className: "score-tracker--row",
				key: index + "criterion",
			}, criterionCells),
			React.createElement("tr", {
				className: "score-tracker--row score-tracker--row__last-of-section",
				key: index + "vp",
			}, vpCells),
		];
	},
	generateTournamentRow: function (args) {
		var { index, round } = args;

		return this.generateDualRow({
			index,
			round,
			name: "RP",
			phase: "tournament",
			suffix: "Tournament",
		});
	},
	generateCollectionRow: function (args) {
		var { index, round } = args;

		return this.generateDualRow({
			index,
			round,
			name: "Size",
			phase: "collection",
			suffix: "Collection",
		});
	},
	generateMoneyRow: function (args) {
		var { index, round } = args;

		return this.generateDualRow({
			index,
			round,
			name: "Money",
			phase: "money",
			suffix: "Money",
		});
	},
	generateFriendshipRow: function (args) {
		var cells = [];

		return React.createElement("tr", {}, cells);
	},
	render: function () {
		var self = this;
		var { dispatcher } = this.props;

		var tableRows = [
			{ round: "Header",      type: "header" },
			{ round: "Pre Release", type: "tournament" },
			{ round: "Round 1",     type: "collection" },
			{ round: "Round 1",     type: "tournament" },
			{ round: "Round 2",     type: "collection" },
			{ round: "Round 2",     type: "tournament" },
			{ round: "Round 3",     type: "collection" },
			{ round: "Round 3",     type: "tournament" },
			{ round: "Game End",    type: "money" },
			// { round: "Game End",    type: "friendship" },
		].reduce(function (previousRows, def, index) {
			var newRow;
			var { round, type } = def;

			switch (type) {
				case "header":
					newRow = self.generateHeaderRow(index);
					break;
				case "tournament":
					newRow = self.generateTournamentRow({index, round});
					break;
				case "collection":
					newRow = self.generateCollectionRow({index, round});
					break;
				case "money":
					newRow = self.generateMoneyRow({index, round});
					break;
				case "friendship":
					newRow = self.generateFriendshipRow({index, round});
					break;
			}

			return previousRows.concat(newRow);
		}, []);

		return React.createElement("div", { className: "score-tracker" },
			React.createElement("table", { className: "score-tracker--score-table" },
				React.createElement("tbody", { className: "score-tracker--score-table" }, tableRows)
				),
			React.createElement("div", { className: "score-tracker--buttons" },
				React.createElement("button", {
					className: "btn btn-danger",
					onClick: () => dispatcher.dispatch({ action: "reset-scores" }),
				}, React.createElement("span", { className: "glyphicon glyphicon-trash" }), " Reset scores")
			)
		);
	},
});

module.exports = ScoreTracker;
