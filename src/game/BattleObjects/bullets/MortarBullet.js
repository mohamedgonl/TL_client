var MortarBullet = Bullet.extend({
    active: true,
    target: null,
    speed: 150,
    gridSpeed: 20,

    ctor: function (type, startPoint, target, damagePerShot, attackRadius, initPos) {
        this._super(res_map.SPRITE.BODY.MORTAR.BULLET, startPoint, target, damagePerShot, attackRadius, initPos);
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
        const listTargets = BattleManager.getInstance()
            .getListTroopsInRange(cc.p(this.destination._posX, this.destination._posY), this.attackRadius);
        for (let target of listTargets) {
            if (target.isAlive() && typeof this.target.onGainDamage === 'function')
                target.onGainDamage(this.damagePerShot);
        }

        this.destroyBullet();
    },
});

