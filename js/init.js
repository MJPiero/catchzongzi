/**
 * 游戏初始化
 * Created by majing on 2016/5/25.
 */
var win_W = window.innerWidth,
    win_H = window.innerHeight;
document.getElementsByClassName('body')[0].style.height = win_H + 'px';

var canvas, // canvas元素
    stage, // 加载舞台
    preload; //预加载

var GAME_FPS = 60; // 游戏运行帧数

/**
 * 初始化
 */
function init() {
    console.log('游戏初始化');

    // 舞台设置
    canvas = document.getElementById("gameCanvas");
    stage = new createjs.Stage(canvas);
    stage.canvas.width = win_W;
    stage.canvas.height = win_H;

    // 加载页
    var load = new createjs.LoadQueue();
    load.loadFile({id:"logo", src:"./images/logo.png", type:createjs.AbstractLoader.IMAGE});
    load.loadFile({id:"loadbg", src:"./images/load-bg.jpg", type:createjs.AbstractLoader.IMAGE});
    load.on("complete", function (e) {
        var loadbg = new createjs.Bitmap(load.getResult('loadbg'));
        loadbg.scaleX = win_W / loadbg.image.width;
        loadbg.scaleY = win_H / loadbg.image.height;
        var loadprogress = new createjs.Text("0%", "bold 1rem Arial", "#a74510");
        var logoimg = new createjs.Bitmap(load.getResult('logo'));
        loadprogress.maxWidth = win_W;
        loadprogress.textAlign = "center";
        loadprogress.textBaseline = "middle";
        loadprogress.x = win_W / 2;
        loadprogress.y = win_H / 2;
        logoimg.scaleX = logoimg.scaleY = win_W * 0.7 / logoimg.image.width;
        logoimg .x = win_W / 2 - logoimg.image.width * logoimg.scaleX / 2;
        logoimg .y = win_H / 2 - logoimg.image.height * logoimg.scaleY - 20;
        var proload_container = new createjs.Container();
        proload_container.addChild(loadbg, logoimg, loadprogress);
        proload_container.alpha = 1;
        stage.addChild(proload_container);
        // 设置帧数，设置计时器
        createjs.Ticker.setFPS(GAME_FPS);
        createjs.Ticker.addEventListener("tick", handleTick);
        // 开启Touch事件
        createjs.Touch.enable(stage,true);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;
        // 声音设置
        createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
        createjs.Sound.alternateExtensions = ["mp3"];

        // 预加载
        preload = new createjs.LoadQueue();
        preload.installPlugin(createjs.Sound);
        preload.loadManifest([
            {id: "start-bg", src:"./images/start-bg.jpg"},
            {id: "start-button", src:"./images/start-button.png"},
            {id: "game-bg", src:"./images/game-bg.jpg"},
            {id: "zongzi1", src:"./images/zongzi1.png"},
            {id: "zongzi2", src:"./images/zongzi2.png"},
            {id: "zongzi3", src:"./images/zongzi3.png"},
            {id: "bomb", src:"./images/bomb.png"},
            {id: "basket", src:"./images/basket.png"},
            {id: "number", src:"./images/number.png"},
            {id: "score_best", src:"./images/score_best.png"},
            {id: "score_zongzi", src:"./images/score_zongzi.png"},
            {id: "time", src:"./images/time.png"},
            {id: "text", src:"./images/text.png"},
            {id: "gamefail-bg", src:"./images/game-fail.png"},
            {id: "restart-button", src:"./images/restart-button.png"},
            {id: "success-bg", src:"./images/success-bg.png"},
            {id: "success-bg2", src:"./images/success-bg2.png"},
            {id: "label-name", src:"./images/label-name.png"},
            {id: "label-phone", src:"./images/label-phone.png"},
            {id: "label-company", src:"./images/label-company.png"},
            {id: "share-button", src:"./images/return-button.png"},
            {id: "send-button", src:"./images/send-button.png"},
            {id: "share-img", src:"./images/share.png"},

            // 音频加载
            {id: "game-bgm", src:"./images/game-bgm.mp3"},
        ]);
        // 进度条
        preload.on("progress", function (e) {
            loadprogress.text = (preload.progress * 100 | 0) + "%";
            stage.update();
        }, this);
        // 加载完成
        preload.on("complete", function (e) {
            var tween_preload = new TWEEN.Tween(proload_container)
                .to({alpha:0,visible:true}, 500)
                .onComplete(function () {
                    createjs.Ticker.setPaused(true);
                    stage.clear();
                    gamestart();
                }).start();
        }, this);
    },this);
};

/**
 * 计时器
 * @param e
 */
function handleTick(e) {
    if(!e.paused){
        stage.update();
        TWEEN.update();

    }
};

init();
