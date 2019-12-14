let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin")
let path = require("path");
module.exports = {
    mode: "development",
    entry:"./src/index.js",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new HtmlWebpackPlugin(),//输出一个html，并将打包的chunk引入
        new webpack.HotModuleReplacementPlugin()
    ]
}