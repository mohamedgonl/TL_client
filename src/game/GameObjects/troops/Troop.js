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

        this.armyCamp = ArmyManager.getInstance().getArmyCampList()[armyCampIndex];
        let mapLayer = cc.director.getRunningScene().getMapLayer();

        let start;
        let end = mapLayer.getMapPosFromGridPos({x: this.armyCamp._posX, y: this.armyCamp._posY}, true, false);

        if (barrackIndex >= 0 && barrackIndex !== null) {
            let barrack = ArmyManager.getInstance().getBarrackList()[barrackIndex];
            start = mapLayer.getMapPosFromGridPos({x: barrack._posX, y: barrack._posY}, true);
            this.troop.setPosition(barrack.getPosition().x + 23, barrack.getPosition().y - 25);
        } else {
            start = end;
            this.troop.setPosition(this.armyCamp.getPosition().x, this.armyCamp.getPosition().y);
        }

        this.initShadow();
        this.initAnimation();

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
        shadow.setScale(TroopConfig[this._cfgId].shadow_scale);
        shadow.setPosition(TroopConfig[this._cfgId].shadow_pos[0],TroopConfig[this._cfgId].shadow_pos[1]);
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
        const Algorithm = AlgorithmImplement.getInstance();
        Algorithm.setGridMapStar(MapManager.getInstance().mapGrid);
        let mapLayer = cc.director.getRunningScene().getMapLayer();
        if (event.getUserData().buildingId === this.armyCamp.getId()) {
            this.troop.stopAllActions();
            let end =  mapLayer.getMapPosFromGridPos({x: this.armyCamp._posX, y: this.armyCamp._posY}, true, false);
            let start = this.troop.getPosition()
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
        if (deltaX > 0 && deltaY < 0) return DIRECTIONS_STRING.RIGHT;
        if (deltaX < 0 && deltaY > 0) return DIRECTIONS_STRING.LEFT;
    },

    findWayToCamp: function (origin, target) {
        let mapLayer = cc.director.getRunningScene().getMapLayer();

        let start = mapLayer.getGridPosFromMapPos(origin);
        let end = mapLayer.getGridPosFromMapPos(target);

        const Algorithm = AlgorithmImplement.getInstance();
        if (!Algorithm._gridMapAStar) {
            Algorithm.setGridMapStar(MapManager.getInstance().mapGrid)
        }

        let randomX, randomY;
        do {
            randomX =  Math.floor(Math.random() * AMC_SIZE);
            randomY =  Math.floor(Math.random() * AMC_SIZE);
        }
        while (randomX === 2 && randomY === 2);

        end.x += randomX;
        end.y += randomY;

        let wayGrid = Algorithm.searchPathByAStar([start.x, start.y], [end.x, end.y]);

        wayGrid.unshift({x: start.x, y: start.y})
        wayGrid.push({x: end.x, y: end.y});
        return wayGrid;
    },

    createRunSequence: function (origin, target) {
        let mapLayer = cc.director.getRunningScene().getMapLayer();
        let wayActions = [];
        let wayGrid = this.findWayToCamp(origin, target);

        for (let i = 0; i < wayGrid.length - 1; i++) {
            let curPos = mapLayer.getMapPosFromGridPos({x: wayGrid[i].x, y: wayGrid[i].y}, true, false);
            let targetPos = mapLayer.getMapPosFromGridPos({x: wayGrid[i + 1].x, y: wayGrid[i + 1].y}, true, false);

            let distance = cc.pDistance(curPos, targetPos);

            let runAction = cc.moveTo(distance / (this._moveSpeed * 3), targetPos);

            let direction = this.getDirection(wayGrid[i], wayGrid[i + 1]);

            let parallel;
            parallel = cc.sequence(cc.spawn(...this.runAndMotionAction("run", direction), runAction), cc.callFunc(() => {
                this.troop.stopAction(parallel);
            }));
            wayActions.push(parallel);

        }
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
        let mapLayer = cc.director.getRunningScene().getMapLayer();
        let action = cc.sequence(cc.delayTime(TROOP_STAY_TIME), cc.callFunc(() => {
            let target =  mapLayer.getMapPosFromGridPos({x: this.armyCamp._posX, y: this.armyCamp._posY}, true, false);
            let origin = this.troop.getPosition()
            this.runToCamp(origin, target);
        }, this));
        this.troop.runAction(action);
    },

})