var BattleArmyCamp = BattleBuilding.extend({
    _type: "AMC_1",
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
        // this.loadSprite(res_map.SPRITE.BODY.ARMY_CAMP[1], null, 0);
        // this.loadSubSprite();
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.ARMY_CAMP[level], null, 0);
    }
});