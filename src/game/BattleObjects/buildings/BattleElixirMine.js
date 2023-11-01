var BattleElixirMine = BattleBaseMine.extend({
    _type: "RES_2",
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],
            res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level], 1, 1, res_map.SPRITE.BODY.ELIXIR_MINE.JUNK);
    },
});
