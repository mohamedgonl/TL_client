var BattleDefence = BattleBuilding.extend({
    target: null,
    attackCd: 0,
    direct: 0, // from 0 -> TOTAL_DEFENCE_DIRECT

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        let config = LoadManager.getInstance().getDefBaseConfig(this._type);
        this._minRange = config.minRange * 3;
        this._maxRange = config.maxRange * 3;
        this._attackRadius = config.attackRadius * 3;
        this.target = null;
        this.centerPoint = cc.p(this._posX + Math.floor(this._width / 2), this._posY + Math.floor(this._height / 2))
    },

    setDirection: function (direct) {
    },

    gameLoop: function (dt) {
        if (this.attackCd > 0) {
            this.attackCd -= dt;
            return;
        }
        if (!this.hasTarget())
            return;

        this.attackCd = this.attackSpeed;
        this.attack(this.target);
    },

    setTarget: function (target) {
        this.target = target;
    },

    //check if troop can be added as new target
    checkTarget: function (target) {
        //todo: check target type

        return this.isTargetInRange(target);
    },

    hasTarget: function () {
        return this.target && this.target.isAlive();
    },

    //check if current target is still valid or not
    //set current target to null if not valid
    validateCurrentTarget: function () {
        if (!this.hasTarget()){
            this.target = null;
            return;
        }
        if (!this.isTargetInRange(this.target)){
            this.target = null;
        }
    },

    isTargetInRange: function (target) {
        //check distance
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

        //logic
        const bullet = Bullet.getOrCreateBullet(this._type, {
            x: this.x,
            y: this.y,
            _posX: this.centerPoint.x,
            _posY: this.centerPoint.y
        }, target, this.damagePerShot, this._attackRadius);
    },

});
