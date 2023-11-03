var BattleDefence = BattleBuilding.extend({
    targetQueue: [],
    attackCd: 0,

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        let config = LoadManager.getInstance().getDefBaseConfig(this._type);
        this._minRange = config.minRange * 3;
        this._maxRange = config.maxRange * 3;
        this.targetQueue = [];
        this.centerPoint = cc.p(this._posX + Math.floor(this._width / 2), this._posY + Math.floor(this._height / 2))
        // var upper_sprite =  res_map.SPRITE.BODY.CANNON.UPPER[level];
        // this.loadSprite(res_map.SPRITE.BODY.CANNON.BOTTOM[level],upper_sprite,2);
        // this.loadSubSprite();
    },

    gameLoop: function (dt) {
        if (this.attackCd > 0) {
            this.attackCd -= dt;
            return;
        }
        if (this.targetQueue.length === 0)
            return;

        const target = this.targetQueue[0];
        this.attackCd = this.attackSpeed;
        this.attack(target);
    },

    // addTarget: function (target) {
    //     this.targetQueue.push(target);
    // },

    setListTargets: function (targets) {
        this.targetQueue = targets;
    },

    removeAllTargets: function () {
        this.targetQueue = [];
    },

    checkTargetInRange: function (target) {
        const dist = cc.pDistance(cc.p(target._posX, target._posY), this.centerPoint);
        return dist > this._minRange && dist < this._maxRange;
    },

    attack: function (target) {
    }
});
