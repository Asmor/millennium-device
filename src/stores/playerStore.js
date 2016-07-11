"use strict";

var microevent = require("microevent-github");
var shuffle = require("../util.js").shuffle;

// Store as JSON to easily make new instances of this structure
var blankPlayerJson = JSON.stringify({
	name: "",
	starter: "",
	character: "",
	scores: {
		"Pre Release": {
			tournament: { rp: 0, vp: 0 }
		},
		"Round 1": {
			collection: { size: 0, vp: 0 },
			tournament: { rp: 0, vp: 0 }
		},
		"Round 2": {
			collection: { size: 0, vp: 0 },
			tournament: { rp: 0, vp: 0 }
		},
		"Round 3": {
			collection: { size: 0, vp: 0 },
			tournament: { rp: 0, vp: 0 }
		},
	},
});

var storageKey = "mba:players";

function PlayerStore(dispatcher) {
	this.playerCount = PlayerStore.maxPlayers;

	this.players = [];

	var loadedData = window.localStorage[storageKey];
	if ( loadedData ) {
		try {
			this.players = JSON.parse(loadedData);
			this.playerCount = this.players.length;
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
		players.push(JSON.parse(blankPlayerJson));
	}

	// If we have too many
	while ( players.length > count ) {
		players.pop();
	}
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
				["name", "starter", "character"].forEach(function (key) {
					var val = payload[key];
					if ( typeof val === "string" ) {
						player[key] = payload[key];
					}
				});

				self.trigger("player-info-change", {
					name: player.name,
					starter: player.starter,
					character: player.character,
				});
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

module.exports = PlayerStore;
