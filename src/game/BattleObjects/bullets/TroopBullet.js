var TroopBullet = cc.Node.extend({
    ctor: function  (target,startPoint, damage,troop) {
        this._super();
        this.init(target,startPoint, damage,troop);
    },
    init:function (target,startPoint, damage,troop) {
        this._target = target;
        this._damage = damage;
        this.active = true;
        this.setVisible(true);
        this._startPoint = startPoint;
        this._startTime = 0;
        this._currentTime = 0;
        this._troop = troop;

        //calculate end time
        this._endPoint = cc.pAdd(target.getGridPosition(),
            cc.p(Math.floor(target._width / 2), Math.floor(target._height / 2)));

        let distance = cc.pDistance(startPoint, this._endPoint);
        distance = Utils.roundFloat(distance, 4)

        this._endTime = distance / this._speedPerSec;
        this._endTime = Utils.roundFloat(this._endTime, 4);

        //set position at start point
        let positionInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(startPoint);
        this.setPosition(positionInMap);
    },
    onReachTarget: function () {
        this.active = false;
        this.setVisible(false);
        LogUtils.writeLog("Bullet reach target");
        this._target.onGainDamage(this._damage,this._troop);
        // BattleManager.getInstance().onTroopBulletDead(this);
        this.removeFromParent(false);
    },
    gameLoop: function(dt){
        if(this.active === false){
            return;
        }
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

TroopBullet.createBullet = function (type,target, startPoint, damage, troop) {
    let bullet = null;
    switch(type){
        case "ARM_2":
            bullet = new ArcherBullet(target, startPoint, damage,troop);
            break;
        default:
            cc.log("no bullet class")
    }

    //add bullet to battle manager
    BattleManager.getInstance().addTroopBullet(bullet);

    //add to battle layer
    cc.director.getRunningScene().battleLayer.addChild(bullet,MAP_ZORDER_BULLET);

}