"use strict";

var microevent = require("microevent-github");

function RouteStore(dispatcher) {
	this.location = "main-menu";

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

		self.trigger("location-change", self.location);
	});
};

microevent.mixin(RouteStore);

module.exports = RouteStore;
