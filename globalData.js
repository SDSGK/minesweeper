// 画布元素
const canvasDom = document.querySelector("#canvas");
// 基础信息
const config = {
  dom: canvasDom,
  height: canvasDom.offsetHeight,
  width: canvasDom.offsetWidth,
  top: canvasDom.offsetTop,
  left: canvasDom.offsetLeft,
  right: 0,
  bottom: 0,
};
config.right = config.left + config.width;
config.bottom = config.top + config.height;
console.log("config -->>", config);
// 网格大小
const gridSize = {
  xSize: 20,
  YSize: 20,
  boomSize: 90,
  boomSizeBack: 0,
  nowBoomSize: 0
};
// 每个格子大小
const gridInfo = {
  gridWidth: config.width / gridSize.xSize,
  gridHeight: config.height / gridSize.YSize,
};

let isEnd = false; // 是否已经结束
let firstClick = true; // 是否第一次点击
console.log("gridInfo -->>", gridInfo);
