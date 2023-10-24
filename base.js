const gridStore = new Store();
const boomStore = new Store();
const safeStore = new Store();
// 自动打开地图
function autoOpenMap() {
  const gridData = gridStore.getStore();
  for (const key in gridData) {
    const safeItem = gridData[key];

    isSafeMap(safeItem.x, safeItem.y);

    const safeNumber = getSafeNumber(safeItem.x, safeItem.y);
    safeItem.number = safeNumber;
  }
}

// 进行九宫格判断
function isSafeMap(x, y) {
  const tempMap = {};
  let isSafe = true;
  safeFor: for (let xIndex = x - 1; xIndex < x + 2; xIndex++) {
    for (let yIndex = y - 1; yIndex < y + 2; yIndex++) {
      const id = `${xIndex},${yIndex}`;
      const target = gridStore.getId(id);
      if (target) {
        tempMap[id] = target;
        if (target.isBoom) {
          isSafe = false;
          break safeFor; // 整段跳出循环
        }
      }
    }
  }

  if (isSafe) {
    // 如果没有发现雷 则进行打开
    for (const key in tempMap) {
      const item = tempMap[key];
      item.open = true;
      safeStore.setId(key, item);
    }
  }
}

// 添加周围数字提醒
function getSafeNumber(x, y) {
  let safeIndex = 0;
  for (let xIndex = x - 1; xIndex < x + 2; xIndex++) {
    for (let yIndex = y - 1; yIndex < y + 2; yIndex++) {
      const id = `${xIndex},${yIndex}`;
      const target = gridStore.getId(id);
      if (target && target.isBoom) {
        safeIndex += 1;
      }
    }
  }
  return safeIndex;
}

// 打开标记周围的图
function openMarkMap(target) {
  const x = target.x;
  const y = target.y;
  let index = 0;
  let targetNumber = target.number;
  const mapList = [];
  for (let xIndex = x - 1; xIndex < x + 2; xIndex++) {
    for (let yIndex = y - 1; yIndex < y + 2; yIndex++) {
      const id = `${xIndex},${yIndex}`;
      const target = gridStore.getId(id);
      if (target) {
        mapList.push(target);
        if (target.mark) {
          index += 1;
        }
      }
    }
  }

  if (index === targetNumber) {
    for (const item of mapList) {
      if (!item.mark) {
        if (item.isBoom) {
          touchBoom(item);
        } else {
          item.open = true;
          gridSize.nowBoomSize -= 1;
          safeStore.setId(`${item.x},${item.y}`, item);
        }
      }
    }
  }
}

function touchBoom(target) {
  isEnd = true;
}
// 初始化雷
function initBoom() {
  const gridData = gridStore.getStore();
  const gridList = Object.keys(gridData);
  const boomList = [];
  let sameIndex = 0;

  for (let index = 0; index < gridSize.boomSizeBack; index++) {
    const targetIndex = Math.floor(Math.random() * gridList.length);
    const id = gridList[targetIndex];
    const item = gridStore.getId(id);

    if (!item.isBoom && !item.open) {
      item.isBoom = true;
      boomList.push(item);
      boomStore.setId(id, item);
    } else {
      sameIndex += 1;
    }
  }

  gridSize.boomSizeBack = sameIndex;
  if (sameIndex) {
    initBoom();
  } else {
    autoOpenMap();
  }
}

// 初始化表格数据
function initData() {
  /**
   * gridSize: 网格大小
   * gridInfo: 单个网格信息
   */
  // 获取雷的生成数量
  gridSize.boomSizeBack = gridSize.boomSize;
  gridSize.nowBoomSize = gridSize.boomSize;
  // 简单判断是否超出容器
  if (gridSize.boomSizeBack >= gridSize.xSize * gridSize.YSize + 9) {
    throw "雷的数量超过格子总数";
  }
  for (let yIndex = 0; yIndex < gridSize.YSize; yIndex++) {
    for (let xIndex = 0; xIndex < gridSize.xSize; xIndex++) {
      const item = {
        x: xIndex,
        y: yIndex,
        offsetX: xIndex * gridInfo.gridWidth,
        offsetY: yIndex * gridInfo.gridHeight,
        width: gridInfo.gridWidth,
        height: gridInfo.gridHeight,
        open: false,
        isBoom: false,
      };
      gridStore.setId(`${xIndex},${yIndex}`, item);
    }
  }
}

// 第一次开图
function openMap(x, y) {
  for (let xIndex = x - 1; xIndex < x + 2; xIndex++) {
    for (let yIndex = y - 1; yIndex < y + 2; yIndex++) {
      const id = `${xIndex},${yIndex}`;
      const target = gridStore.getId(id);
      if (target) {
        target.open = true;
      }
    }
  }
}

// 通过xy获取下标
function getAxleByPoint(target) {
  let x = target.x;
  let y = target.y;
  x = target.x - config.left;
  y = target.y - config.top;
  let xIndex = Math.ceil(x / gridInfo.gridWidth) - 1;
  let yIndex = Math.ceil(y / gridInfo.gridHeight) - 1;
  return { xIndex, yIndex };
}

function isFinish() {
  if (gridSize.nowBoomSize <= 0) {
    const gridData = gridStore.getStore();
    let ifFinish = true;
    finishFor: for (const key in gridData) {
      const element = gridData[key];
      if (!element.isBoom && !element.open) {
        ifFinish = false;
        break finishFor;
      }
    }

    if (ifFinish) {
      console.log("结束了 -->>");
    }
  }
}
