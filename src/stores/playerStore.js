"use strict";

var PLAYER_VERSION = 1;

var microevent = require("microevent-github");
var shuffle = require("../util.js").shuffle;

// Store as JSON to easily make new instances of this structure
var blankPlayerJson = JSON.stringify({
	version: PLAYER_VERSION,
	name: "",
	Starter: "",
	Character: "",
	scores: {
		"Pre Release": {
			tournament: { rp: 0, vp: 0 },
		},
		"Round 1": {
			collection: { size: 0, vp: 0 },
			tournament: { rp: 0, vp: 0 },
		},
		"Round 2": {
			collection: { size: 0, vp: 0 },
			tournament: { rp: 0, vp: 0 },
		},
		"Round 3": {
			collection: { size: 0, vp: 0 },
			tournament: { rp: 0, vp: 0 },
		},
		"Game End": {
			money: { amount: 0, vp: 0 },
			friendship: 0,
		}
	},
	total: 0,
});

var storageKey = "mba:players";

function PlayerStore(dispatcher) {
	this.playerCount = 5;

	this.players = [];

	var loadedData = window.localStorage[storageKey];
	if ( loadedData ) {
		try {
			let parsedData = JSON.parse(loadedData);

			if ( parsedData[0].version !== PLAYER_VERSION ) {
				// Saved players are of different version
				this.initializePlayers();
			} else {
				this.players = JSON.parse(loadedData);
				this.playerCount = this.players.length;
			}
		} catch (ex) {
			this.initializePlayers();
		}
	} else {
		this.initializePlayers();
	}

	if ( dispatcher ) {
		this.registerDispatcher(dispatcher);
	}
}
PlayerStore.prototype.initializePlayers = function () {
	this.players = [];
	this.populatePlayers();
};
PlayerStore.prototype.populatePlayers = function () {
	var players = this.players;
	var count = this.playerCount;

	// If we don't have enough
	while ( players.length < count ) {
		let newPlayer = JSON.parse(blankPlayerJson);
		newPlayer.name = "Player " + (players.length + 1);
		players.push(newPlayer);
	}

	// If we have too many
	while ( players.length > count ) {
		players.pop();
	}
};
PlayerStore.prototype.resetPlayers = function () {
	this.players.length = 0;
	this.populatePlayers();
};
PlayerStore.prototype.resetScores = function () {
	this.players.forEach(function (player) {
		Object.keys(player.scores).forEach(function (name) {
			var round = player.scores[name];
			
			Object.keys(round).forEach(function (phase) {
				if ( typeof round[phase].rp === "number" ) {
					// Tournament
					round[phase].rp = 0;
				} else if ( typeof round[phase].size === "number" ) {
					// Collection
					round[phase].size = 0;
				} else if ( typeof round[phase].amount === "number" ) {
					// Money
					round[phase].amount = 0;
				} else {
					// Friendship
					round[phase] = 0;
				}
			});
		});
	});

	this.calculateScores();
};
PlayerStore.prototype.shufflePlayers = function () {
	this.players = shuffle(this.players);
};
PlayerStore.prototype.calculateScores = function () {
	var players = this.players;
	[ "Pre Release", "Round 1", "Round 2", "Round 3" ].forEach((round) => scoreTournament({ round, players }));
	[ "Round 1", "Round 2", "Round 3" ].forEach(function (round) {
		players.forEach(function (player) {
			var collection = player.scores[round].collection;
			var size = Math.min(PlayerStore.maxCollectionSize, collection.size);

			collection.vp = PlayerStore.collectionVP[size];
		});
	});

	players.forEach(function (player) {
		player.scores["Game End"].money.vp = Math.floor(player.scores["Game End"].money.amount / 4);
		
		player.total = Object.keys(player.scores).reduce(function (sum, name) {
			var round = player.scores[name];
			return sum + Object.keys(round).reduce(function (sum, phase) {
				var score = round[phase];

				score = score || 0;
				if ( typeof score === "number" ) {
					return sum + score;
				} else {
					return sum + score.vp;
				}
			}, 0);
		}, 0);
	});
};
PlayerStore.prototype.registerDispatcher = function (dispatcher) {
	var self = this;
	dispatcher.register(function (payload) {
		var { action } = payload;
		var player;

		switch ( action ) {
			case "set-player-count":
				self.playerCount = payload.count;

				self.populatePlayers();

				self.trigger("player-count-change", self.playerCount);
				break;

			case "set-player-info":
				player = self.players[payload.index];
				// Only update the properties that are actually set
				["name", "Starter", "Character"].forEach(function (key) {
					var val = payload[key];
					if ( typeof val === "string" ) {
						player[key] = payload[key];
					}
				});

				self.trigger("player-info-change", {
					index: payload.index,
					name: player.name,
					Starter: player.Starter,
					Character: player.Character,
				});
				break;
			case "reset-players":
				self.resetPlayers();

				self.trigger("players-reset");
				break;
			case "reset-scores":
				self.resetScores();

				self.trigger("score-reset");
				break;
			case "shuffle-players":
				self.shufflePlayers();

				self.trigger("players-reset");
				break;
			case "set-score":
				let { index, round, phase, value } = payload;
				let playerRound = self.players[index].scores[round];

				value = Number.parseInt(value) || 0;

				if ( phase === "friendship" ) {
					playerRound.friendship = value;
				} else {
					let property = {
						tournament: "rp",
						collection: "size",
						money: "amount",
					}[phase];

					playerRound[phase][property] = value;
				}

				self.calculateScores();

				self.trigger("score-set");
				break;
		}

		window.localStorage[storageKey] = JSON.stringify(self.players);
	});
};

PlayerStore.maxCollectionSize = 8;
// 0 and 1 card-collections are worth no VP
PlayerStore.collectionVP = [0, 0, 2, 4, 7, 9, 12, 16, 21];
PlayerStore.tournamentPlaces = ["1st", "2nd", "3rd", "4th", "5th"];
PlayerStore.tournamentVP = {
	"Pre Release": [7, 5, 4, 3, 2],
	"Round 1": [21, 15, 12, 9, 6],
	"Round 2": [28, 20, 16, 12, 8],
	"Round 3": [42, 30, 24, 18, 12],
};
PlayerStore.rounds = [
	{ name: "Pre Release", optional: true, default: true },
	{ name: "Round 1" },
	{ name: "Round 2" },
	{ name: "Round 3", optional: true, default: false },
];
PlayerStore.minPlayers = 2;
PlayerStore.maxPlayers = 5;

microevent.mixin(PlayerStore);

function scoreTournament(args) {
	var { round, players } = args;

	var references = players.map(function (player) {
		return { score: player.scores[round].tournament.rp, player };
	}).sort((a, b) => b.score - a.score);

	if ( references[0].score === 0 ) {
		// Don't assign points if nobody has a score yet
		players.forEach(player => player.scores[round].tournament.vp = 0);
		return;
	}

	var awards = PlayerStore.tournamentVP[round].slice(0, references.length);

	var lastScore = references[0].score;
	var tieStart = 0;
	var tieLength = 1;
	var tieSum = 0;
	var tiePer = 0;
	var i, j;

	for ( i = 1; i < references.length; i++ ) {
		if ( references[i].score === lastScore ) {
			// This score ties the previous score
			tieLength++;
		} else {
			// The current score is lower than previous score, so check if we had a tie and if so adjust awards appropriately

			// Ties are scored by adding the VP and splitting them, rounded down. So adjust the awards for all tied spaces
			if ( tieLength > 1 ) {
				tieSum = awards.slice(tieStart, tieStart + tieLength).reduce((total, next) => total + next, 0);
				tiePer = Math.floor(tieSum / tieLength);

				for ( j = tieStart; j < tieStart + tieLength; j++ ) {
					awards[j] = tiePer;
				}
			}

			// Reset in case there's another tie
			tieStart = i;
			tieLength = 1;
		}

		lastScore = references[i].score;
	}

	// Need to check one more time in case last one was tied
	if ( tieLength > 1 ) {
		tieSum = awards.slice(tieStart, tieStart + tieLength).reduce((total, next) => total + next, 0);
		tiePer = Math.floor(tieSum / tieLength);

		for ( j = tieStart; j < tieStart + tieLength; j++ ) {
			awards[j] = tiePer;
		}
	}

	for ( i = 0; i < references.length; i++ ) {
		references[i].player.scores[round].tournament.vp = awards[i];
	}
}

module.exports = PlayerStore;
