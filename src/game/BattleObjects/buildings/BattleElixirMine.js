var BattleElixirMine = BattleBaseMine.extend({
    _type: "RES_2",
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
        let config = LoadManager.getInstance().getConfig(this._type, this._level)
        this._capacityElixir = config.capacity;
        this._productivityElixir = config.productivity;
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],
            res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level], 1, 1);
    },

    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation) {
        this._super(bodySprite, upperSprite, shadow_type, isUpperAnimation);
        let icon = this._iconHarvest.getChildByName("icon");
        icon.setTexture(res.ICON.ELIXIR);
    },
});
