let hotEmitter = require("../emitter");
let currentHash;// 最新编译hash
let lastHash;// 上一次编译hash

// 监听webpackHotUpdate事件
hotEmitter.on("webpackHotUpdate", (hash) => {
    currentHash = hash;
    if (!lastHash) {// 说明是第一次请求
        return lastHash = currentHash
    }
    hotCheck();
})

let hotCheck = () => {
    hotDownloadManifest().then(hotUpdate => {
        let chunkIdList = Object.keys(hotUpdate.c);
        // 循环更新的chunk，拉取新代码
        chunkIdList.forEach(chunkID => {
            hotDownloadUpdateChunk(chunkID);
        });
        lastHash = currentHash;
    }).catch(err => {
        window.location.reload();
    });
}

// 向 server 端发送 Ajax 请求，包含了所有要更新的模块的 hash 值和chunk名
let hotDownloadManifest = () => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let hotUpdatePath = `${lastHash}.hot-update.json`// xxxlasthash.hot-update.json
        xhr.open("get", hotUpdatePath);
        xhr.onload = () => {
            let hotUpdate = JSON.parse(xhr.responseText);
            resolve(hotUpdate);
        };
        xhr.onerror = (error) => {
            reject(error);
        }
        xhr.send();
    })
}
// 发送Jsonp拉取更新的代码
let hotDownloadUpdateChunk = (chunkID) => {
    let script = document.createElement("script")
    script.charset = "utf-8";
    script.src = `${chunkID}.${lastHash}.hot-update.js`//chunkID.xxxlasthash.hot-update.js
    document.head.appendChild(script);
}

let hotCreateModule = (moduleID) => {
    let hot = {
        accept(deps = [], callback) {
            deps.forEach(dep => {
                hot._acceptedDependencies[dep] = callback || function () { };
            })
        },
        check: hotCheck
    }
    return hot;
}

// 补丁JS取回来后会调用webpackHotUpdate方法
window.webpackHotUpdate = (chunkID, moreModules) => {
    //循环新拉来的模块
    Object.keys(moreModules).forEach(moduleID => {
        // 通过__webpack_require__.c 模块缓存找到旧模块
        let oldModule = __webpack_require__.c[moduleID];

        // 更新__webpack_require__.c，利用moduleID将新的拉来的模块覆盖原来的模块
        let newModule = __webpack_require__.c[moduleID] = {
            i: moduleID,
            l: false,
            exports: {},
            hot: hotCreateModule(moduleID),
            parents: oldModule.parents,
            children: oldModule.children
        };

        // 执行最新的代码
        moreModules[moduleID].call(newModule.exports, newModule, newModule.exports, __webpack_require__);
        newModule.l = true;

        // 执行父模块中的accept回调
        newModule.parents && newModule.parents.forEach(parentID => {
            let parentModule = __webpack_require__.c[parentID];
            parentModule.hot._acceptedDependencies[moduleID] && parentModule.hot._acceptedDependencies[moduleID]()
        });
    })
}
