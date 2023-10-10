var ClanCastle = Building.extend({
    _type: "CLC_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);


    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.CLAN_CASTLE[1],null,1);
    }
});