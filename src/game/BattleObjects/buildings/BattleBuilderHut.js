var BattleBuilderHut = BattleBuilding.extend({
    _type: BUILDING_TYPE.BUILDER_HUT,
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level], null, 1, false, res_map.SPRITE.BODY.BUILDER_HUT.JUNK);
    },
});
