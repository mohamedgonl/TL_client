var ArmyCamp = Building.extend({
    _width: null,
    _height: null,
    ctor: function (level,id, posX, posY) {
        this._super(level,id, posX, posY);
        this._width = 3;
        this._height = 3;
        this.loadSprite(res_map.SPRITE.BODY.ARMY_CAMP[1], null, 0);
        this.loadSubSprite();
    },


});