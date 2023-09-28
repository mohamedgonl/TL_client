var ArmyCamp = Building.extend({
    _width: 5,
    _height: 5,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);
        this.loadSprite();
        this.init();
    },
    loadSprite: function ()
    {
        this._body = new cc.Sprite(res_map.SPRITE.BODY.ARMY_CAMP.LEVEL_1);
        this._grass = new cc.Sprite(res_map.SPRITE.GRASS.BUILDING.SIZE_5);
        this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW.SIZE_5);

        this._body.setAnchorPoint(0.5,0.5);
        this._grass.setAnchorPoint(0.5,0.5);
        this._shadow.setAnchorPoint(0.5,0.5);

        this._body.setScale(0.5);

        this.addChild(this._body, 2);
        this.addChild(this._grass, 0);
        this.addChild(this._shadow, 1);
    },

    init: function (){
        this._super();
        this.setAnchorPoint(0.5,0.5);

        //building
        this.level = 1;
        this.state = "idle";
        this.timeStart = null;
        this.timeDone = null;

        //game object init


    }



});