
// Constructor Building
// @param level: level of building
// @param posX: position x of building
// @param posY: position y of building
// @param nameBuilding: name of building
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
    loadSprite: function (  bodySprite, upperSprite, shadow_type) {

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
            this._upper = new cc.Sprite(upperSprite);
            this.addChild(this._upper);
            this._upper.setAnchorPoint(0.5,0.5);
            this._upper.setScale(SCALE_BUILDING_BODY);
        }
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
    }

});