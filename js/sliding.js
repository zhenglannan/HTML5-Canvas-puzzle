var can = document.getElementById('puzzle');
var context = can.getContext('2d');

var img = new Image();
//直接images目录获取
img.src = "images/defa.jpg";
// 图片加载完成后发生的事件
img.addEventListener('load', drawTiles, false);

// 画布宽度
var boardSize = can.width;
var tileCount = 2;
// 每个方块大小
var tileSize = boardSize / tileCount;

// 鼠标位置
var clickLoc = {
  x: 0,
  y: 0
}
// 空白位置坐标
var emptyLoc = {
  x: 0,
  y: 0
}
var solved = false;
// 拼图图片数组
var boardParts = new Object;
// html()获取的是字符串字符形式，需要Number转为数字
var score = Number($("#score").html());
// console.log(typeof($("#score").html()))
// console.log(score);
// setBoard();
// 离窗口距离减去画布的偏移量（对于定位父级的距离）
can.onmousemove = function (e) {
  // console.log(e.pageX);
  // console.log(this.offsetLeft);
  // console.log(this.offsetTop);
  clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
  clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
  // console.log(clickLoc);
};
//  游戏进度条加载完淡出
setTimeout(function () {
  $("#myca").fadeOut();
  $("#bg")[0].play();
}, 3000);
can.onclick = function () {
  if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
    slideTile(emptyLoc, clickLoc);
    drawTiles();
  }
  // 拼图成功
  if (solved) {
    // 进入下一关
    score += 100;
    $("#score").html(score);
    $("#next").slideDown();
    $("#tishi")[0].play();
    $(".progress").css("webkitAnimationName", "");
  }
};
// 确定每个对象的坐标
function setBoard() {
  boardParts = new Array(tileCount * tileCount);
  for (var i = 0; i < tileCount * tileCount; i++) {
    boardParts[i] = i;
  }
  // 拼块的随机排列
  randomlist();
}
// 随机排序函数
function sortNumber(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}

// 拼块的随机排列
function randomlist() {
  boardParts.sort(sortNumber);
  emptyLoc.x = 0;
  emptyLoc.y = 0;
  solved = false;
}
// 绘制打乱的图块
function drawTiles() {
  context.clearRect(0, 0, boardSize, boardSize);
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      // (3,3)
      var n = boardParts[i * tileCount + j];
      // 计算出编号为n的拼块在原图的位置坐标（行列号）
      var x = parseInt(n / tileCount);
      var y = n % tileCount;
      console.log(x + ":" + Math.floor(n / tileCount) + ":" + y);
      if (i != emptyLoc.x || j != emptyLoc.y || solved == true) {
        // ??
        context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
          i * tileSize, j * tileSize, tileSize, tileSize);
      }
    }
  }
  console.log(tileSize);
}

function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
// 切换拼图
function slideTile(toLoc, fromLoc) {
  if (!solved) {
    var t;
    t = boardParts[emptyLoc.x * tileCount + emptyLoc.y];
    boardParts[emptyLoc.x * tileCount + emptyLoc.y] = boardParts[clickLoc.x * tileCount + clickLoc.y];
    boardParts[clickLoc.x * tileCount + clickLoc.y] = t;
    emptyLoc.x = clickLoc.x; //emptyLoc重新记录空白快位置
    emptyLoc.y = clickLoc.y;
    checkSolved();
  }
}
//检查是否成功
function checkSolved() {
  var flag = true;
  for (var i = 0; i < tileCount * tileCount; ++i) {
    //  判断元素排列顺序
    if (boardParts[i] != i) {
      flag = false;
    }
  }
  solved = flag;
}



// 重新开始本关按钮
$(".restart").click(function () {
  // 重新设置进度条
  // $(".progress").css("webkitAnimationName", " ");
  if ($(".progress").css("webkitAnimationName") == "progress") {
    $(".progress").css("webkitAnimationName", "progress2");
  } else {
    $(".progress").css("webkitAnimationName", "progress");
  }
  setBoard();
  drawTiles();
  // 暂停后再重新开始动画保持运行
  $(".progress").css("animation-play-state", "running");
  // 游戏结束界面消失
  $(".fail").slideUp();
})
// 界面内下一关按钮
// $(".next").click(function () {
//   tileCount += 1;
//   tileSize = boardSize / tileCount;
//   setBoard();
//   drawTiles();
//   if ($(".progress").css("webkitAnimationName") == "progress") {
//     $(".progress").css("webkitAnimationName", "progress2");
//   } else {
//     $(".progress").css("webkitAnimationName", "progress");
//   }
//   //  暂停后再下一关动画保持运行
//   $(".progress").css("animation-play-state", "running");
// })

//  开始界面开始按钮
$(".playbtn").click(function () {
  //  $(".start").css("webkitAnimationName","disappear");
  $(".start").slideUp();
  $(".progress").css("webkitAnimationName", "progress");
  $(".progress").css("animation-play-state", "running");

  setBoard();
  drawTiles();
})
// 下一关函数
function next(){
  $("#next").fadeOut("slow");
  tileCount += 1;
  tileSize = boardSize / tileCount;
  setBoard();
  drawTiles();
  if ($(".progress").css("webkitAnimationName") == "progress") {
    $(".progress").css("webkitAnimationName", "progress2");
  } else {
    $(".progress").css("webkitAnimationName", "progress");
  }
  //  暂停后再下一关动画保持运行
  $(".progress").css("animation-play-state", "running");
}


// 暂停按钮
$(".pausebtn").click(function () {
  $(".progress").css("animation-play-state", "paused");
})
// 内界面开始按钮
$(".startbtn").click(function () {
  $(".progress").css("animation-play-state", "running");
})
// 退出按钮
$(".backbtn").click(function () {
  $(".start").show();
  tileCount = 2;
  tileSize = boardSize / tileCount;
  setBoard();
  drawTiles();
  $(".progress").css("webkitAnimationName", "");
  // 游戏结束界面消失
  $(".fail").slideUp();
})

//  animationend event事件获取必须用document.querySelector得到对象
var timeout = document.querySelector(".progress");
// css动画结束监听事件
timeout.addEventListener("animationend", function (e) {
  $(".fail").slideDown();
  $("#tishi")[0].play();
}, false);
// 音乐控制播放、暂停
var au = document.getElementById("bg");
$(".music").click(function () {
  if (au.paused) {
    au.play();
    $(".music").toggleClass("music2");
  } else {
    au.pause();
    $(".music").toggleClass("music2");

  }
})
// 按键音效控制
$('.playbtn').easyAudioEffects({
  // ogg : "./path/to/sound.ogg",
  // 路径只能这样
  mp3: "audios/button2.mp3",
  eventType: "click" // or "click"
});
$('button').easyAudioEffects({
  // ogg : "./path/to/sound.ogg",
  // 路径只能这样
  mp3: "audios/button2.mp3",
  eventType: "click" // or "click"
});
$('button').easyAudioEffects({
  // ogg : "./path/to/sound.ogg",
  // 路径只能这样
  mp3: "audios/start.mp3",
  eventType: "hover" // or "click"
});
$('.top').easyAudioEffects({
  // ogg : "./path/to/sound.ogg",
  // 路径只能这样
  mp3: "audios/tishi.mp3",
  eventType: "click" // or "click"
});