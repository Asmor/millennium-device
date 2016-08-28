"use strict";

var microevent = require("microevent-github");
var storageKey = "mba:excluded-products";
var separator = "|";

function SetStore(args) {
	var { sets, dispatcher } = args;
	var self = this;
	self.byProduct = {};
	self.products = {};
	self.types = {};

	sets.forEach(function (set) {
		self.products[set.product] = true;
		var product = self.byProduct[set.product] = self.byProduct[set.product] || [];
		var type = self.types[set.type] = self.types[set.type] || [];

		product.push(set);
		type.push(set);
	});

	var excluded = window.localStorage[storageKey] || "";

	excluded.split(separator).forEach(function (set) {
		// Probably overkill, but we only need to toggle off things that are already on and this
		// protects us from corrupted data adding erroneous products
		if ( self.products[set] ) {
			self.products[set] = false;
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

		var { product, state } = payload;

		self.products[product] = state;

		self.trigger("product-state-change", { product, state });
		window.localStorage[storageKey] = Object.keys(self.products)
			.filter( key => !self.products[key] )
			.join(separator);
	});
};
SetStore.prototype.getAllowed = function (type) {
	return this.types[type].filter( set => this.products[set.product] );
};

microevent.mixin(SetStore);

module.exports = SetStore;
