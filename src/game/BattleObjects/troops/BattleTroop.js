const GRID_BATTLE_RATIO = 3;
const TROOP_LEVEL = 1;
const TROOP_STATE = {
    FIND: 0, MOVE: 1, ATTACK: 2, IDLE: 3, DEAD: 4,
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
        this._attackCd = this._attackSpeed;
        this._stateAnimation = 0;
        this._firstAttack = true;
        this.dtCount = 0;
        BattleManager.getInstance().addToListCurrentTroop(this);
        BattleManager.getInstance().addToListUsedTroop(this);
        this.initSprite();

    },
    //gameLoop, call in BattleScene
    gameLoop: function (dt) {
        this.dtCount += dt;
        if (this._state === TROOP_STATE.FIND) {
            this.findTarget();
            this.findPath();
            this.checkPath();
            //change weight of grid in path +1 for various path each troop
            let graph = BattleManager.getInstance().getBattleGraph();
            for (let i = 0; i < this._path.length; i++) {
                let x = this._path[i].x;
                let y = this._path[i].y;
                graph.changeNodeWeight(x, y, graph.getNode(x, y).weight + 1);
            }
            //if not found target, return
            if (this._target === null) {
                cc.log("ERROR :::::: not found target");
                return;
            }

            //attack case
            if (this.isInAttackRange(this._target) === true) {

                this._state = TROOP_STATE.ATTACK;
                this._firstAttack = true;
                //set direct to target
                this.setDirect(this._target._posX - this._posX, this._target._posY - this._posY);
            }
            //move case
            else {
                this._state = TROOP_STATE.MOVE;
                this._isFirstMove = true;
            }

            LogUtils.writeLog("troop " + this._type + " find target " + this._target._type);
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


    getPathToBuilding: function (building) {
        //get path
        let graph = BattleManager.getInstance().getBattleGraph();
        let start = new BattleGridNode(this._posX, this._posY, graph.getNode(this._posX, this._posY).weight, null);

        //get center of building
        let targetCenterX = building._posX + Math.floor(building._width / 2);
        let targetCenterY = building._posY + Math.floor(building._height / 2);
        LogUtils.writeLog("target center: " + targetCenterX + " " + targetCenterY);

        // let end = new BattleGridNode(targetCenter.x,targetCenter.y,graph.getNode(targetCenter.x,targetCenter.y).weight);
        //let end = random node in building
        // let buildingRandomX = Math.floor(Math.random() * (building._width-1)) + building._posX;
        // let buildingRandomY = Math.floor(Math.random() * (building._height-1)) + building._posY;


        let end = new BattleGridNode(targetCenterX, targetCenterY, graph.getNode(targetCenterX, targetCenterY).weight, building._id);
        return BattleAStar.search(graph, start, end);
        // return BattleAStar.searchSimple(graph, start, end);
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
        let distance = Math.sqrt(Math.pow(xNearest - x, 2) + Math.pow(yNearest - y, 2));

        if (distance <= this._attackRange) {

            return true;
        }

        return false;
    },

    findTarget: function () {
        let listTarget = [];
        switch (this._favoriteTarget) {
            case "DEF":
                listTarget = BattleManager.getInstance().getListDefences();
                break;
            case "RES":
                listTarget = BattleManager.getInstance().getListResources();
                break;
            case "NONE":
                let mapListBuilding = BattleManager.getInstance().getAllBuilding();
                //to list
                for (let [key, value] of mapListBuilding) {
                    //if obs, continue
                    if (value._type.startsWith("OBS")) continue;
                    if (value._type.startsWith("WAL")) continue;
                    listTarget.push(value);
                }
                break;
            default:
                cc.log("Error::::: NOT FOUND FAVORITE TARGET", this._favoriteTarget)
        }

        //if not have favourite target, change to NONE and find again
        if (listTarget.length === 0) {
            this._favoriteTarget = "NONE";
            this.findTarget();
            return;
        }

        //get min distance target
        let minDistance = null;
        this._target = null;
        for (let i = 0; i < listTarget.length; i++) {

            let target = listTarget[i];

            //if destroy, continue
            if (target.isDestroy()) continue;
            //get min distance
            let distance = Math.sqrt(Math.pow(this._posX - target._posX, 2) + Math.pow(this._posY - target._posY, 2));
            distance = Utils.roundFloat(distance,4);
            LogUtils.writeLog("troop " + this._type + " distance to " + target._type + " " + Math.floor(distance));
            if (minDistance == null || distance < minDistance) {
                minDistance = distance;
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
        this._path = this.getPathToBuilding(this._target);
    },

    //check that path is valid or not
    //not valid when path go through WAL before in attack range -> change target to WAL and update path
    checkPath: function () {
        for (let i = 0; i < this._path.length; i++) {
            let x = this._path[i].x;
            let y = this._path[i].y;

            // if path go through WAL, this._target = WAL
            let building = BattleManager.getInstance().getBuildingByGrid(x, y);
            if (building !== null && building._type.startsWith("WAL")) {
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
            LogUtils.writeLog("nextIndexDistanceLeft: " + this._nextIndexDistanceLeft + " distance: " + distance + " moveSpeed: " + this._moveSpeed + "dt: " + dt);
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

        this.performAttackAnimation();

        if (this._firstAttack === true) {
            this._firstAttack = false;
        }
        if (this._attackCd === 0) {
            this._attackCd = this._attackSpeed;
            this._attackCd = Utils.roundFloat(this._attackCd,4);
            LogUtils.writeLog("troop" + this._type + " attack" + this._target._type + " dtCount" + this.dtCount);
            this.attack();
            LogUtils.writeLog("troop" + this._type + " attacked" + this._target._type + " dtCount" + this.dtCount);

        } else {
            this._attackCd -= dt;
            this._attackCd = Utils.roundFloat(this._attackCd,4);
            if (this._attackCd < 0) {
                this._attackCd = 0;
            }
        }

    },

    attack: function () {
        let damage = this._damage;

        //if target is favorite target, damage *= damageScale
        if (this._target._type.startsWith(this._favoriteTarget) === true) {
            damage *= this._damageScale;
        }
        this._target.onGainDamage(damage);
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
        animate.setSpeed(1 / this._attackSpeed);

        if (this._stateAnimation !== this._state) {
            this._stateAnimation = this._state;
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
        this._hpBar.setPosition(0, 35);
        this._hpBar.setPercent(100);
        this._hpBar.setVisible(true);
        this.addChild(this._hpBar, ZORDER_BUILDING_EFFECT);
    },
    refindTarget: function () {
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

