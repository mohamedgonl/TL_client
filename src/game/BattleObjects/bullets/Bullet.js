var Bullet = cc.Sprite.extend({
    active: true,
    speed: 200, //pixel per sec
    power: 1,
    HP: 1,
    moveType: null,
    destination: null,
    startPoint: null,
    time: 0, // time logic to reach destination
    minimumTime: 0, // minimum time to reach destination

    ctor: function (type, startPoint, target, damagePerShot, attackRadius, initPos) {
        this._super(type);
        //this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.target = target;
        this.damagePerShot = damagePerShot;
        this.attackRadius = attackRadius;
        this.initPos = initPos;

        this.init(startPoint, target);
    },

    init: function (startPoint, target) {
        this.startPoint = startPoint;
        this.target = target;
        this.destination = {x: target.x, y: target.y, _posX: target._posX, _posY: target._posY};

        const gridDist = Math.sqrt(Math.pow(this.startPoint._posX - target._posX, 2) + Math.pow(this.startPoint._posY - target._posY, 2));
        this.time = Math.max(gridDist / this.gridSpeed, this.minimumTime);
        this.totalTime = this.time;

        this.setInitPosition();

        this.active = true;
        this.visible = true;
    },

    setInitPosition: function () {
        this.setPosition(this.initPos.x, this.initPos.y);
    },

});

Bullet.getOrCreateBullet = function (type, startPoint, target, damagePerShot, attackRadius, initPos) {
    var selChild = null;
    const listBullets = BattleManager.getInstance().listBullets;
    for (let bullet of listBullets)
        if (!bullet.active && bullet._type === type) {
            bullet.init(startPoint, target);
            return bullet;
        }
    if (type === "DEF_1") {
        selChild = new CannonBullet(type, startPoint, target, damagePerShot, attackRadius, initPos);
    } else if (type === "DEF_2") {
        selChild = new ArcherTowerBullet(type, startPoint, target, damagePerShot, attackRadius, initPos);
    } else if (type === "DEF_3") {
        selChild = new MortarBullet(type, startPoint, target, damagePerShot, attackRadius, initPos);
    }
    BattleManager.getInstance().addBullet(selChild);
    return selChild;
};
