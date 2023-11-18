var ArcherBullet = TroopBullet.extend({

    ctor: function (target, startPoint, damage) {
        this._speedPerSec = 20;
        this._super(target, startPoint, damage);

        //sprite
        this._sprite = new cc.Sprite(res_battle.BULLET.ARCHER_ARROW);
        this._sprite.setAnchorPoint(cc.p(0.5, 0.5));
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
        this.setRotation(90 - degree);
        this.oldPos = this.getPosition();
        this.schedule(this.createBlur.bind(this),0.07);
    },
    //create a orange circle , hide after 0.5s
    createBlur: function () {

        let circle = new cc.Sprite(res_battle.EFFECT.ORANGE_PNG);
        //setAnchorPoint rand in 0.4 - 0.6
        let anchorX = 0.4 + Math.random() * 0.2;
        let anchorY = 0.4 + Math.random() * 0.2;
        circle.setAnchorPoint(cc.p(anchorX, anchorY));

        //setScale rand in 0.2 - 0.3
        circle.setScale(0.2 + Math.random() * 0.1);

        cc.director.getRunningScene().battleLayer.addChild(circle,9999);
        circle.setPosition(this.oldPos);
        circle.runAction(cc.sequence(cc.delayTime(0.3), cc.hide()));

        this.oldPos = this.getPosition();
    }
});