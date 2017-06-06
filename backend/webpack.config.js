var glob = require('glob');
var path = require('path');
var nodeExternals = require('webpack-node-externals');

process.env.NODE_ENV = 'production';

module.exports = {
	// use all js files in project root
	// except the webpack config, as an entry
	entry: globEntries('!(webpack.config).js'),
	target: 'node',

	// since `aws-sdk` is not compatible with webpack
	// we exclude all node dependencies
	externals: [nodeExternals()],

	// run babel on all .js files and skip those in node_modules
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: ['babel'],
			include: __dirname,
			exclude: /node_modules/,
		}]
	},

	// we are going to create multiple APIs in this guide, and we are going
	// to create a js file for each, we need this output block
	output: {
		libraryTarget: 'commonjs',
		path: path.join(__dirname, '.webpack'),
		filename: '[name].js'
	}
};

function globEntries(globPath) {
	var files = glob.sync(globPath);
	var entries = {};

	for (var i=0; i < files.length; i++) {
		var entry = files[i];
		entries[path.basename(entry, path.extname(entry))] = './' + entry;
	}

	return entries;
}