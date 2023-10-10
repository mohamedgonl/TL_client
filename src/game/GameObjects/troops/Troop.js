var Troop = cc.Node.extend({
    _moveSpeed: 0,
    _cfgId: null,
    _level: null,
    ctor: function (cfgId, level,barrackIndex, armyCampIndex ) {

        this._super();
        this._cfgId = cfgId;
        this._level = level;
        this._moveSpeed = TROOP_BASE[cfgId]["moveSpeed"];
        this._url = TroopConfig.BASE_URL + cfgId +"_" + level + "/" + cfgId+ "_" + level;
        this.troop = new cc.Sprite(this._url+"/idle/image0000.png");
        this.troop.setAnchorPoint(0.5,0.5);
        this.troop.setScale(TroopConfig[cfgId].scale);

        let barrack = ArmyManager.Instance().getBarrackList()[barrackIndex];
        let armyCamp = ArmyManager.Instance().getArmyCampList()[armyCampIndex];
        this.troop.setPosition(barrack.getPosition().x  , barrack.getPosition().y );
        this.runTo(armyCamp.getPosition());
        this.addChild(this.troop);

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
                        let frameName = this._url+"/"+e+"/image"+NumberUltis.formatNumberTo4Digits(i)+".png";
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




    runTo: function(target){
        let mapLayer = cc.director.getRunningScene().getMapLayer();
        cc.log("TROOP POS : \n" + this.troop.getPosition())
        let start = mapLayer.getGridPosFromScreenPos(this.troop.getPosition());
        cc.log(JSON.stringify(start))
        let end = mapLayer.getGridPosFromScreenPos(target);
        cc.log(JSON.stringify(end))
        const Algorithm = AlgorithmImplement.Instance();
        Algorithm.setGridMapStar(MapManager.Instance().mapGrid)
        let wayGrid = Algorithm.searchPathByAStar([start.x,start.y], [end.x, end.y]);
        let wayMap = [];
        let res = []
        wayGrid.map(path => {
            res.push(path);
            let targetPos = mapLayer.getScreenPosFromGridPos(path, true);
            let run = cc.moveTo(2, targetPos);
            wayMap.push(run)
        });
        // let run = cc.moveTo(2, cc.p(100,100));
        // wayMap.push(run);

        cc.log("RES ALGORITHM : \n" + (res))
        this.troop.runAction(cc.sequence(wayMap))

    },
    
    stay: function () {
        
    },

    goDirect: function () {

    }

})