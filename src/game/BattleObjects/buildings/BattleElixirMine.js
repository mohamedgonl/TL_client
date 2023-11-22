var BattleElixirMine = BattleStorage.extend({
    _type: "RES_2",
    _resourceType: RESOURCE_TYPE.ELIXIR,

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],
            res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level], 1, null, res_map.SPRITE.BODY.ELIXIR_MINE.JUNK);
        // this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],
        //     res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level], 1, 1, res_map.SPRITE.BODY.ELIXIR_MINE.JUNK);
    },
});
