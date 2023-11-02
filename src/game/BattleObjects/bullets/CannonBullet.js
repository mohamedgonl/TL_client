var CannonBullet = Bullet.extend({
    active: true,
    target: null,

    ctor: function (type, startPoint, target, damagePerShot) {
        this._super(res_map.SPRITE.BODY.CANNON.BULLET, startPoint, cc.p(target.x, target.y));
        this._type = type;
        this.target = target;
        this.damagePerShot = damagePerShot;
        this.speed = 300;
    },

    destroyBullet: function () {
        // var explode = HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360);
        this.active = false;
        this.visible = false;
    },

    onReachDestination: function () {
        if (this.target && typeof this.target.onGainDamage === 'function') {
            this.target.onGainDamage(this.damagePerShot);
        }
        this.destroyBullet();
    },

    collideRect: function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    }
});

CannonBullet.getOrCreateBullet = function (type, startPoint, target, damagePerShot) {
    var selChild = null;
    const listBullets = BattleManager.getInstance().listBullets;
    for (let bullet of listBullets)
        if (!bullet.active && bullet._type === type) {
            bullet.reset(cc.p(target.x, target.y));
            return bullet;
        }
    selChild = new CannonBullet(type, startPoint, target, damagePerShot);
    BattleManager.getInstance().addBullet(selChild);
    return selChild;
};

