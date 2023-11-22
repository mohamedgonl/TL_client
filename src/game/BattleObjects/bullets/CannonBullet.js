var CannonBullet = Bullet.extend({
    active: true,
    target: null,
    gridSpeed: 40,

    ctor: function (type, startPoint, target, damagePerShot, attackRadius, attackArea, initPos) {
        this._super(type, res_map.SPRITE.BODY.CANNON.BULLET, startPoint, target, damagePerShot, attackRadius, attackArea, initPos);

        this.setScale(0.5, 0.5);

        //bullet explosion
        this._explosion = new cc.Sprite();
        this._explosion.setScale(0.5, 0.5);

        this.actionExplose = fr.createActionByFrames(res_map.SPRITE.BODY.CANNON.HIT, {delayPerUnit: 0.1,});
        this.actionExplose.retain();
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
            const newPos = cc.pLerp(cc.p(this.initPos.x, this.initPos.y), cc.p(this.destination.x, this.destination.y), alpha);
            this.setPosition(newPos.x, newPos.y);
        }
    },

    destroyBullet: function () {
        // var explode = HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360);
        this.active = false;
        this.visible = false;
    },

    onReachDestination: function () {
        //run action explose
        this._explosion.setPosition(this.destination.x, this.destination.y);
        this._explosion.stopAction(this.actionExplose);
        this._explosion.runAction(this.actionExplose);

        if (this.target.isAlive() && typeof this.target.onGainDamage === 'function') {
            this.target.onGainDamage(this.damagePerShot);
        }
        this.destroyBullet();

    },
});

