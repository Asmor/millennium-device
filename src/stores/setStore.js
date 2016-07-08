"use strict";

function SetStore(sets) {
	var setStore = this;
	this.blocks = {};
	this.types = {};

	sets.forEach(function (set) {
		var block = setStore.blocks[set.block] = setStore.blocks[set.block] || [];
		var type = setStore.types[set.type] = setStore.types[set.type] || [];

		block.push(set);
		type.push(set);
	});
}

module.exports = SetStore;
