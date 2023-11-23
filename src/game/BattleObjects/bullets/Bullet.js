var Bullet = cc.Sprite.extend({
    active: true,
    gridSpeed: null, //cell/s
    power: 1,
    HP: 1,
    moveType: null,
    destination: null,
    startPoint: null,
    time: 0, // time logic to reach destination
    minimumTime: 0, // minimum time to reach destination

    ctor: function (type, spriteType, startPoint, target, damagePerShot, attackRadius, attackArea, initPos) {
        this._super(spriteType);
        //this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.target = target;
        this._type = type;
        this.damagePerShot = damagePerShot;
        this.attackRadius = attackRadius;
        this.attackArea = attackArea;
        this.gridSpeed = BULLET_GRID_SPEED[type];
        this.minimumTime = Utils.roundFloat(BULLET_MINIMUM_TIME_REACH_DEST[type], 2);

        this.init(startPoint, target, initPos);
    },

    init: function (startPoint, target, initPos) {
        this.startPoint = startPoint;
        this.initPos = initPos;
        this.target = target;
        this.destination = {x: target.x, y: target.y, _posX: target._posX, _posY: target._posY};

        let gridDist = Math.sqrt(Math.pow(this.startPoint._posX - target._posX, 2) + Math.pow(this.startPoint._posY - target._posY, 2));
        gridDist = Utils.roundFloat(gridDist, 2);
        this.time = Math.max(Utils.roundFloat(gridDist / this.gridSpeed, 2), this.minimumTime);
        this.totalTime = this.time;

        LogUtils.writeLog('def ' + this._type + ' bullet: time to reach ' + this.destination._posX + ' ' + this.destination._posY + " : " + this.totalTime);
        this.setInitPosition();

        this.active = true;
        this.visible = true;
    },

    setInitPosition: function () {
        this.setPosition(this.initPos.x, this.initPos.y);
    },

    toString: function () {
        return "BattleBullet{" +
            "active=" + this.active +
            ", target=" + this.target.toString() +
            ", destination=" + this.destination._posX + " " + this.destination._posY +
            '}';
    }


});

