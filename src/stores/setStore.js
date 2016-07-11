"use strict";

var microevent = require("microevent-github");

function SetStore(sets) {
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

	self.registerDispatcher = function (dispatcher) {
		dispatcher.register(function (payload) {
			if ( payload.action !== "toggle-block-state" ) {
				return;
			}

			var { block, state } = payload;

			self.blocks[block] = state;

			self.trigger("block-state-change", { block, state });
		});
	};
}

microevent.mixin(SetStore);

module.exports = SetStore;
