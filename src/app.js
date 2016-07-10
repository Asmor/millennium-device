"use strict";

var Dispatcher = require("flux/lib/Dispatcher");

var React = require("react");
var ReactDOM = require("react-dom");

var SetsPage = require("./components/setsPage.js");
var RouteStore = require("./stores/routeStore.js");

var Router = React.createClass({
	displayName: "router",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		routeStore: React.PropTypes.instanceOf(RouteStore).isRequired,
		sets: React.PropTypes.array.isRequired,
	},
	getInitialState: function () {
		return { location: "main-menu" };
	},
	componentDidMount: function () {
		this.props.routeStore.bind("location-change", this.locationChanged);
	},
	locationChanged: function (newLocation) {
		this.setState({ location: newLocation });
		console.log("Route changed to", newLocation);
	},
	render: function () {
		return React.createElement(SetsPage, {
			sets: this.props.sets,
			dispatcher: this.props.dispatcher,
		});
	},
});

var rootElement = React.createElement(Router, {
	sets: require("./data/sets.json"),
	dispatcher: new Dispatcher(),
	routeStore: new RouteStore(),
});

window.addEventListener("load", function () {
	ReactDOM.render(rootElement, document.getElementById("content"));
});
