var ArcherTower = Building.extend({
    _type: "DEF_2",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
    },
    loadMainSpriteByLevel: function (level) {
        this.loadMainSprite(res_map.SPRITE.BODY.ARCHER_TOWER[level],res_map.SPRITE.BODY.ARCHER_TOWER.UPPER[level][0],0);
        // this.loadMainSprite(res_map.SPRITE.BODY.CANNON[level][0],null,2);
    },
});