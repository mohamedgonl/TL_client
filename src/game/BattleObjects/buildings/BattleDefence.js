var BattleDefence = BattleBuilding.extend({
    targetQueue: [],
    attackCd: 0,
    direct: 0, // from 0 -> TOTAL_DEFENCE_DIRECT

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        let config = LoadManager.getInstance().getDefBaseConfig(this._type);
        this._minRange = config.minRange * 3;
        this._maxRange = config.maxRange * 3;
        this.targetQueue = [];
        this.centerPoint = cc.p(this._posX + Math.floor(this._width / 2), this._posY + Math.floor(this._height / 2))
    },

    setDirection: function (direct) {
        this.direct = direct;
        if (direct <= TOTAL_DEFENCE_DIRECT / 2) {
            this._body.setTexture(res_map.SPRITE.BODY.CANNON[this._level][direct]);
            this._body.flippedX = false;
        } else {
            this._body.setTexture(res_map.SPRITE.BODY.CANNON[this._level][TOTAL_DEFENCE_DIRECT - direct]);
            this._body.flippedX = true;
        }
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
        //{-1, -1} la toa do vector thang dung, chieu tu tren xuong duoi (huong 6h)
        let angle = cc.radiansToDegrees(cc.pAngleSigned(cc.p(target._posX - this.centerPoint.x, target._posY - this.centerPoint.y), cc.p(-1, -1)));
        if (angle < 0) angle += 360;

        let newDirect = Math.round(angle * TOTAL_DEFENCE_DIRECT / 360);
        if (newDirect > TOTAL_DEFENCE_DIRECT)
            newDirect -= TOTAL_DEFENCE_DIRECT;

        if (newDirect !== this.direct) {
            this.setDirection(newDirect);
        }

        const bullet = Bullet.getOrCreateBullet(this._type, {
            x: this.x,
            y: this.y,
            _posX: this.centerPoint.x,
            _posY: this.centerPoint.y
        }, target, this.damagePerShot);
    },

});
