"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var SetStore = require("../stores/setStore.js");

var SelectProducts = React.createClass({
	displayName: "select-products",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher),
		setStore: React.PropTypes.instanceOf(SetStore),
	},
	getInitialState: function () {
		var presets = this.props.setStore.getPresets();

		return { presets };
	},
	componentDidMount: function () {
		this.props.setStore.bind("product-state-change", this.blockStateChanged);
	},
	componentWillUnmount: function () {
		this.props.setStore.unbind("product-state-change", this.blockStateChanged);
	},
	blockStateChanged: function () {
		// Clone state
		var presets = this.props.setStore.getPresets();

		this.setState({ presets });
	},
	render: function () {
		var self = this;

		var presetElements = self.state.presets.map(function (preset, index) {
			var listContents = [
				// Name
				React.createElement("li", { key: "name", className: "presets--preset-name" }, preset.name),

				// Player count
				React.createElement("li", { key: "player-count", className: "presets--player-count" }, "Recommended players: ", preset.recommendedPlayers),

				// Description
				React.createElement("li", { key: "description", className: "presets--description" }, preset.description),

				// Expansion list
				React.createElement("li", { key: "expansion-header", className: "presets--set-list-header presets--set-list-header__expansion" }, "Expansion"),
				React.createElement("ul", { key: "expansion-list", className: "presets--set-list presets--set-list__expansion" },
					preset.expansion.map(function (expansion, index) {
						return React.createElement("li", { className: "presets--set presets--set__expansion", key: index }, expansion);
					})
				),

				// Premium list
				React.createElement("li", { key: "premium-header", className: "presets--set-list-header presets--set-list-header__premium" }, "Premium"),
				React.createElement("ul", { key: "premium-list", className: "presets--set-list presets--set-list__premium" },
					preset.premium.map(function (premium, index) {
						return React.createElement("li", { className: "presets--set presets--set__premium", key: index }, premium);
					})
				),

				// Master list
				React.createElement("li", { key: "master-header", className: "presets--set-list-header presets--set-list-header__master" }, "Master"),
				React.createElement("ul", { key: "master-list", className: "presets--set-list presets--set-list__master" },
					preset.master.map(function (master, index) {
						return React.createElement("li", { className: "presets--set presets--set__master", key: index }, master);
					}
				)),
			];

			// Fusion list
			if (preset.fusion) {
				listContents.push(
					React.createElement("li", { key: "fusion-header", className: "presets--set-list-header presets--set-list-header__fusion" }, "Fusion"),
					React.createElement("ul", { key: "fusion-list", className: "presets--set-list presets--set-list__fusion" },
						React.createElement("li", { className: "presets--set presets--set__fusion presets--set__bronze" }, "Bronze: " + preset.fusion.bronze),
						React.createElement("li", { className: "presets--set presets--set__fusion presets--set__silver" }, "Silver: " + preset.fusion.silver),
						React.createElement("li", { className: "presets--set presets--set__fusion presets--set__gold" }, "Gold: " + preset.fusion.gold)
					)
				);
			}

			if ( preset.prize ) {
				listContents.push(
					// Prize list
					React.createElement("li", { key: "prize-header", className: "presets--set-list-header presets--set-list-header__prize" }, "Prize Support"),
					React.createElement("ul", { key: "prize-list", className: "presets--set-list presets--set-list__prize" },
						React.createElement("li", { className: "presets--set presets--set__prize presets--set__bronze" }, "Bronze: " + preset.prize.bronze),
						React.createElement("li", { className: "presets--set presets--set__prize presets--set__silver" }, "Silver: " + preset.prize.silver)
					)
				);
			}

			return React.createElement("ul", { className: "presets--list", key: index }, listContents);
		});

		return React.createElement("div", { className: "presets" }, presetElements);

		// TODO: CP Below
		var buttons = self.state.products.map(function (product) {
			var classes = [ "select-products--button" ];

			if ( product.active ) {
				classes.push("select-products--button__active");
			} else {
				classes.push("select-products--button__inactive");
			}

			return React.createElement(
				"button",
				{
					className: classes.join(" "),
					onClick: () => self.props.dispatcher.dispatch({
						action: "toggle-product-state",
						pid: product.pid,
						state: !product.active,
					}),
					key: product.name
				},
				React.createElement("img", { src: product.image })
			);
		});

		return React.createElement("div", { className: "select-products" }, buttons );
	},
});

module.exports = SelectProducts;
