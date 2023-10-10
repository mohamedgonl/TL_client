var Troop = cc.Node.extend({
    _moveSpeed: 0,
    _cfgId: null,
    _level: null,
    ctor: function (cfgId, level,barrackIndex, armyCampIndex ) {

        this._super();
        this._cfgId = cfgId;
        this._level = level;

        let initPos = (ArmyManager.Instance().getBarrackList())[barrackIndex].getPosition();
        let targetPos = (ArmyManager.Instance().getArmyCampList())[armyCampIndex].getPosition();
        cc.log("POS " + JSON.stringify(targetPos))

        let url = TroopConfig.BASE_URL + cfgId +"_" + level + "/" + cfgId+ "_" + level;
        let troop = new cc.Sprite(url+"/idle/image0000.png");
        troop.setAnchorPoint(0.5,0.5);
        troop.setScale(0.5);
        troop.setPosition(initPos);

        let animation = new cc.Animation();
        for (let i = TroopConfig[cfgId].run.down[0]; i <= TroopConfig[cfgId].run.down[1]; i++) {
            let frameName = url+"/run/image"+NumberUltis.formatNumberTo4Digits(i)+".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(TroopConfig.ARM_1.frame_time);
        animation.setRestoreOriginalFrame(true);

        let speed = 20; // Vận tốc (pixel/giây)

        let distance = cc.pDistance(initPos, targetPos);
        let duration = distance / speed;

        let moveToAction = cc.moveTo(duration, targetPos);

        let action = cc.animate(animation);
        troop.runAction(cc.spawn.create([action.repeatForever(), moveToAction]));




        this.addChild(troop);

    },

    init: function (cfgId) {
        this._moveSpeed = TROOP_BASE[cfgId]["moveSpeed"];
    },

    initAnimation:  function () {

    },



    getLevel: function (cfgId) {
        return 1;
    },

    loadFrameData : function () {

    },

    findPath : function () {

    },

    runTo: function(){
        
    },
    
    stay: function () {
        
    }

})