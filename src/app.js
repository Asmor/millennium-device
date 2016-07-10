"use strict";

var Dispatcher = require("flux/lib/Dispatcher");

var React = require("react");
var ReactDOM = require("react-dom");

var RouteStore = require("./stores/routeStore.js");

var Menu = require("./pages/menu.js");
var SetsPage = require("./pages/setsPage.js");

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
	},
	render: function () {
		var page;
		if ( this.state.location === "randomizer" ) {
			page = React.createElement(SetsPage, {
				sets: this.props.sets,
				dispatcher: this.props.dispatcher,
			});
		} else {
			page = React.createElement(Menu, {
				dispatcher: this.props.dispatcher,
			});
		}

		return React.createElement("div", { className: "page" },
			React.createElement("img", {
				className: "page--logo",
				src: "images/mblogo.png",
				onClick: () => this.props.dispatcher.dispatch({ action: "location-change", location: "main-menu" }),
			}),
			page
		);
	},
});

var dispatcher = new Dispatcher();
var routeStore = new RouteStore();
routeStore.registerDispatcher(dispatcher);

var rootElement = React.createElement(Router, {
	sets: require("./data/sets.json"),
	dispatcher,
	routeStore,
});

window.addEventListener("load", function () {
	ReactDOM.render(rootElement, document.getElementById("content"));
});
