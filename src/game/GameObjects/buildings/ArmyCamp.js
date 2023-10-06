var ArmyCamp = Building.extend({
    _width: null,
    _height: null,
    ctor: function (type,level,id, posX, posY) {
        this._super(type,level,id, posX, posY);
        this.init();
        this.loadSprite(res_map.SPRITE.BODY.ARMY_CAMP[1], null, 0);
        this.loadSubSprite();
    },


});