let inputEl = document.createElement("input");
document.body.appendChild(inputEl);

let divEl = document.createElement("div")
document.body.appendChild(divEl);

let render = () => {
    let content = require("./content").default;
    divEl.innerText = content;
}
render();

if (module.hot) {
    module.hot.accept(["./content.js"], render);
}