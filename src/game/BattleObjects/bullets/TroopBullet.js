var TroopBullet = cc.Node.extend({
    ctor: function  (target,startPoint, damage) {
        this._super();
        this._target = target;
        this._damage = damage;
        this.active = true;
        this._startPoint = startPoint;
        this._startTime = 0;
        this._currentTime = 0;

        //calculate end time
        this._endPoint  = cc.pAdd(target.getGridPosition(),
            cc.p(Math.floor(target._width/2), Math.floor(target._height/2)));

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
            let positionInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(newGridPos);
            this.setPosition(positionInMap);
        }
    },
    toString: function () {
        return "BattleBullet{" +
            "active=" + this.active +
            ", target=" + this._target +
            ", destination=" + this._endPoint.x +" "+ this._endPoint.y+
            '}';
    }
});

TroopBullet.createBullet = function (type,target, startPoint, damage) {
    let bullet = null;
    switch(type){
        case "ARM_2":
            bullet = new ArcherBullet(target, startPoint, damage);
            break;
        default:
            cc.log("no bullet class")
    }

    //add bullet to battle manager
    BattleManager.getInstance().addTroopBullet(bullet);

    //add to battle layer
    cc.director.getRunningScene().battleLayer.addChild(bullet,MAP_ZORDER_BULLET);

}