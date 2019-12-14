const { EventEmitter } = require("events");
module.exports = new EventEmitter();
// 使用events 发布订阅的模式，主要还是为了解耦