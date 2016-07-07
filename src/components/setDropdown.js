var React = require("react");

var SetDropdown = React.createClass({
	displayName: "set-dropdown",
	propTypes: {
		sets: React.PropTypes.array.isRequired,
		value: React.PropTypes.string,
	},
	render: function () {
		var theReplacer = /^The /i;

		return React.createElement("div", { className: "set-dropdown", value: this.props.value },
			React.createElement("select", {},
				this.props.sets
				.sort(function (a, b) {
					var compA = a.name.replace(theReplacer, "").toLowerCase();
					var compB = b.name.replace(theReplacer, "").toLowerCase();
					return compA > compB ? 1 : -1;
				})
				.map(function (set) {
					return React.createElement("option", { value: set.name, key: set.name }, set.name);
				})
			)
		);
	},
});

module.exports = SetDropdown;
