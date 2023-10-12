var Troop = cc.Node.extend({
    _moveSpeed: 0,
    _cfgId: null,
    _level: null,
    _animations: null,
    ctor: function (cfgId, level, barrackIndex, armyCampIndex) {
        cc.log({barrackIndex, armyCampIndex})

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
        let mapLayer = cc.director.getRunningScene().getMapLayer();

        let start = mapLayer.getLayerPositionFromGrid(barrack._posX, barrack._posY, true);
        let end = mapLayer.getLayerPositionFromGrid(this.armyCamp._posX, this.armyCamp._posY, true);

        this.troop.setPosition(barrack.getPosition().x, barrack.getPosition().y);
        this.initShadow();

        this.initAnimation()
        this.runTo(start, end);
        // this.test()

        cc.eventManager.addCustomListener(EVENT_TROOP_NAME.MOVE_BUILDING, this.handleMapChange.bind(this))

        this.addChild(this.troop);

    },

    initShadow: function () {
        let shadow = new cc.Sprite(res_map.SPRITE.SHADOW.TROOP_SMALL);

        shadow.setAnchorPoint(0.5,0.5);
        shadow.setScale(0.5);
        shadow.setOpacity(90)
        shadow.setPosition(99,93);
        this.troop.addChild(shadow,-1);

    },

    initAnimation: function () {
        let cfgId = this._cfgId;
        this._animations = {};
        ANIMAS.map(action => {
            this._animations[action] = {};
            if (TroopConfig[cfgId][action]) {
                DIRECTIONS.map((direct, index) => {
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
                        animation.setDelayPerUnit(TroopConfig[cfgId][action].frame_time);
                        animation.setRestoreOriginalFrame(true);
                        this._animations[action][direct] = animation;
                    } else {
                        // let oppositeDir = directions[directions.length - 1 - index];
                        // cc.log(oppositeDir, action)
                        // let animation = new cc.Animation();
                        // for (let i = TroopConfig[cfgId][action][oppositeDir][0]; i <= TroopConfig[cfgId][action][oppositeDir][1]; i++) {
                        //     let frame = (this._url + "/" + action + "/image" + NumberUltis.formatNumberTo4Digits(i) + ".png");
                        //     cc.loader.load(frame, (err, texture) => {
                        //         let spriteFrame = new cc.SpriteFrame(texture);
                        //         spriteFrame.setFlipX(true);
                        //         animation.addSpriteFrame(spriteFrame);
                        //     })
                        //
                        // }
                        // animation.setDelayPerUnit(TroopConfig[cfgId].frame_time);
                        // animation.setRestoreOriginalFrame(true);
                        // this._animations[action][direct] = animation;

                    }

                })
            }
        });

    },

    runAnimation: function (direction, action) {
        if (!this._animations[action][direction]) {
            let i = DIRECTIONS.indexOf(direction);
            return this._animations[action][DIRECTIONS[DIRECTIONS.length - 1 - i]];
        }
        return this._animations[action][direction];
    },

    handleMapChange: function () {
        cc.log("GRID MAP CHANGED!");
        const Algorithm = AlgorithmImplement.Instance();
        Algorithm.setGridMapStar(MapManager.Instance().mapGrid)
    },


    runAndMotionAction: function (isStay, direction= "left") {

        let runAnim = cc.animate(this.runAnimation(direction, "run")).repeatForever();
        if (isStay) {
            runAnim = cc.animate(this.runAnimation(direction, "idle")).repeatForever();
        }
        runAnim.retain();
        if (!runAnim) {
            cc.log("DONT HANVE ::: " + direction)
        }

        let stopPreviousAction = cc.callFunc(() => {
            if (this.previousAction) {
                this.troop.stopAction(this.previousAction);
            }
            this.previousAction = runAnim;
        }, this);

        let runCurrentAction = cc.callFunc(() => {
            this.troop.runAction(runAnim);
        }, this);

        return [stopPreviousAction, runCurrentAction]
    },

    getDegree: function (origin, target) {
        const deltaX = target.x - origin.x;
        const deltaY = target.y - origin.y;

        const radians = Math.atan2(deltaY, deltaX);
        const degrees = radians * (180 / Math.PI);

        return degrees;
    },

    getDirection: function (origin, target) {
        let angle = this.getDegree(origin, target);
        angle = (angle + 360) % 360;

        switch (angle) {
            case 180: {
                return DIRECTIONS_STRING.DOWN_LEFT;
            }
            case 135: {
                return DIRECTIONS_STRING.UP_LEFT;
            }
            case 225: {
                return DIRECTIONS_STRING.DOWN;
            }
            case 270: {
                return DIRECTIONS_STRING.UP_RIGHT;
            }
            default: {
                return DIRECTIONS_STRING.DOWN_LEFT;
            }

        }

    },


    runTo: function (origin, target) {
        let mapLayer = cc.director.getRunningScene().getMapLayer();

        let start = mapLayer.getGridFromLayerPosition(origin);
        let end = mapLayer.getGridFromLayerPosition(target);
        const Algorithm = AlgorithmImplement.Instance();

        if (!Algorithm._gridMapAStar) {
            Algorithm.setGridMapStar(MapManager.Instance().mapGrid)
        }
        let wayGrid = Algorithm.searchPathByAStar([start.x, start.y], [end.x + Math.floor(Math.random() * 4) + 1, end.y + Math.floor(Math.random() * 4) + 1]);

        let wayActions = [];
        let res = []
        let i = 0;
        wayGrid.map((path, index) => {
            res.push(path);
            // run action
            let targetPos = mapLayer.getLayerPositionFromGrid(path.x, path.y, true);
            let distance = cc.pDistance(this.troop.getPosition(), target);
            let duration = distance / this._moveSpeed;
            if (index === wayActions.length - 1) {
                target.x += 100;
                target.y += 100;
            }
            let run = cc.moveTo(duration / 25, targetPos);
            let direction = this.getDirection(index === 0 ? start : wayGrid[index - 1], path);

            let isStay = false;
            let parallel;
            parallel = cc.spawn(...this.runAndMotionAction(isStay, direction), run);
            wayActions.push(parallel);
        });
        wayActions.push(cc.spawn(...this.runAndMotionAction(true)));
        cc.log("RES ALGORITHM : \n" + (res))
        let moveAction = cc.sequence(wayActions);
        this.troop.runAction(moveAction)
    },

    stayInAMCAction : function () {

    },


    test: function () {
        let frames = []
        let animation = new cc.Animation();
        for (let i = 0; i <= 69; i++) {
            let frameName = this._url + "/" + "run" + "/image" + NumberUltis.formatNumberTo4Digits(i) + ".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(0.5);
        animation.setRestoreOriginalFrame(true);

        this.troop.runAction(cc.repeatForever(cc.animate(animation)))
        // res/Troops/ARM_1_1/ARM_1_1/run/image0069.png
    },


})