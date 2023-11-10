var CannonBullet = Bullet.extend({
    active: true,
    target: null,
    gridSpeed: 40,

    ctor: function (type, startPoint, target, damagePerShot, attackRadius, initPos) {
        this._super(res_map.SPRITE.BODY.CANNON.BULLET, startPoint, target, damagePerShot, attackRadius, initPos);
        this._type = type;

        this.setScale(0.5, 0.5);
    },

    gameLoop: function (dt) {
        if (!this.active || this.destination === null)
            return;
        this.time -= dt;
        if (this.time <= 0) {
            this.onReachDestination();
        }

        //UI
        let alpha = 1 - this.time / this.totalTime;

        if (alpha < 1) {
            const newPos = cc.pLerp(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y), alpha);
            this.setPosition(newPos.x, newPos.y);
        }
    },

    destroyBullet: function () {
        // var explode = HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360);
        this.active = false;
        this.visible = false;
    },

    onReachDestination: function () {
        if (this.target.isAlive() && typeof this.target.onGainDamage === 'function') {
            this.target.onGainDamage(this.damagePerShot);
        }
        this.destroyBullet();
    },
});

