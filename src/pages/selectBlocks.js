"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var SetStore = require("../stores/setStore.js");

var SelectBlocks = React.createClass({
	displayName: "select-blocks",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher),
		setStore: React.PropTypes.instanceOf(SetStore),
	},
	getInitialState: function () {
		var self = this;
		var blocks = Object.keys(this.props.setStore.blocks)
			.sort()
			.map( function (block) { return { name: block, active: self.props.setStore.blocks[block] }; } );

		return { blocks };
	},
	componentDidMount: function () {
		this.props.setStore.bind("block-state-change", this.blockStateChanged);
	},
	componentWillUnmount: function () {
		this.props.setStore.unbind("block-state-change", this.blockStateChanged);
	},
	blockStateChanged: function (args) {
		// Clone state
		var blocks = JSON.parse(JSON.stringify( this.state.blocks ));

		blocks.some(function (block) {
			if ( block.name === args.block ) {
				block.active = args.state;
				return true;
			}
		});

		this.setState({ blocks });
	},
	render: function () {
		var self = this;
		var buttons = self.state.blocks.map(function (block) {
			var classes = [ "select-blocks--button btn btn-block btn-lg" ];
			var iconClasses = ["select-blocks--button-icon glyphicon"];

			if ( block.active ) {
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
						action: "toggle-block-state",
						block: block.name,
						state: !block.active,
					}),
					key: block.name
				},
				React.createElement("span", { className: iconClasses.join(" ") }),
				" " + block.name
			);
		});

		return React.createElement("div", { className: "select-blocks" }, buttons );
	},
});

module.exports = SelectBlocks;
