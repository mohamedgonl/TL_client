var BattleTownhall = BattleBaseStorage.extend({
    _type: "TOW_1",
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        let config = LoadManager.getInstance().getConfig(this._type, this._level);
        this._currentGold = 0;
        this._currentElixir = 0;
        this._capacityGold = config.capacityGold;
        this._capacityElixir = config.capacityElixir;
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.TOWNHALL[level], null, 1, null, res_map.SPRITE.BODY.TOWNHALL.JUNK);
    },

});


