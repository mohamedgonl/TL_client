var GoldMine = Building.extend({
    _upper: null,
    _width: 3,
    _height: 3,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);
        this.loadSprite();
    },

    loadSprite: function ()
    {
        this._body = new cc.Sprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM.LEVEL_1);
        this._grass = new cc.Sprite(res_map.SPRITE.GRASS.BUILDING.SIZE_3);
        this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW.SIZE_3);

        //chưa làm ảnh động phần upper
        this._upper = new cc.Sprite(res_map.SPRITE.BODY.GOLD_MINE.UPPER.LEVEL_1 + "/image0000.png");

        this._body.setAnchorPoint(0.5,0.5);
        this._grass.setAnchorPoint(0.5,0.5);
        this._shadow.setAnchorPoint(0.5,0.5);
        this._upper.setAnchorPoint(0.5,0.5);

        this._body.setScale(0.5);
        this._upper.setScale(0.5);

        this.addChild(this._body, 2);
        this.addChild(this._grass, 0);
        this.addChild(this._shadow, 1);
        this.addChild(this._upper,3);
    },




});