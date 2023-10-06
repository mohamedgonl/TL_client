
// Constructor Building
//  level: level of building
//  posX: position x of building
//  posY: position y of building
var Building = GameObject.extend({
    _hitpoints: null,
    _level: null,
    _state:null,
    _timeStart: null,
    _timeDone: null,
    _yesButton: null,
    _noButton: null,
    _width: null,
    _height: null,
    _arrow_move: null,

    //  example: building = new Townhall(type, level,id, posX, posY);
    ctor: function (type,level =1 ,id,posX,posY) {

        this._super();
        this._level = level;
        this._posX = posX;
        this._posY = posY;
        this._id = id;
        this._type = type ;
        cc.log("before get config ------------type: " + type + " level: " + level);
        let config = LoadManager.Instance().getConfig(this._type,level);
        this._width = config.width;
        this._height = config.height;
        this._hitpoints = config.hitpoints;


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
        if(shadow_type === 1){
            this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW[size]);
            this._shadow.setAnchorPoint(0.5,0.5);
        }
        else if(shadow_type === 2){
            this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW.CIRCLE);
           this._shadow.setAnchorPoint(0.5,0.5);
        }

        //add child
        this.addChild(this._grass);
        if(shadow_type !== 0)
            this.addChild(this._shadow);
        this.addChild(this._body);

        //upper
        if(upperSprite != null){
            if(isUpperAnimation){

                this._upper = new cc.Sprite(upperSprite[0]);
                this.addChild(this._upper,999);

                var animation = new cc.Animation();
                var countFrame = Object.keys(upperSprite).length;


                for (var i = 0; i < countFrame; i++) {
                    animation.addSpriteFrameWithFile(upperSprite[i]);
                }
                cc.log(animation.getFrames().length);
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
        //arrow move
        this._arrow_move = new cc.Sprite(res_map.SPRITE.ARROW_MOVE[this._width]);
        this._arrow_move.setAnchorPoint(0.5,0.5);
        this._arrow_move.setScale(SCALE_BUILDING_BODY);
        this._arrow_move.setPosition(0,0);
        this._arrow_move.setVisible(false);
        this.addChild(this._arrow_move);

    },

    setState: function (state) {
        this.state = state;
    },
    onSelected: function(){
        this._arrow_move.setVisible(true);
    },
    onUnselected: function(){
          this._arrow_move.setVisible(false);
    },

    setType: function (type) {
        this._type = type;
    },

    getType: function () {
        return this._type;
    }

});