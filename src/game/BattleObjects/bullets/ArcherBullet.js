var ArcherBullet = TroopBullet.extend({

    ctor: function  (target,startPoint, damage) {
        this._speedPerSec = 20;
        this._super(target, startPoint, damage);

        //sprite
        this._sprite = new cc.Sprite(res_battle.BULLET.ARCHER_ARROW);
        this._sprite.setAnchorPoint(cc.p(0.5,0.5));
        this._sprite.setScale(0.5);
        this.addChild(this._sprite);

        //image is up, rotate by this._startPoint and this._endPoint
        // end point in map
        let endPosInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(this._endPoint);
        let startPosInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(this._startPoint);
        let angle = cc.pToAngle(cc.pSub(endPosInMap, startPosInMap));
        let degree = cc.radiansToDegrees(angle);

        //log all
        cc.log("endPosInMap: " + endPosInMap.x + " " + endPosInMap.y);
        cc.log("startPosInMap: " + startPosInMap.x + " " + startPosInMap.y);
        cc.log("angle: " + angle);
        cc.log("degree: " + degree);

        //90 because image is up
        this.setRotation(90-degree);
    },
});