var BattleMortar = BattleDefence.extend({
    _type: "DEF_3",

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
        const config = LoadManager.getInstance().getConfig(this._type, level);
        const baseConfig = LoadManager.getInstance().getDefBaseConfig(this._type);
        this.damagePerShot = config.damagePerShot;
        this.minRange = baseConfig.minRange;
        this.maxRange = baseConfig.maxRange;
        this.attackSpeed = baseConfig.attackSpeed;
        // var upper_sprite =  res_map.SPRITE.BODY.MORTAR.UPPER[level];
        // this.loadSprite(res_map.SPRITE.BODY.MORTAR.BOTTOM[level],upper_sprite,2);
        // this.loadSubSprite();
    },

    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.MORTAR[level][0], null, 2, null, res_map.SPRITE.BODY.MORTAR.JUNK);
    },

    setDirection: function (direct) {
        this.direct = direct;
        if (direct <= TOTAL_DEFENCE_DIRECT / 2) {
            this._body.setTexture(res_map.SPRITE.BODY.MORTAR[this._level][direct]);
            this._body.flippedX = false;
        } else {
            this._body.setTexture(res_map.SPRITE.BODY.MORTAR[this._level][TOTAL_DEFENCE_DIRECT - direct]);
            this._body.flippedX = true;
        }
    },

    attack: function (target) {
        //logic
        this._super(target);

        //UI
        //run action attack
        const directCfg = this.direct <= TOTAL_DEFENCE_DIRECT / 2 ? this.direct : TOTAL_DEFENCE_DIRECT - this.direct

        let actionAttack = fr.createActionByFrames(res_map.SPRITE.BODY.MORTAR['ATK_' + directCfg][this._level], {
            delayPerUnit: 0.1,
            restoreOriginalFrame: true
        });
        this._body.runAction(actionAttack);
    },

});