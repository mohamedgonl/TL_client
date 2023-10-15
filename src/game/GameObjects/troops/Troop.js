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

        this.armyCamp = ArmyManager.Instance().getArmyCampList()[armyCampIndex];
        let mapLayer = cc.director.getRunningScene().getMapLayer();

        let start;
        let end = mapLayer.getMapPosFromGridPos({x: this.armyCamp._posX, y: this.armyCamp._posY}, false, true);
        if (barrackIndex >= 0 && barrackIndex !== null) {
            let barrack = ArmyManager.Instance().getBarrackList()[barrackIndex];
            start = mapLayer.getMapPosFromGridPos({x: barrack._posX, y: barrack._posY}, true);
            this.troop.setPosition(barrack.getPosition().x + 23, barrack.getPosition().y - 25);
        } else {
            start = end;
            this.troop.setPosition(this.armyCamp.getPosition().x, this.armyCamp.getPosition().y);
        }

        this.initShadow();

        this.initAnimation()
        if (barrackIndex >= 0) {
            this.runToCamp(start, end);
        } else {
            this.stayInCamp();
        }
        // this.test()

        cc.eventManager.addCustomListener(EVENT_TROOP_NAME.MOVE_BUILDING, this.handleMapChange.bind(this))

        this.addChild(this.troop);

    },

    initShadow: function () {
        let shadowUrl = this._cfgId === "ARM_4" ? res_map.SPRITE.SHADOW.TROOP_BIG : res_map.SPRITE.SHADOW.TROOP_SMALL
        let shadow = new cc.Sprite(shadowUrl);
        shadow.setAnchorPoint(0.5, 0.5);
        shadow.setOpacity(90)

        switch (this._cfgId) {
            case "ARM_1": {
                shadow.setScale(0.7);
                shadow.setPosition(99, 93);
                break;
            }
            case "ARM_2" : {
                shadow.setScale(0.5);
                shadow.setPosition(67, 67);
                break;
            }
            case "ARM_3": {
                shadow.setScale(0.5);
                shadow.setPosition(67, 67);
                break;
            }
            case "ARM_4": {
                shadow.setPosition(167, 160);
                break;
            }
            default: {
                cc.log("INIT SHADOW NOT FOUND :  " + this._cfgId)
            }
        }

        this.troop.addChild(shadow, -1);

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
                            animation.addSpriteFrameWithFile(frameName);
                        }
                        animation.setDelayPerUnit(TroopConfig[cfgId][action].frame_time);
                        animation.setRestoreOriginalFrame(true);
                        this._animations[action][direct] = cc.animate(animation).repeatForever();
                    } else {
                    }

                })
            }
        });

    },

    runAnimation: function (direction, action) {
        if (!this._animations[action][direction]) {
            let i = DIRECTIONS.indexOf(direction);
            return {anim: this._animations[action][DIRECTIONS[DIRECTIONS.length - 1 - i]], flip: true};
        }
        return {anim: this._animations[action][direction], flip: false};
    },

    handleMapChange: function (event) {
        cc.log("GRID MAP CHANGED!" + JSON.stringify(event));

        const Algorithm = AlgorithmImplement.Instance();
        Algorithm.setGridMapStar(MapManager.Instance().mapGrid);
        if (event.getUserData().buildingId === this.armyCamp.getId()) {
            this.troop.stopAllActions();
            let start = this.troop.getPosition();
            let end = this.armyCamp.getPosition();
            this.runToCamp(start, end);
        }

    },


    runAndMotionAction: function (action = "run", direction = "left") {
        let dir = direction;
        if (action === "idle") {
            let i = Math.floor(Math.random() * 8);
            dir = DIRECTIONS[i];
        }
        let animation = this.runAnimation(dir, action);
        let runAnim = animation.anim.clone();
        runAnim.retain();

        let stopPreviousAction = cc.callFunc(() => {
            if (this.previousAction) {
                this.troop.stopAction(this.previousAction);
                this.troop.setFlippedX(false);
            }
            this.previousAction = runAnim;
        }, this);

        let runCurrentAction = cc.callFunc(() => {
            this.troop.runAction(runAnim);
            this.troop.setFlippedX(animation.flip)
        }, this);

        return [stopPreviousAction, runCurrentAction]
    },

    getDirection: function (origin, target) {
        const deltaX = target.x - origin.x;
        const deltaY = target.y - origin.y;

        if (deltaX > 0 && deltaY === 0) return DIRECTIONS_STRING.UP_RIGHT;
        if (deltaX < 0 && deltaY === 0) return DIRECTIONS_STRING.DOWN_LEFT;
        if (deltaX === 0 && deltaY > 0) return DIRECTIONS_STRING.UP_LEFT;
        if (deltaX === 0 && deltaY < 0) return DIRECTIONS_STRING.DOWN_RIGHT;
        if (deltaX > 0 && deltaY > 0) return DIRECTIONS_STRING.UP;
        if (deltaX < 0 && deltaY < 0) return DIRECTIONS_STRING.DOWN;
    },

    findWayToCamp: function (origin, target) {
        let mapLayer = cc.director.getRunningScene().getMapLayer();

        let start = mapLayer.getGridPosFromMapPos(origin);
        let end = mapLayer.getGridPosFromMapPos(target);

        const Algorithm = AlgorithmImplement.Instance();
        if (!Algorithm._gridMapAStar) {
            Algorithm.setGridMapStar(MapManager.Instance().mapGrid)
        }
        end.x += Math.floor(Math.random() * (AMC_SIZE - 1));
        end.y += Math.floor(Math.random() * (AMC_SIZE - 1));

        let wayGrid = Algorithm.searchPathByAStar([start.x, start.y], [end.x, end.y]);
        wayGrid.push({x: end.x, y: end.y});
        return wayGrid;
    },

    createRunSequence: function (origin, target) {
        let mapLayer = cc.director.getRunningScene().getMapLayer();
        let wayActions = [];
        let start = mapLayer.getGridPosFromMapPos(origin);
        let wayGrid = this.findWayToCamp(origin, target);

        wayGrid.map((path, index) => {
            let targetPos = mapLayer.getMapPosFromGridPos({x: path.x, y: path.y}, false, true);
            let curPos = this.troop.getPosition();
            let distance = cc.pDistance(curPos, targetPos);
            let run = cc.moveTo(distance / (this._moveSpeed * 6), targetPos);
            let direction = this.getDirection(index === 0 ? start : wayGrid[index - 1], path);
            let parallel;
            parallel = cc.spawn(...this.runAndMotionAction("run", direction), run);
            wayActions.push(parallel);
        });
        return wayActions;
    },

    runToCamp: function (origin, target) {
        this.initAnimation()
        let wayActions = this.createRunSequence(origin, target);
        wayActions.push(cc.spawn(...this.runAndMotionAction("idle")));
        wayActions.push(cc.callFunc(() => {
            this.stayInCamp();
        }))
        let moveAction = cc.sequence(...wayActions);
        this.troop.runAction(moveAction);

    },

    stayInCamp: function () {
        let action = cc.sequence(cc.delayTime(TROOP_STAY_TIME), cc.callFunc(() => {
            let target = this.armyCamp.getPosition();
            let origin = this.troop.getPosition()
            this.runToCamp(origin, target);
        }, this));
        this.troop.runAction(action);
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
    },


})