var BattleArcherTower = BattleDefence.extend({
    _type: "DEF_2",

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
        this.loadSprite(res_map.SPRITE.BODY.ARCHER_TOWER[level], res_map.SPRITE.BODY.ARCHER_TOWER.UPPER.ATTACK[level],
            null, null, res_map.SPRITE.BODY.ARCHER_TOWER.JUNK);
    },

    setDirection: function (direct) {
        this.direct = direct;
        if (direct <= TOTAL_DEFENCE_DIRECT / 2) {
            this._upper.setTexture(res_map.SPRITE.BODY.ARCHER_TOWER.UPPER.IDLE[this._level][direct]);
            this._upper.flippedX = false;
        } else {
            this._upper.setTexture(res_map.SPRITE.BODY.ARCHER_TOWER.UPPER.IDLE[this._level][TOTAL_DEFENCE_DIRECT - direct]);
            this._upper.flippedX = true;
        }
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