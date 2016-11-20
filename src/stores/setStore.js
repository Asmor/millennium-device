"use strict";

var microevent = require("microevent-github");
var storageKey = "mba:excluded-products";
var separator = "|";

function SetStore(args) {
	var { sets, dispatcher, products, presets } = args;
	var self = this;
	self.byProduct = {};
	self.products = {};
	self.types = {};
	self.presets = presets;
	window.setStore = self;

	products.forEach(function (product) {
		self.products[product.pid] = product;
		product.active = true;
		product.sets = [];
	});

	sets.forEach(function (set) {
		var product = self.products[set.pid];
		var type = self.types[set.type] = self.types[set.type] || [];

		product.sets.push(set);
		type.push(set);
	});

	var excluded = window.localStorage[storageKey] || "";

	excluded.split(separator).forEach(function (pid) {
		if ( self.products[pid] ) {
			self.products[pid].active = false;
		}
	});

	if ( dispatcher ) {
		self.registerDispatcher(dispatcher);
	}
}
SetStore.prototype.registerDispatcher = function (dispatcher) {
	var self = this;
	dispatcher.register(function (payload) {
		if ( payload.action !== "toggle-product-state" ) {
			return;
		}

		var { pid, state } = payload;

		self.products[pid].active = state;

		self.trigger("product-state-change", { pid, state });
		window.localStorage[storageKey] = Object.keys(self.products)
			.filter( key => !self.products[key].active )
			.join(separator);
	});
};
SetStore.prototype.getAllowed = function (type) {
	return this.types[type].filter( set => this.products[set.pid].active );
};
SetStore.prototype.getPresets = function () {
	var self = this;
	return this.presets.filter(function (preset) {
		return preset.requires.every(requirement => self.products[requirement] && self.products[requirement].active);
	});
};

microevent.mixin(SetStore);

module.exports = SetStore;
