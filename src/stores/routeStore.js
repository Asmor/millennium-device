"use strict";

var microevent = require("microevent-github");

function RouteStore() {
	var self = this;

	self.location = "main-menu";

	self.registerDispatcher = function (dispatcher) {
		dispatcher.register(function (payload) {
			if ( payload.action !== "location-change" ) {
				return;
			}

			self.location = payload.location;

			self.trigger("location-change", self.location);
		});
	};
}

microevent.mixin(RouteStore);

module.exports = RouteStore;
