var Wall = Building.extend({
    _upper: null,

    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);



        this.loadSprite(res_map.SPRITE.BODY.WALL[level],null,0);
        this.loadSubSprite();
    },






});