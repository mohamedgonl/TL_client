var BattleCannon = BattleDefence.extend({
    _type: "DEF_1",
    deltaBarrelPosition: {//vi tri nong sung so voi center theo tung huong
        0: {dx: 0, dy: -35,},
        1: {dx: -20, dy: -20,},
        2: {dx: -25, dy: -5,},
        3: {dx: -20, dy: 20,},
        4: {dx: 0, dy: 20,},
        5: {dx: 20, dy: 15,},
        6: {dx: 25, dy: 0,},
        7: {dx: 25, dy: -20,},
    },

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        this._fire = new cc.Sprite();
        this._fire.setAnchorPoint(0.5, 0.5);
        this._fire.setScale(0.7, 0.7);
        this._fire.setPosition(this._body.x + this.deltaBarrelPosition[0].dx, this._body.y + this.deltaBarrelPosition[0].dy);
        this.addChild(this._fire);

        //init animation
        this.actionFire = fr.createActionByFrames(res_map.SPRITE.BODY.CANNON.FIRE, {
            delayPerUnit: 0.1,
            restoreOriginalFrame: true
        });
        this.actionFire.retain();
    },

    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.CANNON[level][0], null, 2, null, res_map.SPRITE.BODY.CANNON.JUNK);
    },

    setDirection: function (direct) {
        this.direct = direct;
        if (this.direct <= TOTAL_DEFENCE_DIRECT / 2) {
            this._body.setTexture(res_map.SPRITE.BODY.CANNON[this._level][this.direct]);
            this._body.flippedX = false;
        } else {
            this._body.setTexture(res_map.SPRITE.BODY.CANNON[this._level][TOTAL_DEFENCE_DIRECT - this.direct]);
            this._body.flippedX = true;
        }
        this._fire.setPosition(this._body.x + this.deltaBarrelPosition[this.direct].dx, this._body.y + this.deltaBarrelPosition[this.direct].dy);
    },

    attack: function (target) {
        //logic
        this._super(target, cc.p(this.x + this.deltaBarrelPosition[this.direct].dx,
            this.y + this.deltaBarrelPosition[this.direct].dy));

        //UI
        //run action attack
        const directCfg = this.direct <= TOTAL_DEFENCE_DIRECT / 2 ? this.direct : TOTAL_DEFENCE_DIRECT - this.direct

        let actionAttack = fr.createActionByFrames(res_map.SPRITE.BODY.CANNON['ATK_' + directCfg][this._level], {
            delayPerUnit: 0.1,
            restoreOriginalFrame: false
        });
        this._body.runAction(actionAttack);

        //run action fire
        this._fire.stopAction(this.actionFire);
        this._fire.runAction(this.actionFire);
    },

});