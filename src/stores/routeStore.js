"use strict";

var microevent = require("microevent-github");

var storageKey = "mba:route";

function RouteStore(dispatcher) {
	this.location = window.localStorage[storageKey] || "main-menu";
	console.log(this.location);

	if ( dispatcher ) {
		this.registerDispatcher(dispatcher);
	}
}
RouteStore.prototype.registerDispatcher = function (dispatcher) {
	var self = this;
	dispatcher.register(function (payload) {
		if ( payload.action !== "location-change" ) {
			return;
		}

		self.location = payload.location;

		window.localStorage[storageKey] = self.location;

		self.trigger("location-change", self.location);
	});
};

microevent.mixin(RouteStore);

module.exports = RouteStore;
