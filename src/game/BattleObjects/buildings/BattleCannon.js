var BattleCannon = BattleDefence.extend({
    _type: "DEF_1",

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
        const config = LoadManager.getInstance().getConfig(this._type, level);
        const baseConfig = LoadManager.getInstance().getDefBaseConfig(this._type);
        this.damagePerShot = config.damagePerShot;
        this.minRange = baseConfig.minRange;
        this.maxRange = baseConfig.maxRange;
        this.attackSpeed = baseConfig.attackSpeed;
        // var upper_sprite =  res_map.SPRITE.BODY.CANNON.UPPER[level];
        // this.loadSprite(res_map.SPRITE.BODY.CANNON.BOTTOM[level],upper_sprite,2);
        // this.loadSubSprite();
    },

    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.CANNON[level][0], null, 2, null, res_map.SPRITE.BODY.CANNON.JUNK);
    },

    // attack: function (target) {
    //     const bullet = Bullet.getOrCreateBullet(this._type, {
    //         x: this.x,
    //         y: this.y,
    //         _posX: this.centerPoint.x,
    //         _posY: this.centerPoint.y
    //     }, target, this.damagePerShot);
    // },

});