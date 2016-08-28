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
		var self = this;
		var products = Object.keys(this.props.setStore.products)
			.sort()
			.map( function (product) { return { name: product, active: self.props.setStore.products[product] }; } );

		return { products };
	},
	componentDidMount: function () {
		this.props.setStore.bind("product-state-change", this.blockStateChanged);
	},
	componentWillUnmount: function () {
		this.props.setStore.unbind("product-state-change", this.blockStateChanged);
	},
	blockStateChanged: function (args) {
		// Clone state
		var products = JSON.parse(JSON.stringify( this.state.products ));

		products.some(function (product) {
			if ( product.name === args.product ) {
				product.active = args.state;
				return true;
			}
		});

		this.setState({ products });
	},
	render: function () {
		var self = this;
		var buttons = self.state.products.map(function (product) {
			var classes = [ "select-products--button btn btn-block btn-lg" ];
			var iconClasses = ["select-products--button-icon glyphicon"];

			if ( product.active ) {
				classes.push("btn-success");
				iconClasses.push("glyphicon-ok");
			} else {
				classes.push("btn-danger");
				iconClasses.push("glyphicon-remove");
			}

			return React.createElement(
				"button",
				{
					className: classes.join(" "),
					onClick: () => self.props.dispatcher.dispatch({
						action: "toggle-product-state",
						product: product.name,
						state: !product.active,
					}),
					key: product.name
				},
				React.createElement("span", { className: iconClasses.join(" ") }),
				" " + product.name
			);
		});

		return React.createElement("div", { className: "select-products" }, buttons );
	},
});

module.exports = SelectProducts;
