const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
    mode: "development",
    entry: {
        index: [
            // 同样主动引入client.js
            "./node_modules/webpack-hot-middleware/client.js",
            // 无需引入webpack/hot/dev-server，webpack/hot/dev-server 通过 require('./process-update') 已经集成到 client.js模块
            "./src/index.js",
        ]
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].js"
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
}