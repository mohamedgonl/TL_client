var MortarBullet = Bullet.extend({
    active: true,
    target: null,

    ctor: function (type, startPoint, target, damagePerShot, attackRadius, attackArea, initPos) {
        this._super(type, res_map.SPRITE.BODY.MORTAR.BULLET, startPoint, target, damagePerShot, attackRadius, attackArea, initPos);

        this.setScale(0.5, 0.5);

        //run action roll bullet
        let actionRoll = fr.createActionByFrames(res_map.SPRITE.BODY.MORTAR.BULLETS, {delayPerUnit: 0.1,});
        this.runAction(actionRoll.repeatForever());

        //bullet explosion
        this._explosion = new cc.Sprite();
        this._explosion.setScale(0.5, 0.5);

        this.actionExplose = fr.createActionByFrames(res_map.SPRITE.BODY.MORTAR.HIT, {delayPerUnit: 0.1,});
        this.actionExplose.retain();
    },

    init: function (startPoint, target, damagePerShot, initPos) {
        this._super(startPoint, target, damagePerShot, initPos);

        if (initPos.x === this.destination.x) {
            this.initPos.x -= 3;//random pos to make sure initPos.x != destination.x
            this.setInitPosition();
        }
        this.func = this.calcMotionFunc(initPos, cc.p((initPos.x + this.destination.x) / 2, initPos.y + 200), this.destination)
        this.distanceX = this.destination.x - initPos.x;
    },

    gameLoop: function (dt) {
        if (!this.active || this.destination === null)
            return;
        this.time -= dt;
        if (this.time <= 0) {
            this.onReachDestination();
        }
        //UI
        const newX = this.x + this.distanceX * dt / this.totalTime;
        const newY = this.calcMotionFuncValue(this.func, newX);

        this.setPosition(newX, newY);
    }
    ,

    // y = ax^2+bx+c: parabol co tiep tuyen tai A la AB va tiep tuyen tai C la CB
    calcMotionFunc: function (A, B, C) {
        let a = ((B.y - A.y) / this.convertToNonZero(B.x - A.x) - (B.y - C.y) / this.convertToNonZero(B.x - C.x)) / this.convertToNonZero(2 * (A.x - C.x));
        let b = (B.y - A.y) / this.convertToNonZero(B.x - A.x) - 2 * a * A.x;
        let c = A.y - a * A.x * A.x - b * A.x;
        return [a, b, c];
    }
    ,

    convertToNonZero: function (a) {
        return a === 0 ? 0.001 : a;
    }
    ,

    //return y = ax^2+bx+c
    calcMotionFuncValue: function (func, x) {
        const [a, b, c] = func;
        return a * x * x + b * x + c;
    }
    ,

    destroyBullet: function () {
        // var explode = HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360);
        this.active = false;
        this.visible = false;
    }
    ,

    onReachDestination: function () {
        //run action explose
        this._explosion.setPosition(this.destination.x, this.destination.y);
        this._explosion.stopAction(this.actionExplose);
        this._explosion.runAction(this.actionExplose);

        const listTargets = BattleManager.getInstance()
            .getListTroopsInRange(cc.p(this.destination._posX, this.destination._posY), this.attackRadius);

        for (let target of listTargets) {
            if (this.checkTarget(target))
                target.onGainDamage(this.damagePerShot);
        }

        this.destroyBullet();
    }
    ,

    //check if troop can be attacked
    checkTarget: function (target) {
        // target in air
        if (target.isOverhead && this.attackArea === DEF_ATTACK_AREA.GROUND) {
            return false;
        }
        // target on ground
        if (!target.isOverhead && this.attackArea === DEF_ATTACK_AREA.OVERHEAD) {
            return false;
        }
        return target.isAlive() && typeof this.target.onGainDamage === 'function';
    }
    ,
});

