"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");

var SetsPage = React.createClass({
	displayName: "sets-page",
	propTypes: {
		sets: React.PropTypes.array.isRequired,
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
	},
	randomize: function () {
		Object.keys(this.refs).forEach(type => this.refs[type].randomize() );
	},
	render: function () {
		var dispatcher = this.props.dispatcher;
		var SetStore = require("../stores/setStore.js");
		var ChoiceStore = require("../stores/choiceStore.js");

		var SetChooser = require("../components/setChooser.js");

		var setsStore = new SetStore(this.props.sets);
		var choiceStores = {
			Expansion: new ChoiceStore(5),
			Premium: new ChoiceStore(4),
			Master: new ChoiceStore(3),
			Bronze: new ChoiceStore(2),
			Silver: new ChoiceStore(2),
			Gold: new ChoiceStore(1),
		};
		var labels = {
			Bronze: ["Fusion", "Prize support"],
			Silver: ["Fusion", "Prize support"],
			Gold: ["Fusion"],
		};

		var setChoosers = {};

		Object.keys(choiceStores).forEach(function (type) {
			var choiceStore = choiceStores[type];

			choiceStore.registerDispatcher(dispatcher);

			setChoosers[type] = React.createElement(SetChooser, {
				dispatcher: dispatcher,
				choiceStore: choiceStore,
				options: setsStore.types[type],
				header: type,
				key: type,
				ref: type,
				labels: labels[type],
			});
		});

		return React.createElement("div", { className: "sets-page" },
			React.createElement("div", { className: "sets-page--header" },
				React.createElement("img", {
					className: "sets-page--logo",
					src: "images/mblogo.png",
				}),
				React.createElement("br"),
				React.createElement(
					"button",
					{
						className: "btn btn-primary sets-page--shuffle-button",
						onClick: this.randomize,
					},
					"Randomize All"
				)
			),
			React.createElement("div", { className: "sets-page--choosers" },
				Object.keys(setChoosers).map(key => setChoosers[key])
			)
		);
	},
});

module.exports = SetsPage;
