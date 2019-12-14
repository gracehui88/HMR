const webpack = require("webpack");
const config = require("./webpack.config");
const WebpackHotMiddleware = require("webpack-hot-middleware");
const WebpackDevMiddleware = require("webpack-dev-middleware");
const express = require("express");

let compiler = webpack(config);

let app = express();

app.use((res, req, next) => {
    if (res.url === "/favicon.ico") {
        return req.sendStatus("404");
    }
    next()
});

// 使用webpack-dev-middleware watch模式下启动编译、输入系统设置为内存系统、负责返回编译文件的中间件
app.use(WebpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

// 监听webpack done事件、提供浏览器和 Webpack 服务器之间的通信机制 更新推送给客户端
app.use(WebpackHotMiddleware(compiler));

// EventSource服务端
// app.use((req, res, next) => {
//     var headers = {
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': 'text/event-stream;charset=utf-8',
//         'Cache-Control': 'no-cache, no-transform',
//         'X-Accel-Buffering': 'no',
//     };
//     res.writeHead(200, headers);
//     setInterval(() => {
//         res.write("data: nihao");
//     }, 2000);
// })

app.listen(8000, () => {
    console.log("Project is running at http://localhost:8000/");
});
