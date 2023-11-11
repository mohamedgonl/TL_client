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
    attackTarget: function (dt) {
        if (this._target.isDestroy()) {
            cc.log("target destroy")
            this._state = TROOP_STATE.FIND_PATH;
            return;
        }
        //perform attack
        if (this._firstAttack === true && this._attackCd >= this._attackSpeed / 2) {
            this._firstAttack = false;
            this.performAttackAnimation();
        }
        if (this._attackCd === 0) {
            this._attackCd = this._attackSpeed;
            //cc.log("attack damage::::",this._damage)
            this._target.onGainDamage(this._damage);
            //attack

        } else {
            this._attackCd -= dt;
            if (this._attackCd < 0)
                this._attackCd = 0;
        }
    },
    ctor: function (posX, posY) {
        this._super();
        this.setScale(0.5)
        this._posX = posX;
        this._posY = posY;
        this._favoriteTarget = TROOP_BASE[this._type]["favoriteTarget"];
        this._moveSpeed = TROOP_BASE[this._type]["moveSpeed"];
        this._attackSpeed = TROOP_BASE[this._type]["attackSpeed"];
        this._damage = TROOP[this._type][TROOP_LEVEL]["damagePerAttack"] * 5;
        this._attackRange = TROOP_BASE[this._type]["attackRange"];
        this._hitpoints = TROOP[this._type][TROOP_LEVEL]["hitpoints"];

        this._currentHitpoints = this._hitpoints;
        this._target = null;
        //state: 3 state: 0: findPath,1: move,2: attack, 3:idle, 4: death
        this._state = TROOP_STATE.FIND_PATH;
        this._path = null;
        this._attackCd = this._attackSpeed;
        this._currentIndex = 0;
        this._stateAnimation = 0;
        BattleManager.getInstance().addToListCurrentTroop(this);
        BattleManager.getInstance().addToListUsedTroop(this);
        this.initSprite();
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
    },
    delayTime: 0.6,
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

                    listTarget.push(value);
                }
                break;
            default:
                cc.log("Error::::: NOT FOUND FAVORITE TARGET")
        }

        if (listTarget.length === 0) {
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
            this.state = 3;
            return;
        }

        this._state = 1;
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
        cc.log("=====TARGET=====");
        cc.log(this._target._id);
        // cc.log("=====PATH=====");
        // for(let i = 0; i < this._path.length; i++) {
        //     cc.log(this._path[i].x + " " + this._path[i].y);
        // }
        cc.log("=====END=====");

    },
    gameLoop: function (dt) {
        if (this._state === TROOP_STATE.FIND_PATH) {
            this.findTargetandPath();
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

    //return -1 if not found
    //set this._target and this._path
    getPathToBuilding: function (building) {
        //get path
        let graph = BattleManager.getInstance().getBattleGraph();
        let start = new BattleGridNode(this._posX, this._posY, graph.getNode(this._posX, this._posY).weight);
        let targetCenter = cc.pAdd(building.getGridPosition(), cc.p(building._width / 2, building._height / 2));
        //floor
        targetCenter.x = Math.floor(targetCenter.x);
        targetCenter.y = Math.floor(targetCenter.y);

        cc.log(JSON.stringify(targetCenter, null, 2));
        let end = new BattleGridNode(targetCenter.x, targetCenter.y, graph.getNode(targetCenter.x, targetCenter.y).weight);
        return BattleAStar.search(graph, start, end);
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
    isAlive: function () {
        return this._currentHitpoints > 0;
    },
    moveToTarget: function (dt) {
        //if target destroy, find new target
        if (this._target.isDestroy()) {
            cc.log("target destroy")
            this._state = TROOP_STATE.FIND_PATH;
            return;
        }
        //đang di chuyển giữa đường thì nhà bị phá
        if (this._path.length === 0) {
            // cc.log("path length 0")
            return;
        }
        let distance = dt * this._moveSpeed / GRID_BATTLE_RATIO;
        if (this._currentIndexLeft > distance) {
            this._currentIndexLeft -= distance;
        } else {
            this._currentIndex++;


            //cc.log("index: " + this._currentIndex);
            if (this._currentIndex >= this._path.length) {

                //on end Path -> attack mode
                cc.log("end path");
                this._firstAttack = true;
                this._state = TROOP_STATE.ATTACK;
                return;
            }
            this._posX = this._path[this._currentIndex].x;
            this._posY = this._path[this._currentIndex].y;
            //nếu chéo, = 1.414, else this._currentIndexLeft = 1
            if (this._path[this._currentIndex].x !== this._path[this._currentIndex - 1].x
                && this._path[this._currentIndex].y !== this._path[this._currentIndex - 1].y) {
                this._isCross = true;
                this._currentIndexLeft = 1.414 - (distance - this._currentIndexLeft || 0);
                //cc.log("cross::::, currentIndexLeft: " + this._currentIndexLeft);
            } else {
                this._isCross = false;
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
        if (this._isCross === false) {
            pos = cc.pLerp(posIndexInMap, posPrevIndexInMap, this._currentIndexLeft);
        } else
            pos = cc.pLerp(posIndexInMap, posPrevIndexInMap, this._currentIndexLeft / 1.414);
        this.setPosition(pos);

        //set direction
        let directX = this._path[this._currentIndex].x - this._path[this._currentIndex - 1].x;
        let directY = this._path[this._currentIndex].y - this._path[this._currentIndex - 1].y;
        this.setRunDirection(directX, directY);
    },
    onGainDamage: function (damage) {
        cc.log("gain damage: " + damage);
        this._currentHitpoints -= damage;
        this._hpBar.setPercent(this._currentHitpoints / this._hitpoints * 100);
        if (this._currentHitpoints <= 0) {
            this._currentHitpoints = 0;
            this.dead();
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

        let cloneAttackAction = attackAction.clone();

        if (this._stateAnimation !== this._state) {
            this._stateAnimation = this._state;
            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(cloneAttackAction);
        }
    },
    setRunDirection: function (directX, directY) {
        this._bodySprite.setScale(1);
        let moveAction = null;
        if (directX === 1 && directY === 1) {
            moveAction = res_troop.RUN[this._type].UP.ANIM;
        } else if (directX === 1 && directY === 0) {
            moveAction = res_troop.RUN[this._type].UP_RIGHT.ANIM;
        } else if (directX === 1 && directY === -1) {
            moveAction = res_troop.RUN[this._type].RIGHT.ANIM;
        } else if (directX === 0 && directY === 1) {
            moveAction = res_troop.RUN[this._type].UP_LEFT.ANIM;
        } else if (directX === 0 && directY === 0) {
            moveAction = res_troop.RUN[this._type].UP.ANIM;
        } else if (directX === 0 && directY === -1) {
            moveAction = res_troop.RUN[this._type].DOWN_RIGHT.ANIM;

        } else if (directX === -1 && directY === 1) {
            moveAction = res_troop.RUN[this._type].LEFT.ANIM;
        } else if (directX === -1 && directY === 0) {
            moveAction = res_troop.RUN[this._type].DOWN_LEFT.ANIM;
        } else if (directX === -1 && directY === -1) {
            moveAction = res_troop.RUN[this._type].DOWN.ANIM;
        } else {
            cc.log("Error");
        }
        let cloneMoveAction = moveAction.clone();
        if (this._stateAnimation !== this._state || this._directX !== directX || this._directY !== directY) {
            this._stateAnimation = this._state;

            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(cloneMoveAction);
        }
        this._directX = directX;
        this._directY = directY;
    }

});

