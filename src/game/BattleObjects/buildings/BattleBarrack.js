var BattleBarrack = BattleBuilding.extend({
    _type: "BAR_1",
    _upper: null,
    _width: null,
    _height: null,

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
        this._trainingQueue = [];
        this.lastTrainingTime = 0;

    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.BARRACK[level], null, 1, false, res_map.SPRITE.BODY.BARRACK.JUNK);
    },
});