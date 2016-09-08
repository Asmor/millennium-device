"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var ChoiceStore = require("../stores/choiceStore.js");
var SetStore = require("../stores/setStore.js");
var SetDropdown = require("./setDropdown.js");
var { shuffle } = require("../util.js");

var SetChooser = React.createClass({
	displayName: "set-chooser",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		choiceStore: React.PropTypes.instanceOf(ChoiceStore).isRequired,
		setStore: React.PropTypes.instanceOf(SetStore).isRequired,
		options: React.PropTypes.array.isRequired,
		header: React.PropTypes.string.isRequired,
		label: React.PropTypes.array,
	},
	getInitialState: function () {
		return {
			options: this.generateOptions()
		};
	},
	componentDidMount: function () {
		this.props.choiceStore.bind("update", this.choicesChanged);
		this.props.setStore.bind("product-state-change", this.choicesChanged);
	},
	componentWillUnmount: function () {
		this.props.choiceStore.unbind("update", this.choicesChanged);
		this.props.setStore.unbind("product-state-change", this.choicesChanged);
	},
	choicesChanged: function () {
		this.setState({ options: this.generateOptions() });
	},
	generateOptions: function () {
		// clone state stuff so so we don't mutate it
		var choiceStore = this.props.choiceStore;
		var complement = choiceStore.complement(this.props.options)
			.filter(set => this.props.setStore.products[set.product]);
		var options = [];
		var size = choiceStore.size();
		var currentValue;

		for ( var i = 0; i < size; i++ ) {
			currentValue = choiceStore.get(i);
			if ( currentValue ) {
				options[i] = complement.concat({ name: currentValue });
			} else {
				options[i] = complement;
			}
		}

		return options;
	},
	randomize: function () {
		var count = this.props.choiceStore.size();
		var id = this.props.choiceStore.id();
		var sets = this.props.options
			.filter(set => this.props.setStore.products[set.product])
			.map(o => o.name);
		var selected = shuffle(sets).slice(0, count);

		// If this category has labels, the order is important so don't sort
		if ( !this.props.labels ) {
			selected.sort();
		}

		// If there aren't enough sets in the chosen products, pad out the extra choices with blanks
		while ( selected.length < count ) {
			selected.push(" ");
		}

		selected.forEach(
			(value, index) => this.props.dispatcher.dispatch({ action: "choice", id, index, value })
		);
	},
	render: function () {
		var {choiceStore, header, labels} = this.props;
		var dropdowns = [];
		var size = choiceStore.size();
		var currentValue;
		var props;
		var headerClass = "set-chooser--header set-chooser--header__" + header.toLowerCase();
		console.log(headerClass);

		for ( var i = 0; i < size; i++ ) {
			currentValue = choiceStore.get(i) || "";

			props = {
				dispatcher: this.props.dispatcher,
				index: i,
				choiceStore: choiceStore,
				value: currentValue,
				sets: this.state.options[i],
				key: i,
			};

			if ( labels ) {
				props.label = labels[i];
			}

			dropdowns.push(React.createElement(SetDropdown, props));
		}

		return React.createElement("div", { className: "set-chooser" },
			React.createElement("h3", { className: headerClass, key: header }, header,
				React.createElement(
					"button",
					{
						className: "btn btn-default set-chooser--shuffle-button",
						onClick: this.randomize,
					},
					React.createElement("span", { className: "glyphicon glyphicon-random" }),
					" all " + header
				)
			),
			dropdowns
		);
	},
});

module.exports = SetChooser;
