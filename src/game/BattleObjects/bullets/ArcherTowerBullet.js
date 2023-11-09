var ArcherTowerBullet = Bullet.extend({
    active: true,
    target: null,
    speed: 450,
    gridSpeed: 60,

    ctor: function (type, startPoint, target, damagePerShot, attackRadius, initPos) {
        this._super(res_map.SPRITE.BODY.ARCHER_TOWER.BULLET, startPoint, target, damagePerShot, attackRadius, initPos);
        this._type = type;
    },

    gameLoop: function (dt) {
        if (!this.active || this.destination === null)
            return;
        this.time -= dt;
        this.alpha += dt * this.speed / this.dist;
        if (this.alpha < 0.99) {
            const newPos = cc.pLerp(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y), this.alpha);
            this.setPosition(newPos.x, newPos.y);
        } else {
            this.setVisible(false);
        }
        if (this.time <= 0) {
            this.onReachDestination();
        }
    },

    destroyBullet: function () {
        // var explode = HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360);
        this.active = false;
        this.visible = false;
    },

    onReachDestination: function () {
        if (!this.target.isAlive()) {
            cc.log("Target is dead")
        }
        if (this.target.isAlive() && typeof this.target.onGainDamage === 'function') {
            this.target.onGainDamage(this.damagePerShot);
        }
        this.destroyBullet();
    },

    collideRect: function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    }
});

