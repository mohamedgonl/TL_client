var Troop = cc.Node.extend({
    _moveSpeed: 0,
    _cfgId: null,
    _level: null,
    ctor: function (cfgId, level,barrackIndex, armyCampIndex ) {

        this._super();
        this._cfgId = cfgId;
        this._level = level;

        // let initPos = (ArmyManager.Instance().getBarrackList())[barrackIndex].getPosition();
        // let targetPos = (ArmyManager.Instance().getArmyCampList())[armyCampIndex].getPosition();

        // let way = AlgorithmImplement.Instance().searchPathByAStar([12,12],[500,500])
        let initPos =  cc.p(12, 12);
        let targetPos = cc.p(500, 500);

        let url = TroopConfig.BASE_URL + cfgId +"_" + level + "/" + cfgId+ "_" + level;
        this.troop = new cc.Sprite(url+"/idle/image0000.png");
        this.troop.setAnchorPoint(0.5,0.5);
        this.troop.setScale(0.5);



        let speed = 20; // Vận tốc (pixel/giây)

        let distance = cc.pDistance(initPos, targetPos);
        let duration = distance / speed;
        this.troop.setPosition(initPos)



        let moveToAction = cc.moveTo(duration, targetPos);

        let animate = cc.animate(animation);
        let parallelAction  = cc.spawn([moveToAction, animate.repeatForever()])

        this.troop.runAction(parallelAction)

        this.addChild(this.troop);

    },

    init: function (cfgId) {
        this._moveSpeed = TROOP_BASE[cfgId]["moveSpeed"];
    },

    initAnimation:  function () {
        let cfgId = this._cfgId;
        const animas = ["run","idle", "attack01", "dead"];
        const directions = ["down", "up", "left", "right", "down_left", "up_left","down_right", "up_right"];

        this._animations = {};

        animas.map(e => {
            let animation = new cc.Animation();
            if(TroopConfig[cfgId][e]) {
                directions.map(direct => {

                    for (let i = TroopConfig[cfgId][e][direct][0]; i <= TroopConfig[cfgId][e][direct][1]; i++) {
                        let frameName = url+"/"+e+"/image"+NumberUltis.formatNumberTo4Digits(i)+".png";
                        animation.addSpriteFrameWithFile(frameName);
                    }
                })
            }



            animation.setDelayPerUnit(TroopConfig.ARM_1.frame_time);
            animation.setRestoreOriginalFrame(true);
        })

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