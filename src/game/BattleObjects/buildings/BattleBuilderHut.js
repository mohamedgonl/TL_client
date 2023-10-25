var BattleBuilderHut = BattleBuilding.extend({
    _type: "BDH_1",
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level], null, 1);
    },
    onAddIntoMapManager: function () {
        this._super();
    }
});
