var BattleTownhall = BattleBaseStorage.extend({
    _type: "TOW_1",
    totalFlame: 3,

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        this.flame1 = new cc.Sprite();
        // this.flame1.setScale(0.7, 0.7);
        this.flame1.setPosition(this._body.x, this._body.y + 20);
        this.addChild(this.flame1, BATTLE_ZORDER_BUILDING_ANIMATION);

        this.flame2 = new cc.Sprite();
        // this.flame1.setScale(0.7, 0.7);
        this.flame2.setPosition(this._body.x - 25, this._body.y + 10);
        this.addChild(this.flame2, BATTLE_ZORDER_BUILDING_ANIMATION);

        this.flame3 = new cc.Sprite();
        // this.flame1.setScale(0.7, 0.7);
        this.flame3.setPosition(this._body.x + 25, this._body.y + 10);
        this.addChild(this.flame3, BATTLE_ZORDER_BUILDING_ANIMATION);

        // init animation
        this.actionFlame = fr.createActionByFrames(res_map.SPRITE.TOWN_HALL_FLAME, {
            delayPerUnit: 0.1,
            restoreOriginalFrame: true
        });
        this.actionFlame.retain();
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.TOWNHALL[level], null, 1, null, res_map.SPRITE.BODY.TOWNHALL.JUNK);
    },

    onGainDamage: function (damage) {
        this._super(damage);

        const hpRatio = this._hp / this._maxHp;
        if (!this.flame1Active && hpRatio < 0.9) {
            this.flame1Active = true;
            this.flame1.runAction(this.actionFlame.repeatForever());
        }
        if (!this.flame2Active && hpRatio < 0.6) {
            this.flame2Active = true;
            this.flame2.runAction(this.actionFlame.clone().repeatForever());
        }
        if (!this.flame3Active && hpRatio < 0.3) {
            this.flame3Active = true;
            this.flame3.runAction(this.actionFlame.clone().repeatForever());
        }
    },

    onDestroy: function (){
        this._super();
        this.flame1.stopAllActions();
        this.flame2.stopAllActions();
        this.flame3.stopAllActions();
        this.flame1.setVisible(false);
        this.flame2.setVisible(false);
        this.flame3.setVisible(false);
    }
});


