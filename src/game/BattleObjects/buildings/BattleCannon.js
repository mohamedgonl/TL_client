var BattleCannon = BattleBuilding.extend({
    _type: "DEF_1",
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
        // var upper_sprite =  res_map.SPRITE.BODY.CANNON.UPPER[level];
        // this.loadSprite(res_map.SPRITE.BODY.CANNON.BOTTOM[level],upper_sprite,2);
        // this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.CANNON[level][0], null, 2);
    },
});