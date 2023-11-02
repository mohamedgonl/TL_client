var Bullet = cc.Sprite.extend({
    active: true,
    speed: 200,
    power: 1,
    HP: 1,
    moveType: null,
    destination: null,
    startPoint: null,
    alpha: 0,
    // attackMode:MW.ENEMY_MOVE_TYPE.NORMAL,
    // parentType:MW.BULLET_TYPE.PLAYER,

    ctor: function (type, startPoint, destination) {
        this._super(type);
        //this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.init(startPoint, destination);
    },

    init: function (startPoint, destination){
        this.active = true;
        this.visible = true;
        this.startPoint = startPoint;
        this.destination = destination;
        this.dist = cc.pDistance(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y));

        this.alpha += 25/this.dist;
        const initPos = cc.pLerp(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y), this.alpha);
        this.setPosition(initPos.x, initPos.y);
    },

    gameLoop: function (dt) {
        if (!this.active || this.destination === null)
            return;
        this.alpha += dt * this.speed / this.dist;
        const newPos = cc.pLerp(cc.p(this.startPoint.x, this.startPoint.y), cc.p(this.destination.x, this.destination.y), this.alpha);
        this.setPosition(newPos.x, newPos.y);
        if (this.alpha > 0.99) {
            this.onReachDestination();
        }
    },

    destroy: function () {
        // var explode = HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360);
        this.active = false;
        this.visible = false;
    },

    hurt: function () {
        this.HP--;
    },

    collideRect: function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    }
});

Bullet.getOrCreateBullet = function (bulletSpeed, weaponType, attackMode, zOrder, mode) {
    /**/
    var selChild = null;
    if (mode == MW.UNIT_TAG.PLAYER_BULLET) {
        for (var j = 0; j < MW.CONTAINER.PLAYER_BULLETS.length; j++) {
            selChild = MW.CONTAINER.PLAYER_BULLETS[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.HP = 1;
                selChild.active = true;
                return selChild;
            }
        }
    } else {
        for (var j = 0; j < MW.CONTAINER.ENEMY_BULLETS.length; j++) {
            selChild = MW.CONTAINER.ENEMY_BULLETS[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.HP = 1;
                selChild.active = true;
                return selChild;
            }
        }
    }
    selChild = Bullet.create(bulletSpeed, weaponType, attackMode, zOrder, mode);
    return selChild;
};

// Bullet.create = function (bulletSpeed, weaponType, attackMode, zOrder, mode) {
//     var bullet = new Bullet(bulletSpeed, weaponType, attackMode);
//     g_sharedGameLayer.addBullet(bullet, zOrder, mode);
//     if (mode == MW.UNIT_TAG.PLAYER_BULLET) {
//         MW.CONTAINER.PLAYER_BULLETS.push(bullet);
//     } else {
//         MW.CONTAINER.ENEMY_BULLETS.push(bullet);
//     }
//     return bullet;
// };

// Bullet.preSet = function () {
//     var bullet = null;
//     for (var i = 0; i < 10; i++) {
//         var bullet = Bullet.create(MW.BULLET_SPEED.SHIP, "W1.png", MW.ENEMY_ATTACK_MODE.NORMAL, 3000, MW.UNIT_TAG.PLAYER_BULLET);
//         bullet.visible = false;
//         bullet.active = false;
//     }
//     for (var i = 0; i < 10; i++) {
//         bullet = Bullet.create(MW.BULLET_SPEED.ENEMY, "W2.png", MW.ENEMY_ATTACK_MODE.NORMAL, 3000, MW.UNIT_TAG.ENMEY_BULLET);
//         bullet.visible = false;
//         bullet.active = false;
//     }
// };
