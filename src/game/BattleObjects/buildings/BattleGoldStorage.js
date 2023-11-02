var BattleGoldStorage = BattleBaseStorage.extend({
    _type: "STO_1",
    _resourceType: RESOURCE_TYPE.GOLD,

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
    },
    //load sprite by level , type = 0, 1 , 2, 3 (0->25%,26->50%,51->75%,76->100%)
    loadSpriteByLevel: function (level, type = 0) {
        this.loadSprite(res_map.SPRITE.BODY.GOLD_STORAGE[level][type], null, 1, null, res_map.SPRITE.BODY.GOLD_STORAGE.JUNK);
    },
});