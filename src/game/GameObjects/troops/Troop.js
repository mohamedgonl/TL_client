var Troop = cc.Node.extend({
    _moveSpeed: 0,
    _cfgId: null,
    _level: null,
    ctor: function (cfgId, level ) {
        this._super();
        this._cfgId = cfgId;
        this._level = level;


        let url = TroopConfig.BASE_URL + cfgId +"_" + level + "/" + cfgId+ "_" + level;
        let troop = new cc.Sprite(url+"/idle/image0000.png");
        this.addChild(troop);
        troop.setPosition(cc.winSize.width/2, cc.winSize.height/2);


        var animation = new cc.Animation();
        for (var i = TroopConfig.ARM_1.run.down[0]; i <= TroopConfig.ARM_1.run.down[1]; i++) {
            // var frameName = url+"/run/image000"+i+".png";
            var frameName = url+"/run/image"+NumberUltis.formatNumberTo4Digits(i)+".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(TroopConfig.ARM_1.delay_time);
        animation.setRestoreOriginalFrame(true);

        let action = cc.animate(animation);
        troop.runAction(action.repeatForever())


    },

    init: function (cfgId) {
        this._moveSpeed = TROOP_BASE[cfgId]["moveSpeed"];
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