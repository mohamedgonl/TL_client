var ArcherBullet = TroopBullet.extend({
    ctor: function  (target,startPoint, damage) {
        this._super(target, startPoint, damage);
        //sprite
        this._sprite = new cc.Sprite(res_battle.BULLET.ARCHER_ARROW);
        this.addChild(this._sprite);

        //image is up, rotate by this._startPoint and this._endPoint
        let angle = cc.pToAngle(cc.pSub(this._endPoint, this._startPoint));
        let degree = cc.radiansToDegrees(angle);
        this.setRotation(degree);
    },
});