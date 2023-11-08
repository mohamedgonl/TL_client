var MortarBullet = Bullet.extend({
    active: true,
    target: null,
    speed: 150,
    gridSpeed: 20,

    ctor: function (type, startPoint, target, damagePerShot) {
        this._super(res_map.SPRITE.BODY.MORTAR.BULLET, startPoint, target);
        this._type = type;
        this.target = target;
        this.damagePerShot = damagePerShot;
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

    setInitPosition: function (){
        this.alpha += 20 / this.dist;
        const initPos = cc.pLerp(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y), this.alpha);
        this.setPosition(initPos.x, initPos.y);
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

