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

    destroy: function () {
        // var explode = HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360);
        this.active = false;
        this.visible = false;
    },

    onReachDestination: function () {
        if (this.target && typeof this.target.onGainDamage === 'function') {
            this.target.onGainDamage(this.damagePerShot);
        }
        this.destroy();
    },

    collideRect: function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    }
});

// Bullet.getOrCreateBullet = function (bulletSpeed, weaponType, attackMode, zOrder, mode) {
//     /**/
//     var selChild = null;
//     if (mode == MW.UNIT_TAG.PLAYER_BULLET) {
//         for (var j = 0; j < MW.CONTAINER.PLAYER_BULLETS.length; j++) {
//             selChild = MW.CONTAINER.PLAYER_BULLETS[j];
//             if (selChild.active == false) {
//                 selChild.visible = true;
//                 selChild.HP = 1;
//                 selChild.active = true;
//                 return selChild;
//             }
//         }
//     } else {
//         for (var j = 0; j < MW.CONTAINER.ENEMY_BULLETS.length; j++) {
//             selChild = MW.CONTAINER.ENEMY_BULLETS[j];
//             if (selChild.active == false) {
//                 selChild.visible = true;
//                 selChild.HP = 1;
//                 selChild.active = true;
//                 return selChild;
//             }
//         }
//     }
//     selChild = Bullet.create(bulletSpeed, weaponType, attackMode, zOrder, mode);
//     return selChild;
// };
//
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
//
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
