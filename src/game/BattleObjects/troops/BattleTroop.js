const GRID_BATTLE_RATIO = 3;
const TROOP_LEVEL = 1;
const TROOP_STATE = {
    FIND: 0, MOVE: 1, ATTACK: 2, IDLE: 3, DEAD: 4,
    IDLE_WHILE_ATTACK: 5
}
const TROOP_SPEED_RATIO = 0.1;
var BattleTroop = cc.Node.extend({
    ctor: function (posX, posY) {
        this._super();
        this.setScale(0.5)
        this._posX = posX;
        this._posY = posY;
        this._favoriteTarget = TROOP_BASE[this._type]["favoriteTarget"];
        this._moveSpeed = TROOP_BASE[this._type]["moveSpeed"] * GRID_BATTLE_RATIO;
        this._attackSpeed = TROOP_BASE[this._type]["attackSpeed"];
        this._damage = TROOP[this._type][TROOP_LEVEL]["damagePerAttack"];
        this._hitpoints = TROOP[this._type][TROOP_LEVEL]["hitpoints"];
        this._attackRange = TROOP_BASE[this._type]["attackRange"] * GRID_BATTLE_RATIO;
        this._damageScale = TROOP_BASE[this._type]["dmgScale"];
        this.isOverhead = (this._type === "ARM_6");
        this._currentHitpoints = this._hitpoints;
        this._target = null;
        //state: 3 state: 0: findPath,1: move,2: attack, 3:idle, 4: death
        this._state = TROOP_STATE.FIND;
        this._path = null;
        this._id = null;

        this._stateAnimation = 0;
        this._firstAttack = true;
        this.dtCount = 0;
        BattleManager.getInstance().addToListCurrentTroop(this);
        BattleManager.getInstance().addToListUsedTroop(this);
        this.initSprite();
        //listen event on end game
        this._eventListener = cc.eventManager.addCustomListener(EVENT_NAMES.END_BATTLE, this.onEndGame.bind(this));

        //log all grid building
        // for(let i = 0; i<132;i++)
        // for(let j = 0; j<132;j++){
        //     let id = BattleManager.getInstance().mapGrid[i][j];
        //     if(id === 0) continue;
        //     LogUtils.writeLog("map: " + i + " " + j + " " + id);
        // }


    },
    setId: function (id) {
        this._id = id;
    },
    onEndGame: function () {
        cc.log("END GAME:::::")
        cc.eventManager.removeListener(this._eventListener);
        if(this._state === TROOP_STATE.DEAD) return;
        this.performIdleAnimation();

    },
    //gameLoop, call in BattleScene
    gameLoop: function (dt) {
        this.dtCount += dt;
        if (this._state === TROOP_STATE.FIND) {
            this.findTarget();

            if(this._target === null) return;
            LogUtils.writeLog("troop ID:" +this._id);
            LogUtils.writeLog("1 :troop " + this._type + " find target " + this._target._type + " id target:" + this._target._id);
            this.findPath();
            LogUtils.writeLog("2 :troop " + this._type + " find target " + this._target._type);
            for(let i = 0; i < this._path.length; i++){
                LogUtils.writeLog("path: " + this._path[i].x + " " + this._path[i].y);
            }
            this.checkPath();
            LogUtils.writeLog("3 :troop " + this._type + " find target " + this._target._type);

            //if not found target, return
            if (this._target === null) {
                cc.log("ERROR :::::: not found target");
                return;
            }

            //attack case
            if (this.isInAttackRange(this._target) === true) {

                this._state = TROOP_STATE.ATTACK;
                this._firstAttack = true;
            }
            //move case
            else {
                this._state = TROOP_STATE.MOVE;
                this._isFirstMove = true;
            }

            LogUtils.writeLog("troop " + this._type +
                            " find target " + this._target._type +
                            "length path: " + this._path.length);
            LogUtils.writeLog("target pos: " + this._target._posX + " " + this._target._posY + "width: " + this._target._width + " height: " + this._target._height);
            for(let i = 0; i < this._path.length; i++){
                LogUtils.writeLog("path: " + this._path[i].x + " " + this._path[i].y);
            }
            return;
        }

        if (this._state === TROOP_STATE.MOVE) {

            this.moveLoop(dt);
            return;
        }

        if (this._state === TROOP_STATE.ATTACK) {
            this.attackLoop(dt);

        }

        if(this._state === TROOP_STATE.IDLE){
            cc.log("IDLE:::::")
            this.performIdleAnimation();
        }

    },

    //set direct to target grid
    setDirect: function (directX, directY) {
        if (directX > 0)
            directX = 1;
        else if (directX < 0)
            directX = -1;
        else directX = 0;

        if (directY > 0)
            directY = 1;
        else if (directY < 0)
            directY = -1;
        else directY = 0;

        this._directX = directX;
        this._directY = directY;
    },



    //check if troop in attack range of building,
    // normal case : troop._posX, troop._posY,
    // else : tempX, tempY
    isInAttackRange: function (building, tempX, tempY) {
        let corners = building.getCorners();

        let xStart = corners[0].x;
        let xEnd = corners[1].x;
        let yStart = corners[0].y;
        let yEnd = corners[2].y;

        let x = this._posX;
        let y = this._posY;

        if (tempX !== undefined && tempY !== undefined) {
            x = tempX;
            y = tempY;
        }

        //if X and Y in range of building
        if (x >= xStart && x <= xEnd && y >= yStart && y <= yEnd) {
            return true;
        }


        //if X or Y in range of building
        if (x >= xStart && x <= xEnd) {

            return (Math.abs(y - yStart) <= this._attackRange || Math.abs(yEnd - y) <= this._attackRange);
        }
        if (y >= yStart && y <= yEnd) {

            return (Math.abs(x - xStart) <= this._attackRange || Math.abs(xEnd - x) <= this._attackRange);
        }

        //if X and Y not in range of building, get nearest corner by if else
        let xNearest = 0;
        let yNearest = 0;
        if (x < xStart) xNearest = xStart; else if (x > xEnd) xNearest = xEnd; else xNearest = x;

        if (y < yStart) yNearest = yStart; else if (y > yEnd) yNearest = yEnd; else yNearest = y;

        //if distance from nearest corner to troop < attack range
        let distanceSquare = (xNearest - x)*(xNearest - x) + (yNearest - y)*(yNearest - y);

        // distance = Utils.roundFloat(distance,4);

        return distanceSquare <= this._attackRange*this._attackRange;
    },

    findTarget: function () {
        let listTarget = [];
        switch (this._favoriteTarget) {
            case GAMEOBJECT_PREFIX.DEFENCE:
                listTarget = BattleManager.getInstance().getListDefences();
                break;
            case GAMEOBJECT_PREFIX.RESOURCE:
                listTarget = BattleManager.getInstance().getListResources();
                break;
            case "NONE":
                let mapListBuilding = BattleManager.getInstance().getAllBuilding();
                //to list
                for (let [key, value] of mapListBuilding) {
                    //if destroy, continue
                    if (value.isDestroy()) continue;
                    //if obs, continue
                    if (value._type.startsWith(GAMEOBJECT_PREFIX.OBSTACLE)) continue;
                    if (value._type.startsWith(GAMEOBJECT_PREFIX.WALL)) continue;
                    listTarget.push(value);
                }
                break;
            default:
                cc.log("Error::::: NOT FOUND FAVORITE TARGET", this._favoriteTarget)
        }


        //if not have favourite target, change to NONE and find again
        if (listTarget.length === 0) {
            if (this._favoriteTarget !== "NONE")
            {
                this._favoriteTarget = "NONE";
                this.findTarget();
            }
            else
            {
                this._state = TROOP_STATE.IDLE;
            }
            return;
        }

        //get min distance target
        let minDistanceSquare = null;
        this._target = null;
        for (let i = 0; i < listTarget.length; i++) {

            let target = listTarget[i];

            //if destroy, continue
            if (target.isDestroy()) continue;
            //get min distance
            let nearestPoint = target.getNearestPoint({x: this._posX, y: this._posY});
            let distanceSquare =  (nearestPoint.x- this._posX)*(nearestPoint.x- this._posX)
                                        + (nearestPoint.y- this._posY)*(nearestPoint.y- this._posY);

            if (minDistanceSquare == null || distanceSquare < minDistanceSquare) {
                minDistanceSquare = distanceSquare;
                this._target = target;
            }
        }

        if (this._target === null) {
            //if no building left, change to idle
            if (this._favoriteTarget === "NONE") {
                this._state = TROOP_STATE.IDLE;

            }
            //if no favorite target, change to find all building and find again
            else {
                this._favoriteTarget = "NONE";
                this._state = TROOP_STATE.FIND;
                this.findTarget();
            }
        }
    },
    findPath: function () {
        //get path
        let graph = BattleManager.getInstance().getBattleGraph();
        let start = new BattleGridNode(this._posX, this._posY, graph.getNode(this._posX, this._posY).weight, null);

        //let end X Y random in building
        if(this._id === null)
        {
            cc.log("ID TROOP NULL :::::::::::::::::::")

        }
        let nearestPoint = this._target.getNearestPoint({x: this._posX, y: this._posY},this._id,true);

        let end = new BattleGridNode(
            nearestPoint.x, nearestPoint.y,
            graph.getNode(nearestPoint.x, nearestPoint.y).weight, this._target._id);

        this._path = BattleAStar.search(graph, start, end);
    },

    //check that path is valid or not
    //not valid when path go through WAL before in attack range -> change target to WAL and update path
    checkPath: function () {
        for (let i = 0; i < this._path.length; i++) {
            let x = this._path[i].x;
            let y = this._path[i].y;

            // if path go through WAL, this._target = WAL
            let building = BattleManager.getInstance().getBuildingByGrid(x, y);
            if(building !== null) {
                LogUtils.writeLog("building: " + building._type);
                LogUtils.writeLog("x , y" + x + " " + y);
                LogUtils.writeLog("building pos: " + building._posX + " " + building._posY);
                LogUtils.writeLog("building width: " + building._width + " height: " + building._height);
            }
            if (building !== null && building._type.startsWith(GAMEOBJECT_PREFIX.WALL)) {
                LogUtils.writeLog("troop " + this._type + " change target to " + building._type);
                this._target = building;
                //update this._path = _path from 0 to i
                this._path = this._path.slice(0, i);
                return;
            }

            //if (x,y) is in range attack, path is valid, return;
            if (this.isInAttackRange(this._target, x, y) === true) {
                return;
            }
        }
    },


    moveLoop: function (dt) {
        //if target destroy, find new target
        if (this._target.isDestroy()) {
            this._state = TROOP_STATE.FIND;
            return;
        }
        if (this._path.length === 0) {
            this._state = TROOP_STATE.ATTACK;
            return;
        }

        //perform run animation by direction


        if (this._isFirstMove === true) {
            this._nextIndex = 0;

            //current index distance left = 1 if not cross, 1.414 if cross
            if (this._path[this._nextIndex].x !== this._posX &&
                this._path[this._nextIndex].y !== this._posY) {
                this._isCross = false;
                this._nextIndexDistanceLeft = 1.414;
            } else {
                this._isCross = true;
                this._nextIndexDistanceLeft = 1;
            }
            this._isFirstMove = false;
        }

        this.setDirect(this._path[this._nextIndex].x - this._posX, this._path[this._nextIndex].y - this._posY);
        this.performRunAnimation();

        //distance moved each dt
        let distance = Utils.roundFloat(dt * this._moveSpeed * TROOP_SPEED_RATIO,4);

        //if move in this grid, not ++ currentIndex
        if (this._nextIndexDistanceLeft > distance) {
            this._nextIndexDistanceLeft = Utils.roundFloat(this._nextIndexDistanceLeft - distance,4);
        }

        //if move to next index of path
        else {
            this._nextIndex++;
            if (this._nextIndex >= this._path.length) {
                this._state = TROOP_STATE.ATTACK;
                this._firstAttack = true;
                return;
            }
            if (this.isInAttackRange(this._target) === true) {
                //on end Path -> attack mode
                this._state = TROOP_STATE.ATTACK;
                this._firstAttack = true;
                return;
            }


            let nextPos = this._path[this._nextIndex];

            //nếu chéo, = 1.414, else this._nextIndexDistanceLeft = 1
            if (nextPos.x !== this._posX && nextPos.y !== this._posY) {
                this._isCross = false;
                this._nextIndexDistanceLeft = 1.414 - (distance - this._nextIndexDistanceLeft);
            } else {
                this._isCross = true;
                this._nextIndexDistanceLeft = 1 - (distance - this._nextIndexDistanceLeft);

            }
            this._nextIndexDistanceLeft = Utils.roundFloat(this._nextIndexDistanceLeft,4);

            // set posX, y is currentPos
            this._posX = this._path[this._nextIndex - 1].x;
            this._posY = this._path[this._nextIndex - 1].y;
            LogUtils.writeLog("troop " + this._type + " move to next index" + this._posX + " " + this._posY  + " dt:" + this.dtCount);
        }


        //set pos in layer
        let posIndexInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos({
            x: this._path[this._nextIndex].x, y: this._path[this._nextIndex].y
        });

        let posPrevIndexInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos({
            x: this._posX, y: this._posY
        });

        //let length = 1 if not cross, 1.414 if cross
        let pos;
        if (this._isCross === true) {
            pos = cc.pLerp(posIndexInMap, posPrevIndexInMap, this._nextIndexDistanceLeft);
        } else pos = cc.pLerp(posIndexInMap, posPrevIndexInMap, this._nextIndexDistanceLeft / 1.414);
        this.setPosition(pos);


    },

    attackLoop: function (dt) {
        if (this._target.isDestroy()) {
            this._state = TROOP_STATE.FIND;
            return;
        }
        let timeAttackAnimationHit = TroopInfo[this._type]["timeAttackAnimationHit"];
        if (this._firstAttack === true) {
            // attackCd = timeAttackAnimationHit for first time
            let centerTarget = this._target.getCenterPosition();
            this.setDirect(centerTarget.x - this._posX, centerTarget.y - this._posY);
            this._attackCd = timeAttackAnimationHit;
            this._attackCd = Utils.roundFloat(this._attackCd,4);
            this._firstAttack = false;
        }

        //loop Attack CD
        if (this._attackCd === 0) {
            this._attackCd = this._attackSpeed ;
            this._attackCd = Utils.roundFloat(this._attackCd,4);
            LogUtils.writeLog("troop" + this._type + " attack" + this._target._type + " dtCount" + this.dtCount);
            this.attack();
            LogUtils.writeLog("troop" + this._type + " attacked" + this._target._type + " dtCount" + this.dtCount);

        } else{

            this._attackCd -= dt;
            let timeAttackAnimation = 1;
            if(this._attackCd <= timeAttackAnimationHit || this._attackCd >= this._attackSpeed - (timeAttackAnimation - timeAttackAnimationHit))
            {
                this.performAttackAnimation();
            }
            else {
                // cc.log("IDLEEE:::::")
                this.performIdleAnimation();
            }

            this._attackCd = Utils.roundFloat(this._attackCd,4);
            if (this._attackCd < 0) {
                this._attackCd = 0;
            }
        }
    },

    performIdleAnimation: function () {
        let directX = this._directX;
        let directY = this._directY;
        this._bodySprite.setScale(1);

        let action;
        if (directX === 1 && directY === 1) { //UP
            action = res_troop.IDLE[this._type].UP.ANIM;
        } else if (directX === 1 && directY === 0) { //UP_RIGHT
            action = res_troop.IDLE[this._type].UP_LEFT.ANIM;
            this._bodySprite.setScale(-1, 1);
        } else if (directX === 1 && directY === -1) { //RIGHT
            action = res_troop.IDLE[this._type].LEFT.ANIM;
            this._bodySprite.setScale(-1, 1);
        } else if (directX === 0 && directY === 1) { //UP_LEFT
            action = res_troop.IDLE[this._type].UP_LEFT.ANIM;
        } else if (directX === 0 && directY === 0) { //UP
            action = res_troop.IDLE[this._type].UP.ANIM;
        } else if (directX === 0 && directY === -1) { //DOWN_RIGHT
            action = res_troop.IDLE[this._type].DOWN_LEFT.ANIM;
            this._bodySprite.setScale(-1, 1);
        } else if (directX === -1 && directY === 1) { //LEFT
            action = res_troop.IDLE[this._type].LEFT.ANIM;
        } else if (directX === -1 && directY === 0) { //DOWN_LEFT
            action = res_troop.IDLE[this._type].DOWN_LEFT.ANIM;
        } else if (directX === -1 && directY === -1) { //DOWN
            action = res_troop.IDLE[this._type].DOWN.ANIM;
        }


        if (action === undefined) {
            cc.log("ERROR ::::::: action undefined");
            cc.log("directX: " + directX + " directY: " + directY)
        }

        let cloneAction = action.clone();
        //animate forever
        let animate = cc.animate(cloneAction);
        animate.repeatForever();

        if (this._stateAnimation !== TROOP_STATE.IDLE_WHILE_ATTACK || this._directXAnimation !== directX || this._directYAnimation !== directY) {
            this._stateAnimation = TROOP_STATE.IDLE_WHILE_ATTACK;
            this._directXAnimation = directX;
            this._directYAnimation = directY;
            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(animate);
        }

    },

    attack: function () {
        let damage = this._damage;
        //if target is favorite target, damage *= damageScale
        if (this._target._type.startsWith(this._favoriteTarget) === true) {
            damage *= this._damageScale;
        }
        this._target.onGainDamage(damage,this);
    },

    performAttackAnimation: function () {
        let directX = this._directX;
        let directY = this._directY;
        this._bodySprite.setScale(1);

        let attackAction;
        if (directX === 1 && directY === 1) { //UP
            attackAction = res_troop.ATTACK[this._type].UP.ANIM;
        } else if (directX === 1 && directY === 0) { //UP_RIGHT
            attackAction = res_troop.ATTACK[this._type].UP_LEFT.ANIM;
            this._bodySprite.setScale(-1, 1);
        } else if (directX === 1 && directY === -1) { //RIGHT
            attackAction = res_troop.ATTACK[this._type].LEFT.ANIM;
            this._bodySprite.setScale(-1, 1);
        } else if (directX === 0 && directY === 1) { //UP_LEFT
            attackAction = res_troop.ATTACK[this._type].UP_LEFT.ANIM;
        } else if (directX === 0 && directY === 0) { //UP
            attackAction = res_troop.ATTACK[this._type].UP.ANIM;
        } else if (directX === 0 && directY === -1) { //DOWN_RIGHT
            attackAction = res_troop.ATTACK[this._type].DOWN_LEFT.ANIM;
            this._bodySprite.setScale(-1, 1);
        } else if (directX === -1 && directY === 1) { //LEFT
            attackAction = res_troop.ATTACK[this._type].LEFT.ANIM;
        } else if (directX === -1 && directY === 0) { //DOWN_LEFT
            attackAction = res_troop.ATTACK[this._type].DOWN_LEFT.ANIM;
        } else if (directX === -1 && directY === -1) { //DOWN
            attackAction = res_troop.ATTACK[this._type].DOWN.ANIM;
        }


        if (attackAction === undefined) {
            cc.log("ERROR ::::::: attack action undefined");
            cc.log("directX: " + directX + " directY: " + directY)
        }

        let cloneAttackAction = attackAction.clone();
        //animate forever
        let animate = cc.animate(cloneAttackAction);
        animate.repeatForever();

        if (this._stateAnimation !== this._state || this._directXAnimation !== directX || this._directYAnimation !== directY) {
            this._stateAnimation = this._state;
            this._directXAnimation = directX;
            this._directYAnimation = directY;
            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(animate);
        }
    },
    performRunAnimation: function () {

        let directX = this._directX;
        let directY = this._directY;
        this._bodySprite.setScale(1);
        let moveAction = null;
        //UP
        if (directX === 1 && directY === 1) {
            moveAction = res_troop.RUN[this._type].UP.ANIM;
        }
        //UP_RIGHT
        else if (directX === 1 && directY === 0) {
            moveAction = res_troop.RUN[this._type].UP_LEFT.ANIM;
            this._bodySprite.setScale(-1, 1);
        }
        //RIGHT
        else if (directX === 1 && directY === -1) {
            moveAction = res_troop.RUN[this._type].LEFT.ANIM;
            this._bodySprite.setScale(-1, 1);
        }
        //UP_LEFT
        else if (directX === 0 && directY === 1) {
            moveAction = res_troop.RUN[this._type].UP_LEFT.ANIM;
        }
        //UP
        else if (directX === 0 && directY === 0) {
            moveAction = res_troop.RUN[this._type].UP.ANIM;
        }
        //DOWN_RIGHT
        else if (directX === 0 && directY === -1) {
            moveAction = res_troop.RUN[this._type].DOWN_LEFT.ANIM;
            this._bodySprite.setScale(-1, 1);
        }
        //LEFT
        else if (directX === -1 && directY === 1) {
            moveAction = res_troop.RUN[this._type].LEFT.ANIM;
        }
        //DOWN_LEFT
        else if (directX === -1 && directY === 0) {
            moveAction = res_troop.RUN[this._type].DOWN_LEFT.ANIM;
        }
        //DOWN
        else if (directX === -1 && directY === -1) {
            moveAction = res_troop.RUN[this._type].DOWN.ANIM;
        }
        //ELSE
        else {
            cc.log("Error");
        }

        let cloneMoveAction = moveAction.clone();
        let animate = cc.animate(cloneMoveAction).repeatForever();
        if (this._stateAnimation !== this._state || this._directXAnimation !== directX || this._directYAnimation !== directY) {
            this._stateAnimation = this._state;
            this._directXAnimation = directX;
            this._directYAnimation = directY;

            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(animate);
        }
    },

    //call when troop gain damage, update hp bar, if hp = 0, call dead
    onGainDamage: function (damage) {
        this._hpBar.setVisible(true);
        this._currentHitpoints -= damage;
        this._hpBar.setPercent(this._currentHitpoints / this._hitpoints * 100);
        if (this._currentHitpoints <= 0) {
            this.dead();
        }

        LogUtils.writeLog("troop " + this._type + " gain " + damage + " ~ " + this._currentHitpoints);

    },

    isAlive: function () {
        return this._currentHitpoints > 0;
    },

    dead: function () {
        //remove from list
        BattleManager.getInstance().onTroopDead(this);
        //perform death animation
        this._state = TROOP_STATE.DEAD;
        this._bodySprite.stopAllActions();
        this._bodySprite.setTexture(effect.RIP);

        this._hpBar.setVisible(false);

        //effect.GHOST bay lên và biến mất sau 0.5s
        let ghost = new cc.Sprite(effect.GHOST);
        ghost.setScale(0.5);
        ghost.setPosition(this.getPosition());
        this.getParent().addChild(ghost);
        ghost.runAction(cc.sequence(cc.moveBy(0.3, 0, 30), cc.fadeOut(0.5), cc.removeSelf()));

        LogUtils.writeLog("troop " + this._type + " dead");
    },
    //create sprite of troop with shadow, body, hp bar
    initSprite: function () {
        //shadow
        this._shadow = new cc.Sprite(res_troop.SHADOW.SMALL);
        this._shadow.setScale(0.5)
        this.addChild(this._shadow);

        //body
        this._bodySprite = new cc.Sprite(res_troop.RUN[this._type].LEFT[1]);
        this.addChild(this._bodySprite);

        //progress bar hp
        this._hpBar = new ccui.Slider();
        this._hpBar.setScale(SCALE_BUILDING_BODY);
        this._hpBar.loadBarTexture(res_map.SPRITE.HEALTH_BAR_BG);
        this._hpBar.loadProgressBarTexture(res_map.SPRITE.TROOP_HEALTH_BAR);
        this._hpBar.setAnchorPoint(0.5, 1);
        this._hpBar.setPosition(0, TroopInfo[this._type]["hpBarPosY"]);
        this._hpBar.setPercent(100);
        this._hpBar.setVisible(true);
        this.addChild(this._hpBar, ZORDER_BUILDING_EFFECT);



    },
    refindTarget: function () {
        if(this._state === TROOP_STATE.DEAD) return;
        this._state = TROOP_STATE.FIND;
    },
    toString: function () {
        return "BattleTroop{" +
            "type='" + this._type + '\'' +
            ", posX=" + this._posX +
            ", posY=" + this._posY +
            ", favoriteTarget='" + this._favoriteTarget + '\'' +
            ", currentHitpoints=" + this._currentHitpoints +
            '}';
    }

});

