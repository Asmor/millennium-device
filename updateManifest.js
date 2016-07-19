"use strict";

var source = "src/manifest.appcache";
var output = "build/manifest.appcache";

var versionRegex = /VERSION: (\d+)/;

var fs = require("fs");

fs.readFile(source, "utf-8", function (err, data) {
	if ( err ) {
		throw err;
	}

	var versionMatch = data.match(versionRegex);

	if ( !versionMatch ) {
		throw "Can't find version in manifest.appcache";
	}

	var currentVersion = versionMatch[1] * 1;
	var newVersion = currentVersion + 1;
	var date = new Date().toISOString().match(/\d{4}-\d{2}-\d{2}/)[0];

	var updatedFile = data
		.replace(versionRegex, "VERSION: " + newVersion)
		.replace(/DATE: .*/, "DATE: " + date)
	;

	fs.writeFile(source, updatedFile, "utf-8");
	fs.writeFile(output, updatedFile, "utf-8");
});
