"use strict";

var microevent = require("microevent-github");
var storageKey = "mba:excluded-blocks";
var separator = "|";

function SetStore(args) {
	var { sets, dispatcher } = args;
	var self = this;
	self.byBlock = {};
	self.blocks = {};
	self.types = {};

	sets.forEach(function (set) {
		self.blocks[set.block] = true;
		var block = self.byBlock[set.block] = self.byBlock[set.block] || [];
		var type = self.types[set.type] = self.types[set.type] || [];

		block.push(set);
		type.push(set);
	});

	var excluded = window.localStorage[storageKey] || "";

	excluded.split(separator).forEach(function (set) {
		// Probably overkill, but we only need to toggle off things that are already on and this
		// protects us from corrupted data adding erroneous blocks
		if ( self.blocks[set] ) {
			self.blocks[set] = false;
		}
	});

	if ( dispatcher ) {
		self.registerDispatcher(dispatcher);
	}
}
SetStore.prototype.registerDispatcher = function (dispatcher) {
	var self = this;
	dispatcher.register(function (payload) {
		if ( payload.action !== "toggle-block-state" ) {
			return;
		}

		var { block, state } = payload;

		self.blocks[block] = state;

		self.trigger("block-state-change", { block, state });
		window.localStorage[storageKey] = Object.keys(self.blocks)
			.filter( key => !self.blocks[key] )
			.join(separator);
	});
};

microevent.mixin(SetStore);

module.exports = SetStore;
