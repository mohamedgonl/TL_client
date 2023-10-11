var Troop = cc.Node.extend({
    _moveSpeed: 0,
    _cfgId: null,
    _level: null,
    _animations: null,
    ctor: function (cfgId, level, barrackIndex, armyCampIndex) {

        this._super();
        this._cfgId = cfgId;
        this._level = level;
        this._moveSpeed = TROOP_BASE[cfgId]["moveSpeed"];
        this._url = TroopConfig.BASE_URL + cfgId + "_" + level + "/" + cfgId + "_" + level;
        this.troop = new cc.Sprite(this._url + "/idle/image0000.png");

        this.troop.setAnchorPoint(0.5, 0.5);
        this.troop.setScale(TroopConfig[cfgId].scale);

        let barrack = ArmyManager.Instance().getBarrackList()[barrackIndex];
        this.armyCamp = ArmyManager.Instance().getArmyCampList()[armyCampIndex];
        this.troop.setPosition(barrack.getPosition().x, barrack.getPosition().y);
        this.initAnimation()
        this.runTo(this.armyCamp.getPosition());
        // this.test()

        cc.eventManager.addCustomListener(EVENT_TROOP_NAME.MOVE_BUILDING, this.handleMapChange.bind(this))

        this.addChild(this.troop);

    },

    initAnimation: function () {
        let cfgId = this._cfgId;
        const animas = ["run", "idle", "attack01", "dead"];
        const directions = ["down", "left", "down_left", "down_right", "up_right", "up_left", "right", "up"];

        this._animations = {};

        animas.map(action => {
            this._animations[action] = {};
            if (TroopConfig[cfgId][action]) {
                directions.map((direct, index) => {
                    if (TroopConfig[cfgId][action][direct]) {
                        let animation = new cc.Animation();
                        for (let i = TroopConfig[cfgId][action][direct][0]; i <= TroopConfig[cfgId][action][direct][1]; i++) {
                            let frameName = this._url + "/" + action + "/image" + NumberUltis.formatNumberTo4Digits(i) + ".png";
                            // let frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(frameName);
                            // if(frame) {
                            //     animation.addSpriteFrameWithFile(frame);
                            // }
                            // else {
                            animation.addSpriteFrameWithFile(frameName);
                            //     cc.SpriteFrameCache.getInstance().addSpriteFrame(frameName, frameName);
                            // }
                        }
                        animation.setDelayPerUnit(TroopConfig[cfgId].frame_time);
                        animation.setRestoreOriginalFrame(true);
                        this._animations[action][direct] = animation;
                    } else {
                        let oppositeDir = directions[directions.length - 1 - index];

                        let animation = new cc.Animation();
                        for (let i = TroopConfig[cfgId][action][oppositeDir][0]; i <= TroopConfig[cfgId][action][oppositeDir][1]; i++) {
                            let frame = (this._url + "/" + action + "/image" + NumberUltis.formatNumberTo4Digits(i) + ".png");
                            cc.loader.load(frame, (err, texture) => {
                                let spriteFrame = new cc.SpriteFrame(texture);
                                spriteFrame.setFlipX(true);
                                animation.addSpriteFrame(spriteFrame);
                            })

                        }
                        animation.setDelayPerUnit(TroopConfig[cfgId].frame_time);
                        animation.setRestoreOriginalFrame(true);
                        this._animations[action][direct] = animation;

                    }

                })
            }
        });

    },

    runAnimation: function (direction, action) {
        cc.log(this._animations[action][direction])
        return this._animations[action][direction];
    },


    getLevel: function (cfgId) {
        return 1;
    },

    loadFrameData: function () {

    },

    handleMapChange: function () {
        cc.log("GRID MAP CHANGED!");

    },


    runTo: function (target) {
        let mapLayer = cc.director.getRunningScene().getMapLayer();
        cc.log("TROOP POS : \n" + this.troop.getPosition())
        let start = mapLayer.getGridPosFromScreenPos(this.troop.getPosition());
        cc.log(JSON.stringify(start))
        let end = mapLayer.getGridPosFromScreenPos(target);
        cc.log(JSON.stringify(end))
        const Algorithm = AlgorithmImplement.Instance();
        let wayGrid = Algorithm.searchPathByAStar([start.x, start.y], [end.x, end.y]);
        let wayMap = [];
        let res = []
        wayGrid.map(path => {
            res.push(path);
            let targetPos = mapLayer.getScreenPosFromGridPos(path, true);
            let distance = cc.pDistance(this.troop.getPosition(), target);
            let duration = distance / this._moveSpeed;
            let run = cc.moveTo(duration, targetPos);
            // let parallel = cc.Spawn.create(runAnim,run);

            // wayMap.push(parallel)
        });
        let runAnim = cc.repeatForever(cc.animate(this.runAnimation("left", "run")))
        // let run = cc.moveTo(2, cc.p(100,100));
        // wayMap.push(run);

        cc.log("RES ALGORITHM : \n" + (res))


        let moveAction = cc.sequence(wayMap);

        this.troop.runAction(runAnim)

    },

    stay: function () {

    },


    test: function () {
        let frames = []
        let animation = new cc.Animation();
        for (let i = 0; i <= 69; i++) {
            let frameName = this._url + "/" + "run" + "/image" + NumberUltis.formatNumberTo4Digits(i) + ".png";
            cc.log(frameName)
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(0.5);
        animation.setRestoreOriginalFrame(true);

        this.troop.runAction(cc.repeatForever(cc.animate(animation)))
        // res/Troops/ARM_1_1/ARM_1_1/run/image0069.png
    },


})