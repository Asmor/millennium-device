"use strict";

var uuid = require("node-uuid");
var microevent = require("microevent-github");

function ChoiceStore(count) {
	var choices = new Array(count);
	var id = uuid.v4();
	var self = this;

	self.get = function(index) {
		if ( index >= count ) {
			throw "Index out of bounds";
		}

		return choices[index];
	};

	self.size = function () { return count; };

	self.id = function () { return id; };

	self.complement = function (options) {
		// Returns all elements from options which are not in choices. Will try to get option.name
		// first
		return options.filter(function (option) {
			return choices.every( choice => choice !== (option.name || option) );
		});
	};

	self.registerDispatcher = function (dispatcher) {
		dispatcher.register(function (payload) {
			if ( payload.action !== "choice" ) {
				return;
			}

			var { index, value } = payload;

			if ( payload.id === id ) {
				choices[payload.index] = payload.value;

				self.trigger("update", { index, value });
			}
		});
	};
}

microevent.mixin(ChoiceStore);

module.exports = ChoiceStore;
