var BuilderHut = Building.extend({

    ctor: function (type,level,id,posX,posY,status,startTime,endTime) {
        this._super(type,level,id,posX,posY,status,startTime,endTime);

        this.init();
        this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level],null,1)
        this.loadSubSprite();
    },

    init: function () {
    }

});