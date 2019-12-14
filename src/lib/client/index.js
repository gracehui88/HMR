const io = require("socket.io-client/dist/socket.io");
let hotEmitter = require("./emitter");

let currentHash;

// 连接服务器
const URL = "/";
const socket = io(URL);

const onSocketMessage = {
    hash(hash) {
        console.log("hash",hash);
        currentHash = hash;// 获取最新hash
    },
    ok() {
        console.log("ok");  
        reloadApp();// 开始热更新
    },
    connect() {
        console.log("client connect successful");
    }
};
// 添加监听回调
Object.keys(onSocketMessage).forEach(eventName => {
    let handler = onSocketMessage[eventName];
    socket.on(eventName, handler);
});


let reloadApp = () => {
    let hot = true;
    if (hot) {// 是否支持热更新
        // 如果支持的话发射webpackHotUpdate事件
        hotEmitter.emit("webpackHotUpdate", currentHash);
    } else {
        // 如果不支持则直接刷新浏览器	
        window.location.reload();
    }
}
