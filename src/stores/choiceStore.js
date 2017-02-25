"use strict";

var uuid = require("node-uuid");
var microevent = require("microevent-github");

function ChoiceStore(args) {
	var { dispatcher, count } = args;
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

	self.allowedActions = {
		"choice": function ({ index, value }) {
			choices[index] = value;
		},
		"change-choice-store-size": function ({ value }) {
			if ( value < 1 ) {
				value = 1;
			}

			if ( value > 20 ) {
				value = 20;
			}
			console.log("Bad times");
			console.log(value);
			count = value;
			choices.length = value;
		},
		"adjust-choice-store-size": function ({ amount }) {
			console.log("Woooeee");
			var value = count + amount;
			console.log(arguments, value);
			self.allowedActions["change-choice-store-size"]({ value });
		},
	};

	self.registerDispatcher = function (dispatcher) {
		dispatcher.register(function (payload) {
			if ( payload.id !== id ) {
				return;
			}

			var action = self.allowedActions[payload.action];
			if ( !action ) {
				return;
			}

			action(payload);

			self.trigger("update");
		});
	};

	if ( dispatcher ) {
		self.registerDispatcher(dispatcher);
	}
}

microevent.mixin(ChoiceStore);

module.exports = ChoiceStore;
