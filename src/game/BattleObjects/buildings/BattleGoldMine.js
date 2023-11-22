var BattleGoldMine = BattleStorage.extend({
    _type: "RES_1",
    _resourceType: RESOURCE_TYPE.GOLD,

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
    },

    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],
            res_map.SPRITE.BODY.GOLD_MINE.UPPER[level], 1, null, res_map.SPRITE.BODY.GOLD_MINE.JUNK);
        // this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],
        //     res_map.SPRITE.BODY.GOLD_MINE.UPPER[level], 1, null, res_map.SPRITE.BODY.GOLD_MINE.JUNK);
    },

});
