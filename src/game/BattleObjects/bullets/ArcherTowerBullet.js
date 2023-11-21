var ArcherTowerBullet = Bullet.extend({
    active: true,
    target: null,
    gridSpeed: 50,

    ctor: function (type, startPoint, target, damagePerShot, attackRadius, attackArea, initPos) {
        this._super(type, res_map.SPRITE.BODY.ARCHER_TOWER.BULLET, startPoint, target,
            damagePerShot, attackRadius, attackArea, initPos, Utils.roundFloat(15.0 / this.gridSpeed, 2));

        //bullet explosion
        this._explosion = new cc.Sprite();
        this._explosion.setScale(0.5, 0.5);

        this.actionExplose = fr.createActionByFrames(res_map.SPRITE.BODY.ARCHER_TOWER.HIT, {
            delayPerUnit: 0.1,
            restoreOriginalFrame: false
        });
        this.actionExplose.retain();
    },

    init: function (startPoint, target, initPos) {
        this._super(startPoint, target, initPos);

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

        let angle = this.getAngleToRotate(this.func, newX);
        if (this.distanceX < 0)
            angle += 180;
        this.setRotation(angle);
    },

    // y = ax^2+bx+c: parabol co tiep tuyen tai A la AB va tiep tuyen tai C la CB
    calcMotionFunc: function (A, B, C) {
        let a = ((B.y - A.y) / (B.x - A.x) - (B.y - C.y) / (B.x - C.x)) / (2 * (A.x - C.x));
        let b = (B.y - A.y) / (B.x - A.x) - 2 * a * A.x;
        let c = A.y - a * A.x * A.x - b * A.x;

        return [a, b, c];
    },

    //return y = ax^2+bx+c
    calcMotionFuncValue: function (func, x) {
        const [a, b, c] = func;
        return a * x * x + b * x + c;
    },

    //goc giua vector chi phuong cua tiep tuyen tai X va vector thang dung (bullet ban dau co phuong thang dung)
    getAngleToRotate: function (func, x) {
        const [a, b, c] = func;
        const angleRad = cc.pAngleSigned(cc.p(1, 2 * a * x + b), cc.p(0, 1))
        const angleDeg = cc.radiansToDegrees(angleRad);
        return angleDeg;
    },

    destroyBullet: function () {
        // var explode = HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360);
        this.active = false;
        this.visible = false;
    },

    onReachDestination: function () {
        //run action explose
        this._explosion.setPosition(this.target.x, this.target.y);
        this._explosion.stopAction(this.actionExplose);
        this._explosion.runAction(this.actionExplose);

        if (this.target.isAlive() && typeof this.target.onGainDamage === 'function') {
            this.target.onGainDamage(this.damagePerShot);
        }
        this.destroyBullet();
    },

});

