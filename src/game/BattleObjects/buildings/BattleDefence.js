var BattleDefence = BattleBuilding.extend({
    target: null,
    attackCd: 0,
    direct: 0, // from 0 -> TOTAL_DEFENCE_DIRECT - 1
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        let config = LoadManager.getInstance().getConfig(this._type, level);
        this.damagePerShot = config.damagePerShot;

        let defConfig = LoadManager.getInstance().getDefBaseConfig(this._type);
        this._minRange = defConfig.minRange * GRID_BATTLE_RATIO;
        this._maxRange = defConfig.maxRange * GRID_BATTLE_RATIO;
        this._attackRadius = defConfig.attackRadius * GRID_BATTLE_RATIO;
        this.attackSpeed = defConfig.attackSpeed;
        this.attackArea = defConfig.attackArea;

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

        LogUtils.writeLog('def ' + this._id + ' set new target ' + target._type)
    },

    //check if troop can be added as new target
    checkTarget: function (target) {
        // target in air
        if (target.isOverhead && this.attackArea === DEF_ATTACK_AREA.GROUND) {
            return false;
        }
        // target on ground
        if (!target.isOverhead && this.attackArea === DEF_ATTACK_AREA.OVERHEAD) {
            return false;
        }
        return this.isTargetInRange(target);
    },

    hasTarget: function () {
        return this.target && this.target.isAlive();
    },

    //check if current target is still valid or not
    //set current target to null if not valid
    validateCurrentTarget: function () {
        if (!this.hasTarget()) {
            this.target = null;
            return;
        }
        if (!this.isTargetInRange(this.target)) {
            this.target = null;
        }
    },

    isTargetInRange: function (target) {
        //check distance
        let dist = Math.sqrt(Math.pow(this.centerPoint.x - target._posX, 2) + Math.pow(this.centerPoint.y - target._posY, 2));
        dist = Utils.roundFloat(dist, 2);
        LogUtils.writeLog("dist from def " + this._type + " to target "+target._posX +" " + target._posY + " is "+ dist);

        return dist > this._minRange && dist < this._maxRange;
    },

    attack: function (target, bulletInitPos) {
        //{-1, -1} la toa do vector thang dung, chieu tu tren xuong duoi (huong 6h)
        let angle = cc.radiansToDegrees(cc.pAngleSigned(cc.p(target._posX - this.centerPoint.x, target._posY - this.centerPoint.y), cc.p(-1, -1)));
        if (angle < 0) angle += 360;

        let newDirect = Math.round(angle * TOTAL_DEFENCE_DIRECT / 360);
        if (newDirect >= TOTAL_DEFENCE_DIRECT)
            newDirect -= TOTAL_DEFENCE_DIRECT;

        if (newDirect !== this.direct) {
            this.setDirection(newDirect);
        }

        //logic
        if (!bulletInitPos)
            bulletInitPos = cc.p(this.x, this.y);
        const bullet = BattleManager.getInstance().getOrCreateBullet(this._type, {
            x: this.x,
            y: this.y,
            _posX: this.centerPoint.x,
            _posY: this.centerPoint.y
        }, target, this.damagePerShot, this._attackRadius, bulletInitPos);

        LogUtils.writeLog('def ' + this._id + ' fire to ' + target._posX + ' ' + target._posY)
    },
});
