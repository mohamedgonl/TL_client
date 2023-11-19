var BattleMortar = BattleDefence.extend({
    _type: "DEF_3",

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
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
        this._super(target,  cc.p(this.x, this.y));

        //UI
        //run action attack
        const directCfg = this.direct <= TOTAL_DEFENCE_DIRECT / 2 ? this.direct : TOTAL_DEFENCE_DIRECT - this.direct

        let actionAttack = fr.createActionByFrames(res_map.SPRITE.BODY.MORTAR['ATK_' + directCfg][this._level], {
            delayPerUnit: 0.1,
            restoreOriginalFrame: false
        });
        this._body.runAction(actionAttack);
    },

});