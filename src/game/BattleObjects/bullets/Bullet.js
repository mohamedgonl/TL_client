var Bullet = cc.Sprite.extend({
    active: true,
    speed: 200, //pixel per sec
    power: 1,
    HP: 1,
    moveType: null,
    destination: null,
    startPoint: null,
    alpha: 0,
    time: 0, // time logic to reach destination
    // attackMode:MW.ENEMY_MOVE_TYPE.NORMAL,
    // parentType:MW.BULLET_TYPE.PLAYER,

    ctor: function (type, startPoint, destination) {
        this._super(type);
        //this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.init(startPoint, destination);
    },

    init: function (startPoint, destination) {
        this.active = true;
        this.visible = true;
        this.startPoint = startPoint;
        this.destination = destination;

        const gridDist = Math.sqrt(Math.pow(startPoint._posX - destination._posX, 2) + Math.pow(startPoint._posY - destination._posY, 2));
        this.time = gridDist / this.gridSpeed;

        this.dist = cc.pDistance(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y));

        this.alpha += 20 / this.dist;
        const initPos = cc.pLerp(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y), this.alpha);
        this.setPosition(initPos.x, initPos.y);
    },

    reset: function (startPoint, target) {
        this.startPoint = startPoint;
        this.target = target;
        this.alpha = 0;
        this.destination = cc.p(target.x, target.y);

        const gridDist = Math.sqrt(Math.pow(this.startPoint._posX - target._posX, 2) + Math.pow(this.startPoint._posY - target._posY, 2));
        this.time = gridDist / this.gridSpeed;

        this.dist = cc.pDistance(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y));

        this.alpha += 25 / this.dist;
        const initPos = cc.pLerp(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y), this.alpha);
        this.setPosition(initPos.x, initPos.y);
        this.active = true;
        this.visible = true;
    },

    gameLoop: function (dt) {
        // cc.log(JSON.stringify({active: this.active, destination: this.destination, x: this.x, y: this.y}))
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

    // destroy: function () {
    //     // var explode = HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360);
    //     this.active = false;
    //     this.visible = false;
    // },

    hurt: function () {
        this.HP--;
    },

    collideRect: function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    }
});

Bullet.getOrCreateBullet = function (type, startPoint, target, damagePerShot) {
    var selChild = null;
    const listBullets = BattleManager.getInstance().listBullets;
    for (let bullet of listBullets)
        if (!bullet.active && bullet._type === type) {
            bullet.reset(startPoint, target);
            return bullet;
        }
    if (type === "DEF_1") {
        selChild = new CannonBullet(type, startPoint, target, damagePerShot);
    }
    BattleManager.getInstance().addBullet(selChild);
    return selChild;
};
