"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var ChoiceStore = require("../stores/choiceStore.js");
var SetStore = require("../stores/setStore.js");
var SetChooser = require("../components/setChooser.js");

var Randomizer = React.createClass({
	displayName: "randomizer",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		setStore: React.PropTypes.instanceOf(SetStore).isRequired,
	},
	randomize: function () {
		Object.keys(this.refs).forEach(type => this.refs[type].randomize() );
	},
	render: function () {
		var { dispatcher, setStore } = this.props;

		var choiceStores = {
			Expansion: new ChoiceStore({ dispatcher, count: 5 }),
			Premium: new ChoiceStore({ dispatcher, count: 4 }),
			Master: new ChoiceStore({ dispatcher, count: 3 }),
			Bronze: new ChoiceStore({ dispatcher, count: 2 }),
			Silver: new ChoiceStore({ dispatcher, count: 2 }),
			Gold: new ChoiceStore({ dispatcher, count: 1 }),
		};
		var labels = {
			Bronze: ["Fusion", "Prize support"],
			Silver: ["Fusion", "Prize support"],
			Gold: ["Fusion"],
		};

		var setChoosers = {};

		Object.keys(choiceStores).forEach(function (type) {
			var choiceStore = choiceStores[type];

			setChoosers[type] = React.createElement(SetChooser, {
				dispatcher,
				choiceStore,
				setStore,
				options: setStore.types[type],
				header: type,
				key: type,
				ref: type,
				labels: labels[type],
			});
		});

		return React.createElement("div", { className: "randomizer" },
			React.createElement("div", { className: "randomizer--header" },
				React.createElement(
					"button",
					{
						className: "btn btn-primary randomizer--shuffle-button",
						onClick: this.randomize,
					},
					"Randomize All"
				)
			),
			React.createElement("div", { className: "randomizer--choosers" },
				Object.keys(setChoosers).map(key => setChoosers[key])
			)
		);
	},
});

module.exports = Randomizer;
