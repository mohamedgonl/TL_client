var BuilderHut = Building.extend({
        _width: 2,
        _height: 2,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);
        this.init();
    },

    init: function (){
        this._super();
        //this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.setAnchorPoint(0.5,0.5);

        //building
        this.level = 1;
        this.state = "idle";
        this.timeStart = null;
        this.timeDone = null;

        //game object init

        this._body = new cc.Sprite(res_map.SPRITE.BODY.BUILDER_HUT.LEVEL_1);
        this._grass = new cc.Sprite(res_map.SPRITE.GRASS.BUILDING.SIZE_2);
        this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW.SIZE_2);

        this._body.setAnchorPoint(0.5,0.5);
        this._grass.setAnchorPoint(0.5,0.5);
        this._shadow.setAnchorPoint(0.5,0.5);

        this._body.setScale(0.5);

        this.addChild(this._body, 2);
        this.addChild(this._grass, 0);
        this.addChild(this._shadow, 1);


    }



});