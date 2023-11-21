var BattleArcherTower = BattleDefence.extend({
    _type: "DEF_2",

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
    },

    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.ARCHER_TOWER.BOTTOM[level], res_map.SPRITE.BODY.ARCHER_TOWER.UPPER.ATTACK[level],
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
        this._super(target, cc.p(this.x, this.y));

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