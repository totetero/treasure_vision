
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

module.exports = {
	mode: "development",
	entry: path.resolve(__dirname, "./src/main.ts"),
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "index.js",
	},
	resolve: {
		extensions: [".js", ".ts",],
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: "ts-loader"
		},],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src/index.html"),
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "src/opencv.js", },
			],
		}),
	],
	devServer: {
		contentBase: "./dist",
		https: {
			key: fs.readFileSync("dist/ssl_fuhaha_treasure_vision.key"),
			cert: fs.readFileSync("dist/ssl_fuhaha_treasure_vision.crt"),
		},
	},
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

