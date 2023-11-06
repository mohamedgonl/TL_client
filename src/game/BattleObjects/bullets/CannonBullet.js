var CannonBullet = Bullet.extend({
    active: true,
    target: null,
    speed: 300,
    gridSpeed: 40,

    ctor: function (type, startPoint, target, damagePerShot) {
        this._super(res_map.SPRITE.BODY.CANNON.BULLET, startPoint, target);
        this._type = type;
        this.target = target;
        this.damagePerShot = damagePerShot;
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

