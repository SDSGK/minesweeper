// 初始化画布工具
const ctx = canvasDom.getContext("2d");
// 清空画布
function clearCanvas() {
  ctx.clearRect(0, 0, config.width, config.height);
}

// 初始化网格
function reloadGrid() {
  clearCanvas();
  const gridData = gridStore.getStore();
  for (const key in gridData) {
    const item = gridData[key];
    ctx.strokeStyle = "black";
    ctx.strokeRect(item.offsetX, item.offsetY, item.width, item.height);
    // ctx.beginPath();
    // ctx.rect(item.offsetX, item.offsetY, item.width, item.height);
    // ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (item.open) {
      ctx.fillStyle = "white";
      ctx.fillRect(item.offsetX, item.offsetY, item.width, item.height);

      ctx.font = "bold 30px 微软雅黑";

      if (item.number) {
        if (item.number === 1) {
          ctx.fillStyle = "#3148AF";
        } else if (item.number === 2) {
          ctx.fillStyle = "#146017";
        } else if (item.number === 3) {
          ctx.fillStyle = "#A20B10";
        } else if (item.number === 4) {
          ctx.fillStyle = "#00067A";
        } else if (item.number === 5) {
          ctx.fillStyle = "#720B0B";
        } else if (item.number === 6) {
          ctx.fillStyle = "#007174";
        } else if (item.number === 7) {
          ctx.fillStyle = "#FF0F21";
        } else if (item.number === 8) {
          ctx.fillStyle = "#757575";
        }
        // ctx.strokeStyle = ctx.fillStyle;
        ctx.fillText(
          item.number,
          item.offsetX + item.width / 2,
          item.offsetY + item.height / 2
        );
        // 填充文字： fillText(text, x, y, maxWidth)
        // 描边文字： strokeText(text, x, y, maxWidth)
      }
    } else {
      ctx.fillStyle = "green";
      ctx.fillRect(item.offsetX, item.offsetY, item.width, item.height);
    }

    if (isEnd) {
      if (item.isBoom) {
        ctx.font = "bold 40px 微软雅黑";
        ctx.strokeText(
          "☢︎",
          item.offsetX + item.width / 2,
          item.offsetY + item.height / 2
        );
      }
    }
    if (item.mark) {
      ctx.strokeText(
        "⚑",
        item.offsetX + item.width / 2,
        item.offsetY + item.height / 2
      );
    }
  }
}

// 获取x、y轴
function getEventPosition(ev) {
  let x, y;
  if (ev.layerX || ev.layerX == 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    // Opera
    x = ev.offsetX;
    y = ev.offsetY;
  }

  return { x, y };
}

// 添加点击事件
function addEvent() {
  let eventTime = 0;
  canvasDom.addEventListener(
    "mousedown",
    function (e) {
      eventTime = e.timeStamp;
    },
    false
  );
  canvasDom.addEventListener(
    "mouseup",
    function (e) {
      // console.log("time -->>", e.timeStamp - eventTime);
      // 获取点击坐标
      const p = getEventPosition(e);
      // 通过点击道德坐标获取相对应数据Id
      const { xIndex, yIndex } = getAxleByPoint(p, true);
      const target = gridStore.getId(`${xIndex},${yIndex}`);
      if (target) {
        if (!firstClick) {
          // console.log("target -->>", target);
          // console.log("target.isBoom -->>", target.isBoom);
          // 长按开图
          if (e.timeStamp - eventTime >= 500) {
            // 开始扫雷
            if (!target.mark && target.isBoom) {
              // 点到雷了
              touchBoom(target);
            } else {
              gridSize.nowBoomSize -= 1;
              isFinish();
              target.open = true;
            }
          } else {
            // 单击标记
            if (target.open) {
              // 开图
              openMarkMap(target);
              isFinish();
            } else {
              if (target.mark) {
                // 取消标记
                target.mark = false;
              } else {
                target.mark = true;
              }
            }
          }
        } else {
          firstClick = false;
          // 如果是第一次点击 则进行打开地图 防止第一次点击就触发雷
          openMap(xIndex, yIndex);
          // 生成雷
          initBoom();
        }
      }
      // 刷新显示
      reloadGrid();
    },
    false
  );
}

// 绘制
function draw() {
  initData();
  reloadGrid();
  addEvent();
}

draw();
