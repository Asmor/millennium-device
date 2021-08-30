"use strict";

var Dispatcher = require("flux/lib/Dispatcher");

var React = require("react");
var ReactDOM = require("react-dom");

var RouteStore = require("./stores/routeStore.js");
var PlayerStore = require("./stores/playerStore.js");
var SetStore = require("./stores/setStore.js");
var ChoiceStore = require("./stores/choiceStore.js");

var Menu = require("./pages/menu.js");
var PlayerSetup = require("./pages/playerSetup.js");
var Presets = require("./pages/presets.js");
var Randomizer = require("./pages/randomizer.js");
var ScoreTracker = require("./pages/scoreTracker.js");
var SelectProducts = require("./pages/selectProducts.js");

var Router = React.createClass({
	displayName: "router",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		routeStore: React.PropTypes.instanceOf(RouteStore).isRequired,
		playerStore: React.PropTypes.instanceOf(PlayerStore).isRequired,
		setStore: React.PropTypes.instanceOf(SetStore).isRequired,
		choiceStores: React.PropTypes.object,
	},
	getInitialState: function () {
		return { location: this.props.routeStore.location };
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
		var { dispatcher, playerStore, setStore, choiceStores } = this.props;

		switch ( this.state.location ) {
			case "randomizer":
				page = React.createElement(Randomizer, { dispatcher, setStore, choiceStores });
				break;
			case "presets":
				page = React.createElement(Presets, { dispatcher, setStore, choiceStores });
				break;
			case "select-products":
				page = React.createElement(SelectProducts, { dispatcher, setStore });
				break;
			case "player-setup":
				page = React.createElement(PlayerSetup, { dispatcher, playerStore, setStore });
				break;
			case "score-tracker":
				page = React.createElement(ScoreTracker, { dispatcher, playerStore });
				break;
			default:
				page = React.createElement(Menu, { dispatcher });
		}

		return React.createElement("div", { className: "page" },
			React.createElement(
				"button",
				{
					className: "page--home-button btn btn-default btn-large",
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
var setStore = new SetStore({
	dispatcher,
	sets: require("./data/sets.json"),
	products: require("./data/products.json"),
	presets: require("./data/presets.json")
});
var playerStore = new PlayerStore(dispatcher);
var choiceStores = {
	Expansion: new ChoiceStore({ dispatcher, count: 6 }),
	Premium: new ChoiceStore({ dispatcher, count: 5 }),
	Master: new ChoiceStore({ dispatcher, count: 4 }),
	Bronze: new ChoiceStore({ dispatcher, count: 2 }),
	Silver: new ChoiceStore({ dispatcher, count: 2 }),
	Gold: new ChoiceStore({ dispatcher, count: 1 }),
};


var rootElement = React.createElement(Router, {
	dispatcher,
	routeStore,
	playerStore,
	setStore,
	choiceStores,
});

window.addEventListener("load", function () {
	ReactDOM.render(rootElement, document.getElementById("content"));
});
