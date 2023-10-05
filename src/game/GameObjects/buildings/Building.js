
// Constructor Building
//  level: level of building
//  posX: position x of building
//  posY: position y of building
var Building = GameObject.extend({
    hitpoints: null,
    level: null,
    state:null,
    timeStart: null,
    timeDone: null,
    yesButton: null,
    noButton: null,
    _posX: null,
    _posY: null,
    _width: null,
    _height: null,
    _tempPosX: null,
    _tempPosY: null,
    arrow_move: null,
    ctor: function (level,id,posX,posY) {
        this._super();
        this.level = level;
        this._posX = posX;
        this._posY = posY;
        this._id = id;

        this.setAnchorPoint(0.5,0.5);

    },

    //load sprite with size,
    //shadow_type = 1 for quare, 2 for circle, 0 for no shadow
    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation) {

        var size = this._width;
        //body and grass
        this._body = new cc.Sprite(bodySprite);
        this._grass = new cc.Sprite(res_map.SPRITE.GRASS.BUILDING[size]);
        this._body.setAnchorPoint(0.5,0.5);
        this._grass.setAnchorPoint(0.5,0.5);

        this._body.setScale(SCALE_BUILDING_BODY);

        //shadow
        if(shadow_type == 1){
            this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW[size]);
            this._shadow.setAnchorPoint(0.5,0.5);
        }
        else if(shadow_type == 2){
            this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW.CIRCLE);
           this._shadow.setAnchorPoint(0.5,0.5);
        }

        //add child
        this.addChild(this._grass);
        if(shadow_type != 0)
            this.addChild(this._shadow);
        this.addChild(this._body);

        //upper
        if(upperSprite != null){
            if(isUpperAnimation){
                this._upper = new cc.Sprite();
                this.addChild(this._upper,999);

                var animation = new cc.Animation();
                var countFrame = Object.keys(upperSprite).length;
                cc.log("countFrame: ---------------------------------" + countFrame);

                for (var i = 0; i < countFrame; i++) {
                    cc.log("upperSprite[i]: ---------------------------------" + upperSprite[i]);
                    var frame = new cc.SpriteFrame(upperSprite[i]);
                    animation.addSpriteFrame(frame);
                }

                animation.setDelayPerUnit(0.3);
                animation.setRestoreOriginalFrame(true);
                var action = cc.animate(animation);

                this._upper.runAction(cc.repeatForever(action))

                this._upper.setAnchorPoint(0.5, 0.5);
                this._upper.setScale(SCALE_BUILDING_BODY);
            }
            else {
                this._upper = new cc.Sprite(upperSprite);
                this.addChild(this._upper);
                this._upper.setAnchorPoint(0.5, 0.5);
                this._upper.setScale(SCALE_BUILDING_BODY);
            }
        }
    },
    loadSubSprite: function(){
        cc.log("loadSub :::::",this._id)
        //arrow move
        this.arrow_move = new cc.Sprite(res_map.SPRITE.ARROW_MOVE[this._width]);
        this.arrow_move.setAnchorPoint(0.5,0.5);
        this.arrow_move.setScale(SCALE_BUILDING_BODY);
        this.arrow_move.setPosition(0,0);
        this.arrow_move.setVisible(false);
        this.addChild(this.arrow_move);

    },

    //load config from config file and set attribute
    loadConfig: function (config) {
        //var config =ConfigManager.Instance().getConfigTownHall(this.level);

        if(config["width"]&&config["height"]) {
            this._width = config["width"];
            this._height = config["height"];
        }

        for(var key in config){
            if(key != "width" && key != "height")
            this[key] = config[key];
        }
    },
    setState: function (state) {
        this.state = state;
    },
    onSelected: function(){
        cc.log("building id in onSelected---------------",this._id);
        this.arrow_move.setVisible(true);
    },
    onUnselected: function(){
          this.arrow_move.setVisible(false);
    }

});