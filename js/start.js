/**
 * 游戏开始页面
 * Created by majing on 2016/5/26.
 */

var startbutton, // 开始按钮
    listbutton, // 排行榜按钮
    start_container; // 开始页

/**
 * 加载开始页
 */
function gamestart() {
    console.log('开始游戏界面');
    var startbg = new createjs.Bitmap(preload.getResult("start-bg"));
    startbutton = new createjs.Bitmap(preload.getResult("start-button"));
    startbg.scaleX = win_W / startbg.image.width;
    startbg.scaleY = win_H / startbg.image.height;
    startbutton.scaleX = win_W * 0.6 / startbutton.image.width;
    startbutton.scaleY = startbutton.scaleX;
    startbutton.x = win_W / 2 - startbutton.image.width * startbutton.scaleX / 2;
    startbutton.y = win_H - startbutton.image.height * startbutton.scaleY * 2;
    startbutton.cursor = "pointer";
    start_container = new createjs.Container();
    start_container.addChild(startbg,startbutton);
    start_container.alpha = 0;
    stage.addChild(start_container);
    createjs.Ticker.setPaused(false);
    var tween_start = new TWEEN.Tween(start_container)
        .to({alpha:1, visible:true},500)
        .onComplete(function () {
            gamestart_event();
        }).start();
}

/**
 * 开始事件
 */
function gamestart_event() {
    startbutton.on("mousedown", function (evt) {
        startbutton.y -= 5;
    });
    startbutton.on("pressup", function (evt) {
        var tween_button = new TWEEN.Tween(startbutton)
            .to({y: this.y + 5},500)
            .onComplete(function () {
                var tween_start = new TWEEN.Tween(start_container)
                    .to({alpha:0, visible:true},500)
                    .onComplete(function () {
                        game_in();
                    })
                    .start();
            }).start();
    });
}
