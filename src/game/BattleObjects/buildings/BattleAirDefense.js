var BattleAirDefense = BattleDefence.extend({
    _type: BUILDING_TYPE.AIR_DEFENSE,
    deltaBarrelPosition: {//vi tri nong sung so voi center theo tung huong
        0: {dx: 0, dy: -5,},
        1: {dx: -15, dy: 0,},
        2: {dx: -25, dy: 10,},
        3: {dx: -20, dy: 40,},
        4: {dx: 0, dy: 45,},
        5: {dx: 20, dy: 35,},
        6: {dx: 15, dy: 20,},
        7: {dx: 30, dy: 0,},
    },

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        this._fire = new cc.Sprite();
        this._fire.setAnchorPoint(0.5, 0.5);
        this._fire.setScale(0.7, 0.7);
        this._fire.setPosition(this._upper.x + this.deltaBarrelPosition[0].dx, this._upper.y + this.deltaBarrelPosition[0].dy);
        this.addChild(this._fire);

        //init animation
        this.actionFire = fr.createActionByFrames(res_map.SPRITE.BODY.AIR_DEFENSE.FIRE, {
            delayPerUnit: 0.1,
            restoreOriginalFrame: true
        });
        this.actionFire.retain();
    },

    loadSpriteByLevel: function (level) {
        this.loadSprite(null, res_map.SPRITE.BODY.AIR_DEFENSE.BOTTOM[level], 2, null, res_map.SPRITE.BODY.AIR_DEFENSE.JUNK);
    },

    setDirection: function (direct) {
        this.direct = direct;
        if (this.direct <= TOTAL_DEFENCE_DIRECT / 2) {
            this._upper.setTexture(res_map.SPRITE.BODY.AIR_DEFENSE.BOTTOM[this._level][this.direct]);
            this._upper.flippedX = false;
        } else {
            this._upper.setTexture(res_map.SPRITE.BODY.AIR_DEFENSE.BOTTOM[this._level][TOTAL_DEFENCE_DIRECT - this.direct]);
            this._upper.flippedX = true;
        }
        this._fire.setPosition(this._upper.x + this.deltaBarrelPosition[this.direct].dx, this._upper.y + this.deltaBarrelPosition[this.direct].dy);
    },

    attack: function (target) {
        //logic
        this._super(target);

        //UI
        //run action attack
        const directCfg = this.direct <= TOTAL_DEFENCE_DIRECT / 2 ? this.direct : TOTAL_DEFENCE_DIRECT - this.direct

        let actionAttack = fr.createActionByFrames(res_map.SPRITE.BODY.AIR_DEFENSE['ATK_' + directCfg][this._level], {
            delayPerUnit: 0.1,
            restoreOriginalFrame: false
        });
        this._upper.runAction(actionAttack);

        //run action fire
        this._fire.stopAction(this.actionFire);
        this._fire.runAction(this.actionFire);
    },

});