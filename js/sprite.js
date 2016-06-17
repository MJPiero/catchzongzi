/**
 * 精灵元素
 * Created by majing on 2016/5/27.
 */

/**
 * 粽子 & 炸弹
 * @type {{cot: number, Interval: {zongzi: number, bomb: number}, zongzi_container: string, load: Function, create: Function}}
 */
var zongzi_sprite = {
    cot: 0,  // 计数
    Interval: { // 时间间隔
        zongzi: 500,
        bomb: 700
    },
    zongzi_container: '', //区域
    load: function () {
        var _this = this;
        _this.cot = 0;
        _this.zongzi_container = new createjs.Container();
        game_container.addChild(_this.zongzi_container);
        var zongzi_elements = [];
        for(var i = 1; i <= 3; i++){
            zongzi_elements.push(preload.getResult("zongzi"+i));
        };
        // 生成粽子
        ti_zongzi = setInterval(function () {
            var zongzi_type = Math.floor(2 * Math.random()) | 0;
            _this.create(zongzi_elements[zongzi_type],'zongzi');
        },_this.Interval.zongzi);
        // 生成炸弹
        ti_bomb = setInterval(function () {
            _this.create(preload.getResult("bomb"),'bomb');
        },_this.Interval.bomb);
    },
    create: function (item,type) {
        var _this = this;
        var zongzi = new createjs.Bitmap(item);
        zongzi.scaleX = zongzi.scaleY = zongzi.scale = win_W / zongzi.image.width / 6;
        zongzi.regX = zongzi.image.width * zongzi.scaleX / 2 | 0;
        zongzi.regY = zongzi.image.height * zongzi.scaleX / 2 | 0;
        zongzi.rotation = 360 * Math.random() | 0;
        zongzi.x = zongzi.image.width * zongzi.scaleX / 2 + ( win_W - zongzi.image.width * zongzi.scaleX ) * Math.random();
        zongzi.y = 0 - zongzi.image.height * zongzi.scaleY;
        zongzi.name = type + "_" + _this.cot;
        _this.cot ++;
        _this.zongzi_container.addChild(zongzi);
        var tween_zongzi = new TWEEN.Tween(zongzi)
            .to({y: win_H - 10}, 4500)
            .easing(TWEEN.Easing.Cubic.In)
            .onUpdate(function() {
                if(this.y >= basket_sprite.basket_el.y){
                    basket_sprite.hite_check(this.x,this.y,zongzi,type);
                };
            })
            .onComplete(function () {
                _this.zongzi_container.removeChild(zongzi);
            })
            .start();
    }

};

/**
 * 篮子
 * @type {{basket_el: string, getbitmap: Function, load: Function, create: Function, drag: Function, hite_check: Function}}
 */
var basket_sprite = {
    basket_el: '',
    temp_el: '',
    getbitmap: function(){
        var basket = new createjs.Bitmap(preload.getResult("basket"));
        return basket;
    },
    load: function(){
        this.create();
        effect_sprite.container.addscore = new createjs.Container();
        game_container.addChild(effect_sprite.container.addscore);
    },
    create: function () {
        var _this = this;
        _this.basket_el = _this.getbitmap();
        _this.basket_el.scaleX = _this.basket_el.scaleY = win_W / 4.5 / _this.basket_el.image.width;
        _this.basket_el.x = win_W / 2 - _this.basket_el.image.width * _this.basket_el.scaleX / 2;
        _this.basket_el.y = win_H - _this.basket_el.image.height * _this.basket_el.scaleY;
        game_container.addChild(_this.basket_el);
        _this.drag(_this.basket_el);
    },
    drag: function (node) {
        node.on("mousedown", function (evt) {
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        });
        node.on("pressmove", function (evt) {
            var _this = this;
            if(evt.stageX <= _this.image.width * _this.scaleX * 0.5){
                _this.x = 0;
            }else if(evt.stageX >= win_W - _this.image.width * _this.scaleX * 0.5){
                _this.x = win_W - _this.image.width * _this.scaleX;
            }else{
                _this.x = evt.stageX + _this.offset.x;
            }
        });
    },
    hite_check: function (x,y,item,type) {
        var _this = this;
        if(( x >= _this.basket_el.x ) && (x <= (_this.basket_el.x + _this.basket_el.image.width * _this.basket_el.scaleX)) ){
            if(_this.temp_el == item.name){
                return false;
            }else{
                if(type == 'bomb'){
                    game_over();
                }else{
                    var get_x = _this.basket_el.x;
                    var get_y = _this.basket_el.y;
                    effect_sprite.addscore(get_x,get_y);
                    var tween_addeffect1 = new TWEEN.Tween(_this.basket_el)
                        .to({y: _this.basket_el.y - 10},200)
                        .onComplete(function () {
                            var tween_addeffect2 = new TWEEN.Tween(_this.basket_el) .to({y: win_H - _this.basket_el.image.height * _this.basket_el.scaleY},200).start();
                        }).start();
                    game_score.addscore();
                }
                zongzi_sprite.zongzi_container.removeChild(item);
                _this.temp_el = item.name;
                return true;
            }
        }
    }
};


/**
 * 分数
 * @type {{score_zongzi: number, score_best: number, scale: number, zongziscore: {zongziscore_g: string, zongziscore_s: string, zongziscore_b: string}, load: game_score.load, loadbestscore: game_score.loadbestscore, loadzongziscore: game_score.loadzongziscore, addscore: game_score.addscore, resolvescore: game_score.resolvescore}}
 */
var game_score = {
    score_zongzi: 0, // 本次分数
    score_best: 0,  // 最好分数
    scale: 0,
    zongziscore:{  // 本次分数
        zongziscore_g: '',
        zongziscore_s: '',
        zongziscore_b: ''
    },
    load: function(){
        var _this = this;
        _this.score_zongzi = 0;
        game_container.addChild(_this.loadbestscore(),_this.loadzongziscore());
    },
    loadbestscore: function(){
        var _this = this;
        var bestscore_container = new createjs.Container();
        var bestscore_bg = new createjs.Bitmap(preload.getResult("score_best"));
        _this.scale = bestscore_bg.scaleX = bestscore_bg.scaleY = win_W / bestscore_bg.image.width * 0.4;
        bestscore_bg.y = bestscore_bg.x = 10;

        var getscore = _this.resolvescore(_this.score_best);
        var bestscore_g = new createjs.Sprite(effect_sprite.number_sprite(),"num_"+getscore[2]); //个位
        var bestscore_s = new createjs.Sprite(effect_sprite.number_sprite(),"num_"+getscore[1]); //十位
        var bestscore_b = new createjs.Sprite(effect_sprite.number_sprite(),"num_"+getscore[0]); //百位
        bestscore_g.scaleX = bestscore_g.scaleY = bestscore_s.scaleX = bestscore_s.scaleY = bestscore_b.scaleX = bestscore_b.scaleY = _this.scale;
        bestscore_g.y = bestscore_s.y = bestscore_b.y = 17;
        bestscore_g.x = bestscore_bg.x + bestscore_bg.image.width * _this.scale * 0.6;
        bestscore_s.x = bestscore_g.x - 20;
        bestscore_b.x = bestscore_s.x - 20;
        bestscore_container.addChild(bestscore_bg,bestscore_g,bestscore_s,bestscore_b);

        return bestscore_container;
    },
    loadzongziscore: function(){
        var _this = this;
        var zongziscore_container = new createjs.Container();
        var zongziscore_bg = new createjs.Bitmap(preload.getResult("score_zongzi"));
        _this.scale = zongziscore_bg.scaleX = zongziscore_bg.scaleY = win_W / zongziscore_bg.image.width * 0.4;
        zongziscore_bg.x = 10;
        zongziscore_bg.y = zongziscore_bg.image.height * _this.scale + 20 ;

        var getscore = _this.resolvescore(_this.score_zongzi);
        var zongziscore_g = _this.zongziscore.zongziscore_g = new createjs.Sprite(effect_sprite.number_sprite(),"num_"+getscore[2]); //个位
        var zongziscore_s = _this.zongziscore.zongziscore_s = new createjs.Sprite(effect_sprite.number_sprite(),"num_"+getscore[1]); //十位
        var zongziscore_b = _this.zongziscore.zongziscore_b = new createjs.Sprite(effect_sprite.number_sprite(),"num_"+getscore[0]); //百位
        zongziscore_g.scaleX = zongziscore_g.scaleY = zongziscore_s.scaleX = zongziscore_s.scaleY = zongziscore_b.scaleX = zongziscore_b.scaleY = _this.scale;
        zongziscore_g.y = zongziscore_s.y = zongziscore_b.y = zongziscore_bg.y + 3;
        zongziscore_g.x = zongziscore_bg.x + zongziscore_bg.image.width * _this.scale * 0.6;
        zongziscore_s.x = zongziscore_g.x - 20;
        zongziscore_b.x = zongziscore_s.x - 20;
        zongziscore_container.addChild(zongziscore_bg,zongziscore_g,zongziscore_s,zongziscore_b);

        return zongziscore_container;
    },
    addscore: function(){
        var _this = this;
        _this.score_zongzi ++;
        var getscore = _this.resolvescore(_this.score_zongzi);
        _this.zongziscore.zongziscore_g.gotoAndStop("num_"+getscore[2]);
        _this.zongziscore.zongziscore_s.gotoAndStop("num_"+getscore[1]);
        _this.zongziscore.zongziscore_b.gotoAndStop("num_"+getscore[0]);
    },
    resolvescore: function(score){
        var b = parseInt(score / 100);
        var s = parseInt((score - b * 100) / 10);
        var g = (score - b * 100) % 10;
        var returnscore = [b,s,g];
        return returnscore;
    }
};

/**
 * 倒计时
 * @type {{GAME_TIME: number, time: {g: number, s: number}, load: time_sprite.load, create: time_sprite.create, countdown: time_sprite.countdown, resolvescore: time_sprite.resolvescore}}
 */
var time_sprite = {
    GAME_TIME: 30,
    time: {
        g: 0,
        s: 0
    },
    load: function () {
        var _this = this;
        _this.GAME_TIME = 30;
        game_container.addChild(_this.create());
    },
    create: function () {
        var _this = this;
        var time_container = new createjs.Container();
        var time_bg = new createjs.Bitmap(preload.getResult("time"));
        time_bg.scaleX = time_bg.scaleY = win_W / time_bg.image.width * 0.4;
        time_bg.x = win_W - 10 - time_bg.image.width * time_bg.scaleX;
        time_bg.y = 10;

        var time_text = new createjs.Bitmap(preload.getResult("text"));
        time_text.scaleX = time_text.scaleY = time_bg.scaleX;
        time_text.x = time_bg.x + time_bg.image.width * time_bg.scaleX * 0.6;
        time_text.y = time_bg.y + 8;

        _this.time.g = new createjs.Sprite(effect_sprite.number_sprite(),"num_0"); //个位
        _this.time.s = new createjs.Sprite(effect_sprite.number_sprite(),"num_3"); //十位
        _this.time.g.scaleX = _this.time.g.scaleY = _this.time.s.scaleX = _this.time.s.scaleY = time_bg.scaleX;
        _this.time.g.y =  _this.time.s.y = time_bg.y + 7;
        _this.time.g.x = time_text.x - 30;
        _this.time.s.x = _this.time.g.x - 20;
        time_container.addChild(time_bg,_this.time.g,_this.time.s,time_text);
        _this.countdown();

        return time_container;
    },
    countdown: function () {
        var _this = this;
        ti_time = setInterval(function () {
            _this.GAME_TIME --;
            var time = _this.resolvescore(_this.GAME_TIME);
            _this.time.g.gotoAndStop("num_"+time[1]);
            _this.time.s.gotoAndStop("num_"+time[0]);
        },1000)
    },
    resolvescore: function(time){
        var s = parseInt(time / 10);
        var g = time % 10;
        var returnscore = [s,g];
        return returnscore;
    }
};

/**
 * 动效
 * @type {{number_sprite: effect_sprite.number_sprite}}
 */
var effect_sprite = {
    container: {
      addscore: ''
    },
    number_sprite: function () {
        var image_item = preload.getResult("number");
        var effect_spritesheet = new createjs.SpriteSheet({
            "framerate": GAME_FPS,
            "animations": {
                num_0: 0,
                num_1: 1,
                num_2: 2,
                num_3: 3,
                num_4: 4,
                num_5: 5,
                num_6: 6,
                num_7: 7,
                num_8: 8,
                num_9: 9
            },
            "images": [image_item],
            "frames": {
                "height": image_item.height,
                "width": image_item.width / 10,
                "regX": 0,
                "regY":0,
                "count": 10
            }
        });
        return effect_spritesheet;
    },
    addscore: function (x,y) {
        var _this = this;
        var addtext = new createjs.Text("+1", "bold 1rem Arial", "#f32b63");
        addtext.x = x + basket_sprite.basket_el.image.width * basket_sprite.basket_el.scaleX * 0.6;
        addtext.y = y - 10;
        _this.container.addscore.addChild(addtext);
        var tween_text = new TWEEN.Tween(addtext).to({alpha: 0,y: addtext.y-20, x: addtext.x+20},1000)
            .onComplete(function () {
                _this.container.addscore.removeChild(addtext);
            }).start();
    }
};