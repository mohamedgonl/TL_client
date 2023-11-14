var TroopBullet = cc.Node.extend({
    _speedPerSec: 10,
    ctor: function  (target,startPoint, damage) {
        this._super();
        this._target = target;
        this._damage = damage;
        this.active = true;
        this._startPoint = startPoint;
        this._startTime = 0;
        this._currentTime = 0;

        //calculate end time
        this._endPoint  = cc.pAdd(target.getGridPosition(), cc.p(target._width/2, target._height/2));

        //log start point end point
        cc.log("===================================")
        cc.log("startPoint: " + JSON.stringify(startPoint));
        cc.log("endPoint: " + JSON.stringify(this._endPoint));
        cc.log("===================================")
        let distance = cc.pDistance(startPoint, this._endPoint);

        this._endTime = distance/this._speedPerSec;



        //set position at start point
        let positionInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(startPoint);
        this.setPosition(positionInMap);
    },
    onReachTarget: function () {
        this.active = false;
        this.setVisible(false);
        this._target.onGainDamage(this._damage);
        this.removeFromParent(true);
    },
    gameLoop: function(dt){
        this._currentTime += dt;
        if(this._currentTime >= this._endTime){
            this.onReachTarget();
        }
        else{
            let percent = this._currentTime/this._endTime;
            let newGridPos = cc.pLerp(this._startPoint, this._endPoint, percent);
            cc.log("newGridPos: " + JSON.stringify(newGridPos));
            let positionInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(newGridPos);
            this.setPosition(positionInMap);
        }
    }
});

TroopBullet.createBullet = function (target, startPoint, damage) {
    cc.log("hahaha create byullet")
    let troopBullet = new TroopBullet(target, startPoint, damage);
    const listBullets = BattleManager.getInstance().listBullets;
    BattleManager.getInstance().addBullet(troopBullet);
}