"use strict";

var browserify = require('browserify');
var bundler = browserify('src/app.js');
var fs = require('fs');

bundler.transform({
	global: true,
}, "babelify");

bundler.transform({
	global: true,
	mangle: {
		toplevel: true,
	},
	compress: {
		sequences: true,
		dead_code: true,
		booleans: true
	}
}, 'uglifyify');

bundler.bundle()
	.pipe(fs.createWriteStream(__dirname + '/build/js/bundle.min.js'));
