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

        this._minRangeSquare = this._minRange * this._minRange;
        this._maxRangeSquare = this._maxRange * this._maxRange;

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

    findTarget: function (troops) {
        //remove target if dead or out of range
        if (this.target != null && (!this.target.isAlive() || !this.isTargetInRange(this.target))) {
            this.target = null;
        }

        if (this.target != null)
            return;

        //find new target
        let listTroopsAttackThis = [];//troops attacking this def
        let listAttackingTroops = [];
        let listSatisfyTroops = [];

        for (let troop of troops) {
            if (troop == null || !troop.isAlive()
                || !this.checkTargetType(troop) || !this.isTargetInRange(troop)) continue;

            listSatisfyTroops.push(troop);

            if (troop._state === TROOP_STATE.ATTACK) {
                if (troop._target != null && troop._target._id === this._id) {
                    listTroopsAttackThis.push(troop);
                }
                listAttackingTroops.push(troop);
            }
        }

        this.findNearestTarget(listTroopsAttackThis);
        if (this.target != null) {
            return;
        }
        this.findNearestTarget(listAttackingTroops);
        if (this.target != null) {
            return;
        }
        this.findNearestTarget(listSatisfyTroops);
    },
    findNearestTarget: function (troops) {
        let minimumDist = Number.MAX_VALUE;
        let newTarget = null;

        for (let troop of troops) {
            let dx = Math.abs(this.centerPoint.x - troop._posX);
            let dy = Math.abs(this.centerPoint.y - troop._posY);

            let distSquare = dx * dx + dy * dy;
            if (distSquare < minimumDist) {
                minimumDist = distSquare;
                newTarget = troop;
            }
        }
        if (newTarget != null) {
            this.setTarget(newTarget);
        }
    },

    //check troop attack area
    checkTargetType: function (target) {
        // target in air
        if (target.isOverhead && this.attackArea === DEF_ATTACK_AREA.GROUND) {
            return false;
        }
        // target on ground
        if (!target.isOverhead && this.attackArea === DEF_ATTACK_AREA.OVERHEAD) {
            return false;
        }
        return true;
    },

    hasTarget: function () {
        return this.target && this.target.isAlive();
    },

    isTargetInRange: function (target) {
        //check distance
        let dx = Math.abs(this.centerPoint.x - target._posX);
        let dy = Math.abs(this.centerPoint.y - target._posY);

        if (dx > this._maxRange || dy > this._maxRange)
            return false;

        let distSquare = dx * dx + dy * dy;
        return distSquare >= this._minRangeSquare && distSquare <= this._maxRangeSquare;
    },

    attack: function (target) {
        //{-1, -1} la toa do vector thang dung, chieu tu tren xuong duoi (huong 6h)
        let angle = cc.radiansToDegrees(cc.pAngleSigned(cc.p(target._posX - this.centerPoint.x, target._posY - this.centerPoint.y), cc.p(-1, -1)));
        if (angle < 0) angle += 360;

        let newDirect = Math.round(angle * TOTAL_DEFENCE_DIRECT / 360);
        if (newDirect >= TOTAL_DEFENCE_DIRECT)
            newDirect -= TOTAL_DEFENCE_DIRECT;

        if (newDirect !== this.direct) {
            this.setDirection(newDirect);
        }

        let bulletInitPos;
        if (this.deltaBarrelPosition)
            bulletInitPos = cc.p(this.x + this.deltaBarrelPosition[this.direct].dx,
                this.y + this.deltaBarrelPosition[this.direct].dy)
        else bulletInitPos = cc.p(this.x, this.y)

        const bullet = BattleManager.getInstance().getOrCreateBullet(this._type, {
            x: this.x,
            y: this.y,
            _posX: this.centerPoint.x,
            _posY: this.centerPoint.y
        }, target, this.damagePerShot, this._attackRadius, this.attackArea, bulletInitPos);

        LogUtils.writeLog('def ' + this._id + ' fire to ' + target._posX + ' ' + target._posY)
    },
});
