"use strict";

var Dispatcher = require("flux/lib/Dispatcher");

var React = require("react");
var ReactDOM = require("react-dom");

var RouteStore = require("./stores/routeStore.js");
var SetStore = require("./stores/setStore.js");

var Menu = require("./pages/menu.js");
var Randomizer = require("./pages/randomizer.js");
var SelectBlocks = require("./pages/selectBlocks.js");

var Router = React.createClass({
	displayName: "router",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		routeStore: React.PropTypes.instanceOf(RouteStore).isRequired,
		setStore: React.PropTypes.instanceOf(SetStore).isRequired,
	},
	getInitialState: function () {
		return { location: "main-menu" };
	},
	componentDidMount: function () {
		this.props.routeStore.bind("location-change", this.locationChanged);
	},
	componentWillUnmount: function () {
		this.props.routeStore.unbind("location-change", this.locationChanged);
	},
	locationChanged: function (newLocation) {
		// Move back to top of page
		window.scrollTo(0,0);

		this.setState({ location: newLocation });
	},
	render: function () {
		var page;
		var { dispatcher, setStore } = this.props;

		switch ( this.state.location ) {
			case "randomizer":
				page = React.createElement(Randomizer, {
					setStore: setStore,
					dispatcher: dispatcher,
				});
				break;
			case "select-blocks":
				page = React.createElement(SelectBlocks, {
					setStore: setStore,
					dispatcher: dispatcher,
				});
				break;
			default:
				page = React.createElement(Menu, {
					dispatcher: dispatcher,
				});
		}

		return React.createElement("div", { className: "page" },
			React.createElement(
				"button",
				{
					className: "page--home-button btn btn-large",
					onClick: () => this.props.dispatcher.dispatch({ action: "location-change", location: "main-menu" }),
				},
				React.createElement("span", { className: "glyphicon glyphicon-home" })
			),
			React.createElement("img", {
				className: "page--logo",
				src: "images/mblogo.png",
			}),
			page
		);
	},
});

var dispatcher = new Dispatcher();

var routeStore = new RouteStore(dispatcher);

var setStore = new SetStore(require("./data/sets.json"));
setStore.registerDispatcher(dispatcher);

var rootElement = React.createElement(Router, {
	dispatcher,
	routeStore,
	setStore,
});

window.addEventListener("load", function () {
	ReactDOM.render(rootElement, document.getElementById("content"));
});
