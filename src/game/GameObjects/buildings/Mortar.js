var Mortar = Building.extend({
    _type: "DEF_3",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        this._damage = LoadManager.getInstance().getConfig(this._type,this._level,"damagePerShot");
    },
    loadMainSpriteByLevel: function (level) {
        this.loadMainSprite(null,res_map.SPRITE.BODY.MORTAR.BOTTOM[level],1);
    },

});