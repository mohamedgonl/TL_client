const GRID_BATTLE_RATIO = 3;
const TROOP_LEVEL = 1;
const TROOP_STATE = {
    FIND_PATH: 0,
    MOVE: 1,
    ATTACK: 2,
    IDLE: 3,
    DEAD: 4,
}
var BaseTroop = cc.Node.extend({
    ctor: function (posX, posY) {
        this._super();
        this.setScale(0.5)
        this._posX = posX;
        this._posY = posY;
        this._favoriteTarget = TROOP_BASE[this._type]["favoriteTarget"];
        this._moveSpeed = TROOP_BASE[this._type]["moveSpeed"];
        this._attackSpeed = TROOP_BASE[this._type]["attackSpeed"];
        this._damage = TROOP[this._type][TROOP_LEVEL]["damagePerAttack"];
        this._hitpoints = TROOP[this._type][TROOP_LEVEL]["hitpoints"] * 20;
        this._attackRange = TROOP_BASE[this._type]["attackRange"] * GRID_BATTLE_RATIO;
        this._damageScale = TROOP_BASE[this._type]["dmgScale"];
        cc.log("attack range: " + this._attackRange)
        this._currentHitpoints = this._hitpoints;
        this._target = null;
        //state: 3 state: 0: findPath,1: move,2: attack, 3:idle, 4: death
        this._state = TROOP_STATE.FIND_PATH;
        this._path = null;
        this._attackCd = this._attackSpeed;
        this._currentIndex = 0;
        this._stateAnimation = 0;
        this._firstAttack =true;
        BattleManager.getInstance().addToListCurrentTroop(this);
        BattleManager.getInstance().addToListUsedTroop(this);
        this.initSprite();

        //listen event press f to sh    ow isInAttackRange
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                if (keyCode === 70) {
                    cc.log("isInAttackRange: " + this.isInAttackRange(this._target));
                }
            }.bind(this)
        }, this);
    },
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
    gameLoop: function (dt) {
        if (this._state === TROOP_STATE.FIND_PATH) {
            this.findTargetandPath();

            //if not in range, move, else attack
            this._state = TROOP_STATE.MOVE;
            if(this.isInAttackRange(this._target) === true){
                this._state = TROOP_STATE.ATTACK;

                //set direct to target
                let directX = this._target._posX - this._posX;
                let directY = this._target._posY - this._posY;

                if (directX > 0)
                    directX = 1;
                else if (directX < 0)
                    directX = -1;
                else
                    directX = 0;

                if (directY > 0)
                    directY = 1;
                else if (directY < 0)
                    directY = -1;
                else
                    directY = 0;

                this._directX = directX;
                this._directY = directY;

            }

            // this.findTarget();
            // this._path = this.getPathToBuilding(this._target);
            // this.checkPath();
            return;
        }
        if (this._state === TROOP_STATE.MOVE) {
            this.moveToTarget(dt);
            return;
        }

        if (this._state === TROOP_STATE.ATTACK) {
            this.attackTarget(dt);
            return;
        }

    },
    setRunDirection: function (directX, directY) {
        this._bodySprite.setScale(1);
        let moveAction = null;
        //UP
        if (directX === 1 && directY === 1) {
            moveAction = res_troop.RUN[this._type].UP.ANIM;
        }
        //UP_RIGHT
        else if (directX === 1 && directY === 0) {
            //if not have UP_RIGHT, use UP_LEFT and scale -1
            if (res_troop.RUN[this._type].UP_RIGHT === undefined) {
                moveAction = res_troop.RUN[this._type].UP_LEFT.ANIM;
                this._bodySprite.setScale(-1, 1);
            } else
                moveAction = res_troop.RUN[this._type].UP_RIGHT.ANIM;
        }
        //RIGHT
        else if (directX === 1 && directY === -1) {
            //if not have RIGHT, use LEFT and scale -1
            if (res_troop.RUN[this._type].RIGHT === undefined) {
                moveAction = res_troop.RUN[this._type].LEFT.ANIM;
                this._bodySprite.setScale(-1, 1);
            } else
                moveAction = res_troop.RUN[this._type].RIGHT.ANIM;
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
            //if not have DOWN_RIGHT, use DOWN_LEFT and scale -1
            if (res_troop.RUN[this._type].DOWN_RIGHT === undefined) {
                moveAction = res_troop.RUN[this._type].DOWN_LEFT.ANIM;
                this._bodySprite.setScale(-1, 1);
            } else
                moveAction = res_troop.RUN[this._type].DOWN_RIGHT.ANIM;

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
        if (this._stateAnimation !== this._state || this._directX !== directX || this._directY !== directY) {
            this._stateAnimation = this._state;

            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(animate);
        }
        this._directX = directX;
        this._directY = directY;
    },
    getPathToBuilding: function (building) {
        //get path
        let graph = BattleManager.getInstance().getBattleGraph();
        let start = new BattleGridNode(this._posX, this._posY, graph.getNode(this._posX, this._posY).weight);
        let targetCenter = cc.pAdd(building.getGridPosition(), cc.p(building._width / 2, building._height / 2));
        //floor
        targetCenter.x = Math.floor(targetCenter.x);
        targetCenter.y = Math.floor(targetCenter.y);


        // let end = new BattleGridNode(targetCenter.x,targetCenter.y,graph.getNode(targetCenter.x,targetCenter.y).weight);
        //let end = random node in building
        let buildingRandomX = Math.floor(Math.random() * building._width) + building._posX;
        let buildingRandomY = Math.floor(Math.random() * building._height) + building._posY;
        let end = new BattleGridNode(buildingRandomX, buildingRandomY, graph.getNode(buildingRandomX, buildingRandomY).weight);
        return BattleAStar.search(graph, start, end);
    },
    isInAttackRange: function (building) {
        let corners = building.getCorners();

        let xStart = corners[0].x;
        let xEnd = corners[1].x;
        let yStart = corners[0].y;
        let yEnd = corners[2].y;

        let x = this._posX;
        let y = this._posY;

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
        if (x < xStart)
            xNearest = xStart;
        else if (x > xEnd)
            xNearest = xEnd;
        else
            xNearest = x;

        if (y < yStart)
            yNearest = yStart;
        else if (y > yEnd)
            yNearest = yEnd;
        else
            yNearest = y;

        //if distance from nearest corner to troop < attack range
        let distance = Math.sqrt(Math.pow(xNearest - x, 2) + Math.pow(yNearest - y, 2));

        if (distance <= this._attackRange) {

            return true;
        }

        return false;
    },

    //return -1 if not found
    //set this._target and this._path

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
                cc.log("Error::::: NOT FOUND FAVORITE TARGET")
        }

        if (listTarget.length === 0) {
            this._target = null;
            return;
        }

        this._currentIndex = 0;
        //get min distance target
        let minDistance = null;
        this._target = null;

        for (let i = 0; i < listTarget.length; i++) {

            let target = listTarget[i];

            //if destroy, continue
            if (target.isDestroy()) continue;
            //get min distance
            let distance = Math.sqrt(Math.pow(this._posX - target._posX, 2) + Math.pow(this._posY - target._posY, 2));
            if (minDistance == null || distance < minDistance) {
                minDistance = distance;
                this._target = target;
            }
        }

        if (this._target === null) {
            cc.log("Error::::: NOT FOUND TARGET")
            this.state = TROOP_STATE.IDLE;
            return;
        }

        this._state = TROOP_STATE.MOVE;
    },

    //check path have wall
    checkPath: function () {

    },
    findTargetandPath: function () {
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
                    cc.log("push target")
                    listTarget.push(value);
                }
                break;
            default:
                cc.log("Error::::: NOT FOUND FAVORITE TARGET", this._favoriteTarget)
        }

        if (listTarget.length === 0) {
            this._favoriteTarget = "NONE";
            return;
        }

        this._currentIndex = 0;
        //get min distance target
        let minDistance = null;
        this._target = null;

        for (let i = 0; i < listTarget.length; i++) {

            let target = listTarget[i];

            //if destroy, continue
            if (target.isDestroy()) continue;
            //get min distance
            let distance = Math.sqrt(Math.pow(this._posX - target._posX, 2) + Math.pow(this._posY - target._posY, 2));
            if (minDistance == null || distance < minDistance) {
                minDistance = distance;
                this._target = target;
            }
        }

        if (this._target === null) {
            if (this._favoriteTarget === "NONE") {
                this._state = TROOP_STATE.IDLE;
                return;
                cc.log("no target");
            } else {
                this._favoriteTarget = "NONE";
                this._state = TROOP_STATE.FIND_PATH;
                return;
            }
        }


        this._path = this.getPathToBuilding(this._target);

        //for in path, if path go through WAL, this._target = WAL
        for (let i = 0; i < this._path.length; i++) {
            let node = this._path[i];
            let building = BattleManager.getInstance().getBuildingByGrid(node.x, node.y);
            if (building !== null && building._type.startsWith("WAL")) {
                this._target = building;
                //update this._path = _path from 0 to i
                this._path = this._path.slice(0, i);
                break;
            }
        }
    },

    moveToTarget: function (dt) {
        //if target destroy, find new target
        if (this._target.isDestroy()) {
            cc.log("target destroy")
            this._state = TROOP_STATE.FIND_PATH;
            return;
        }


        if (this._path.length === 0) {
            // cc.log("path length 0")
            return;
        }

        //distance each dt
        let distance = dt * this._moveSpeed / GRID_BATTLE_RATIO;
        if (this._currentIndexLeft > distance) {
            this._currentIndexLeft -= distance;
        } else {
            this._currentIndex++;
            if (this.isInAttackRange(this._target) === true) {
                //on end Path -> attack mode
                this._state = TROOP_STATE.ATTACK;
                this._firstAttack = true;
                return;
            }
            this._posX = this._path[this._currentIndex].x;
            this._posY = this._path[this._currentIndex].y;
            //nếu chéo, = 1.414, else this._currentIndexLeft = 1
            if (this._path[this._currentIndex].x !== this._path[this._currentIndex - 1].x
                && this._path[this._currentIndex].y !== this._path[this._currentIndex - 1].y) {
                this._isCross = false;
                this._currentIndexLeft = 1.414 - (distance - this._currentIndexLeft || 0);
                //cc.log("cross::::, currentIndexLeft: " + this._currentIndexLeft);
            } else {
                this._isCross = true;
                this._currentIndexLeft = 1 - (distance - this._currentIndexLeft || 0);
                //cc.log("not cross::::, currentIndexLeft: " + this._currentIndexLeft);
            }
        }
        //cc.log("currentIndex: " + this._currentIndex + "   " + this._currentIndexLeft)

        //set pos
        let posIndexInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(
            {x: this._path[this._currentIndex].x, y: this._path[this._currentIndex].y});

        let prevIndex = (this._currentIndex - 1) || 0;
        let posPrevIndexInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(
            {x: this._path[prevIndex].x, y: this._path[prevIndex].y})
        ;

        //let length = 1 if not cross, 1.414 if cross
        let pos;
        if (this._isCross === true) {
            pos = cc.pLerp(posIndexInMap, posPrevIndexInMap, this._currentIndexLeft);
        } else
            pos = cc.pLerp(posIndexInMap, posPrevIndexInMap, this._currentIndexLeft / 1.414);
        this.setPosition(pos);

        //set direction
        let directX = this._path[this._currentIndex].x - this._path[this._currentIndex - 1].x;
        let directY = this._path[this._currentIndex].y - this._path[this._currentIndex - 1].y;
        this.setRunDirection(directX, directY);
    },
    attackTarget: function (dt) {
        if (this._target.isDestroy()) {
            cc.log("target destroy")
            this._state = TROOP_STATE.FIND_PATH;
            return;
        }

        //perform attack when first attack, delay /2 attack speed to anim match with building gain dame
        if (this._firstAttack === true && this._attackCd >= this._attackSpeed / 2) {
            this._firstAttack = false;
            cc.log("first attack")
            this.performAttackAnimation();
        }


        if (this._attackCd === 0) {
            this._attackCd = this._attackSpeed;
            let damage = this._damage;

            //if target is favorite target, damage *= damageScale
            if (this._target._type.startsWith(this._favoriteTarget) === true) {
                cc.log("favorite target");
                damage *= this._damageScale;
            }

            this._target.onGainDamage(damage);
        } else {
            this._attackCd -= dt;
            if (this._attackCd < 0) {
                this._attackCd = 0;
                cc.log("attack cd = 0")
            }
        }
    },

    performAttackAnimation: function () {
        let directX = this._directX;
        let directY = this._directY;
        this._bodySprite.setScale(1);
        let attackAction;//= res_troop.ATTACK[this._type].LEFT.ANIM;

        if (directX === 1 && directY === 1) { //UP
            attackAction = res_troop.ATTACK[this._type].UP.ANIM;
        } else if (directX === 1 && directY === 0) { //UP_RIGHT
            if (res_troop.ATTACK[this._type].UP_RIGHT === undefined) {
                attackAction = res_troop.ATTACK[this._type].UP_LEFT.ANIM;
                this._bodySprite.setScale(-1, 1);
            } else
                attackAction = res_troop.ATTACK[this._type].UP_RIGHT.ANIM;
        } else if (directX === 1 && directY === -1) { //RIGHT
            if (res_troop.ATTACK[this._type].RIGHT === undefined) {
                attackAction = res_troop.ATTACK[this._type].LEFT.ANIM;
                this._bodySprite.setScale(-1, 1);
            } else
                attackAction = res_troop.ATTACK[this._type].RIGHT.ANIM;
        } else if (directX === 0 && directY === 1) { //UP_LEFT
            attackAction = res_troop.ATTACK[this._type].UP_LEFT.ANIM;
        } else if (directX === 0 && directY === 0) { //UP
            attackAction = res_troop.ATTACK[this._type].UP.ANIM;
        } else if (directX === 0 && directY === -1) { //DOWN_RIGHT
            if (res_troop.ATTACK[this._type].DOWN_RIGHT === undefined) {
                attackAction = res_troop.ATTACK[this._type].DOWN_LEFT.ANIM;
                this._bodySprite.setScale(-1, 1);
            } else
                attackAction = res_troop.ATTACK[this._type].DOWN_RIGHT.ANIM;
        } else if (directX === -1 && directY === 1) { //LEFT
            attackAction = res_troop.ATTACK[this._type].LEFT.ANIM;
        } else if (directX === -1 && directY === 0) { //DOWN_LEFT
            attackAction = res_troop.ATTACK[this._type].DOWN_LEFT.ANIM;
        } else if (directX === -1 && directY === -1) { //DOWN
            attackAction = res_troop.ATTACK[this._type].DOWN.ANIM;
        }
        if (attackAction === undefined) {
            cc.log("attack action undefined");
            cc.log("directX: " + directX + " directY: " + directY)
        }
        let cloneAttackAction = attackAction.clone();
        //animate forever
        let animate = cc.animate(cloneAttackAction);
        animate.repeatForever();
        animate.setSpeed(1/this._attackSpeed);

        cc.log("performAttack")
        if (this._stateAnimation !== this._state) {
            this._stateAnimation = this._state;
            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(animate);
        }
    },
    onGainDamage: function (damage) {
        this._currentHitpoints -= damage;
        this._hpBar.setPercent(this._currentHitpoints / this._hitpoints * 100);
        if (this._currentHitpoints <= 0) {
            this._currentHitpoints = 0;
            this.dead();
        }
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
    }

});

