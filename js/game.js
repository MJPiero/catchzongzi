/**
 * 游戏主程序
 * Created by majing on 2016/5/26.
 */

var game_container; // 游戏界面

var ti_zongzi, // 粽子计时器
    ti_bomb, // 炸弹计时器
    ti_time, // 倒计时
    tt_game; // 总计时器

var game_flag = 0; // 抽奖


/**
 * 进入游戏界面，加载游戏资源
 */
function game_in() {
    console.log('进入游戏');

    createjs.Ticker.setPaused(false);
    createjs.Sound.registerSound("./images/game-bgm.mp3", "game-bgm");
    createjs.Sound.on("fileload", function(){
        createjs.Sound.play("game-bgm",{interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1,volume:0.1});
    }, this);

    var gamebg = new createjs.Bitmap(preload.getResult("game-bg"));
    gamebg.scaleX = win_W / gamebg.image.width;
    gamebg.scaleY = win_H / gamebg.image.height;
    game_container = new createjs.Container();
    game_container.addChild(gamebg);
    game_container.alpha = 0;
    stage.addChild(game_container);
    var tween_game = new TWEEN.Tween(game_container)
        .to({alpha: 1},500)
        .onComplete(function () {
            game_begin();
        }).start();
    
};

/**
 * 游戏开始
 */
function game_begin() {
    zongzi_sprite.load();
    basket_sprite.load();
    game_score.load();
    time_sprite.load();

    tt_game = setTimeout(function () {
        game_over();
    },(time_sprite.GAME_TIME + 1) * 1000);
};


/**
 *  游戏结束
 */
function game_over(){
    window.clearInterval(ti_zongzi);
    window.clearInterval(ti_bomb);
    window.clearInterval(ti_time);
    window.clearTimeout(tt_game);
    createjs.Ticker.setPaused(true);
    TWEEN.removeAll();
    if(game_score.score_zongzi < 30){
        game_fail();
    }else{
        game_success();
    }
};

/**
 * 挑战失败
 */
function game_fail() {

    var fail_container = new createjs.Container();
    var bg = new createjs.Shape();
    bg.graphics.beginFill("#000");
    bg.graphics.drawRect(0,0,win_W,win_H);
    bg.graphics.endFill();
    bg.alpha = 0.6;

    var gamefail_bg = new createjs.Bitmap(preload.getResult("gamefail-bg"));
    gamefail_bg.scaleX = gamefail_bg.scaleY = win_W / gamefail_bg.image.width * 0.8;
    gamefail_bg.x = (win_W - gamefail_bg.image.width * gamefail_bg.scaleX) / 2;
    gamefail_bg.y = win_H * 0.2;

    var gamefail_button = new createjs.Bitmap(preload.getResult("restart-button"));
    gamefail_button.scaleX = gamefail_button.scaleY = win_W / gamefail_button.image.width * 0.3;
    gamefail_button.x = gamefail_bg.x + 10;
    gamefail_button.y = gamefail_bg.y + gamefail_bg.image.height * gamefail_bg.scaleY * 0.75;
    
    var share_button = new createjs.Bitmap(preload.getResult("share-button"));
    share_button.scaleX = share_button.scaleY = win_W / share_button.image.width * 0.3;
    share_button.x = gamefail_bg.x + gamefail_bg.image.width * gamefail_bg.scaleX - share_button.image.width * share_button.scaleX - 20;
    share_button.y = gamefail_bg.y + gamefail_bg.image.height * gamefail_bg.scaleY * 0.75;


    fail_container.addChild(bg,gamefail_bg,gamefail_button,share_button);
    game_container.addChild(fail_container);
    stage.update();

    gamefail_button.on("pressup", function () {
        game_restart();
    });

    share_button.on("pressup", function () {
        openshare();
    });
};

/**
 * 挑战成功
 */
function game_success() {
    var success_container = new createjs.Container();
    var bg = new createjs.Shape();
    bg.graphics.beginFill("#000");
    bg.graphics.drawRect(0,0,win_W,win_H);
    bg.graphics.endFill();
    bg.alpha = 0.6;

    if(game_flag == 0){
        var gethtmldom = new createjs.DOMElement(document.getElementById("success_send"));
        $("#success_send").show();
        document.getElementById("restart").addEventListener("click",function () {
            $("#success_send").hide();
            game_restart();
        });
        document.getElementById("share").addEventListener("click",function () {
            $("#success_send").hide();
            openshare();
        });
        success_container.addChild(bg,gethtmldom);
    }else if(game_flag == 1){

        var success_bg = new createjs.Bitmap(preload.getResult("success-bg2"));
        success_bg.scaleX = success_bg.scaleY = win_W / success_bg.image.width * 0.8;
        success_bg.x = (win_W - success_bg.image.width * success_bg.scaleX) / 2;
        success_bg.y = win_H * 0.2;

        var success_button = new createjs.Bitmap(preload.getResult("restart-button"));
        success_button.scaleX = success_button.scaleY = win_W / success_button.image.width * 0.3;
        success_button.x = (win_W - success_button.image.width * success_button.scaleX) / 2;
        success_button.y = success_bg.y + success_bg.image.height * success_bg.scaleY * 0.65;

        success_button.addEventListener("click",function () {
            game_restart();
        });


        success_container.addChild(bg,success_bg,success_button);

    }

    game_container.addChild(success_container);
    stage.update();
};

/**
 * 重新开始
 */
function game_restart(){
    console.log('游戏重新开始');
    createjs.Sound.removeSound("game-bgm");
    zongzi_sprite.zongzi_container.removeAllChildren();
    game_container.removeAllChildren();
    stage.removeChild(game_container);
    game_in();
};

/**
 * 分享弹窗
 */
function openshare() {
    var share_container = new createjs.Container();
    var bg = new createjs.Shape();
    bg.graphics.beginFill("#000");
    bg.graphics.drawRect(0,0,win_W,win_H);
    bg.graphics.endFill();
    bg.alpha = 0.6;

    var share_img = new createjs.Bitmap(preload.getResult("share-img"));
    share_img.scaleX = share_img.scaleY = win_W / share_img.image.width * 0.5;
    share_img.x = win_W - share_img.image.width * share_img.scaleX - 10;
    share_img.y = 20;

    share_container.addChild(bg,share_img);
    game_container.addChild(share_container);
    stage.update();

    share_container.on("pressup", function () {
        $("#success_send").show();
        share_container.removeAllChildren();
        game_container.removeChild(share_container);
        stage.update();
    });

};