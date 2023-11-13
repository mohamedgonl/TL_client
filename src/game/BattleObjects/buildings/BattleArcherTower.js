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

    attack: function (target) {
        //logic
        this._super(target);

        //UI
        //run action attack
        const directCfg = this.direct <= TOTAL_DEFENCE_DIRECT / 2 ? this.direct : TOTAL_DEFENCE_DIRECT - this.direct

        let actionAttack = fr.createActionByFrames(res_map.SPRITE.BODY.ARCHER_TOWER['ATK_' + directCfg][this._level], {
            delayPerUnit: 0.07,
            restoreOriginalFrame: false
        });
        this._upper.runAction(actionAttack);
    },

});