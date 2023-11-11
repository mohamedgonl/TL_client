var ArcherTower = Building.extend({
    _type: "DEF_2",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
    },
    loadMainSpriteByLevel: function (level) {
        cc.log("ARCHER",res_map.SPRITE.BODY.ARCHER_TOWER[level])
        this.loadMainSprite(res_map.SPRITE.BODY.ARCHER_TOWER[level],res_map.SPRITE.BODY.ARCHER_TOWER.ATK_0[level],1);
        // this.loadMainSprite(DEF_2[level].shadow,DEF_2[level].archer_idle[0],0);
        // this.loadMainSprite(res_map.SPRITE.BODY.CANNON[level][0],null,2);
    },
});