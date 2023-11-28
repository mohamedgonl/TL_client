var ArcherTower = Building.extend({
    _type: BUILDING_TYPE.ARCHER_TOWER,
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        this._damage = LoadManager.getInstance().getConfig(this._type,this._level,"damagePerShot");
    },
    loadMainSpriteByLevel: function (level) {
        this.loadMainSprite(res_map.SPRITE.BODY.ARCHER_TOWER.BOTTOM[level],res_map.SPRITE.BODY.ARCHER_TOWER.UPPER.IDLE[level],1);
        // this.loadMainSprite(DEF_2[level].shadow,DEF_2[level].archer_idle[0],0);
        // this.loadMainSprite(res_map.SPRITE.BODY.CANNON[level][0],null,2);
    },
});