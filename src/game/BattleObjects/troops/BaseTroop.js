const GRID_BATTLE_RATIO = 3;
var BaseTroop = cc.Node.extend({

    ctor: function (posX,posY) {
        this._super();
        this.setScale(0.5)
        this._posX = posX;
        this._posY = posY;
        this._favoriteTarget = TROOP_BASE[this._type]["favoriteTarget"];
        this._moveSpeed = TROOP_BASE[this._type]["moveSpeed"];
        this._attackSpeed = TROOP_BASE[this._type]["attackSpeed"];
        this._target = null;
        //state: 3 state: 0: idle,1: move,2: attack
        this._state = 0;
        this._path = null;
        this._attackCd = 0;
        this._currentIndex = 0;
        this._stateAnimation = 0;
        BattleManager.getInstance().addToListArmy(this);
        this.init();
        this.findTargetandPath();

    },
    init: function () {
        this._bodySprite = new cc.Sprite(res_troop.RUN[this._type].LEFT[1]);
        this.addChild(this._bodySprite);
    },
    setRunDirection: function (directX,directY) {
        let moveAction;
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
        if(this._stateAnimation !== this._state || this._directX !== directX || this._directY !== directY)
        {
            this._stateAnimation = this._state;
            cc.log("change move action")
            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(cloneMoveAction);
        }
        this._directX = directX;
        this._directY = directY;
    },
    getPathToBuilding: function (building) {
        //get path
        let graph = BattleManager.getInstance().getBattleGraph();
        let start = new  BattleGridNode(this._posX,this._posY,graph.getNode(this._posX,this._posY).weight);
        let targetCenter = cc.pAdd(building.getGridPosition(),cc.p(building._width/2,building._height/2));
        //floor
        targetCenter.x = Math.floor(targetCenter.x);
        targetCenter.y = Math.floor(targetCenter.y);

        cc.log(JSON.stringify(targetCenter, null, 2));
        let end = new BattleGridNode(targetCenter.x,targetCenter.y,graph.getNode(targetCenter.x,targetCenter.y).weight);
        return BattleAStar.search(graph,start,end);
    },

    //return -1 if not found
    //set this._target and this._path
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
                    if(value._type.startsWith("WAL")) continue;

                    listTarget.push(value);
                }
                break;
            default:
                cc.log("Error::::: NOT FOUND FAVORITE TARGET")
        }

        if (listTarget.length === 0) {
            return -1;
        }
        //get min distance target

        let minDistance = Math.sqrt(Math.pow(this._posX - listTarget[0]._posX, 2) + Math.pow(this._posY - listTarget[0]._posY, 2));
        this._target = listTarget[0];

        for(let i = 0; i < listTarget.length; i++) {
            //if destroy, continue
            let target = listTarget[i];
            //get min distance
            let distance = Math.sqrt(Math.pow(this._posX - target._posX, 2) + Math.pow(this._posY - target._posY, 2));
            if (distance < minDistance) {
                minDistance = distance;
                this._target = target;
            }
        }

        this._path = this.getPathToBuilding(this._target);

        //for in path, if path go through WAL, this._target = WAL
        for(let i = 0; i < this._path.length; i++) {
            let node = this._path[i];
            let building = BattleManager.getInstance().getBuildingByGrid(node.x,node.y);
            if(building !== null && building._type.startsWith("WAL")) {
                this._target = building;
                //update this._path = _path from 0 to i
                this._path = this._path.slice(0,i);
                break;
            }
        }

        cc.log("=====TARGET=====");
        cc.log(this._target._type);
        cc.log("=====PATH=====");
        for(let i = 0; i < this._path.length; i++) {
            cc.log(this._path[i].x + " " + this._path[i].y);
        }
        cc.log("=====END=====");
        this._currentIndex = 0;
    },
    gameLoop: function (dt){
        if(this._state === 0)
        {
            this.findTargetandPath();
            this._state = 1;
            return;
        }

        if(this._state === 1)
        {
            this.moveToTarget(dt);
            return;
        }

        if(this._state === 2)
        {

            this.attackTarget(dt);
            return;
        }

    },
    moveToTarget: function (dt) {
        if(this._path.length === 0) {
            cc.log("path length 0")
            return;
        }
        let distance = dt*this._moveSpeed/GRID_BATTLE_RATIO;
        if(this._currentIndexLeft > distance) {
            this._currentIndexLeft -= distance;
        }
        else
        {
            this._currentIndex++;
            cc.log("index: " + this._currentIndex);
            if(this._currentIndex >= this._path.length) {

                //on end Path -> attack mode
                cc.log("end path");
                this._state = 2;
                return;
            }
            //nếu chéo, = 1.414, else this._currentIndexLeft = 1
            if(this._path[this._currentIndex].x !== this._path[this._currentIndex - 1].x
                && this._path[this._currentIndex].y !== this._path[this._currentIndex - 1].y) {
                this._isCross = false;
                this._currentIndexLeft = 1.414 - (distance - this._currentIndexLeft||0);
                cc.log("cross::::, currentIndexLeft: " + this._currentIndexLeft);
            }
            else
            {
                this._isCross = true;
                this._currentIndexLeft = 1 - (distance - this._currentIndexLeft||0);
                cc.log("not cross::::, currentIndexLeft: " + this._currentIndexLeft);
            }
        }
        cc.log("currentIndex: " + this._currentIndex + "   " + this._currentIndexLeft)

        //set pos
        let posIndexInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(
            {x: this._path[this._currentIndex].x, y: this._path[this._currentIndex].y});

        let posPrevIndexInMap = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos(
            {x: this._path[this._currentIndex - 1].x, y: this._path[this._currentIndex - 1].y});

        //let length = 1 if not cross, 1.414 if cross
        let pos;
        if(this._isCross === true) {
            pos = cc.pLerp(posIndexInMap, posPrevIndexInMap, this._currentIndexLeft);
        }
        else
            pos = cc.pLerp(posIndexInMap, posPrevIndexInMap, this._currentIndexLeft/1.414);
        this.setPosition(pos);

        //set direction
        let directX = this._path[this._currentIndex].x - this._path[this._currentIndex - 1].x;
        let directY = this._path[this._currentIndex].y - this._path[this._currentIndex - 1].y;
        this.setRunDirection(directX, directY);
    },
    attackTarget: function (dt){

        //perform attack
        if(this._attackCd===0)
        {
            // this._attackCd = this._attackSpeed;
            // //attack
            // this._bodySprite.stopAllActions();
            // this._bodySprite.runAction(res_troop.ATTACK[this._type].ANIM);
            // this._target._hp -= TROOP_BASE[this._type]["damage"];
            // if(this._target._hp<=0)
            // {
            //     this._target._hp = 0;
            //     this._target._state = 2;
            //     this._target._bodySprite.stopAllActions();
            //     this._target._bodySprite.runAction(res_building.DESTROY[this._target._type].ANIM);
            //     this._target._bodySprite.runAction(cc.sequence(cc.delayTime(1),cc.removeSelf()));
            //     this._target = null;
            //     this._state = 0;
            //     this._path = null;
            //     this._currentIndex = 0;
            //     return;
            // }
            this.performAttackAnimation();
        }
    },
    performAttackAnimation: function () {
        let directX = this._directX;
        let directY = this._directY;
        let attackAction= res_troop.ATTACK[this._type].LEFT.ANIM;
        let cloneAttackAction = attackAction.clone();
        if(this._stateAnimation !== this._state)
        {
            this._stateAnimation = this._state;
            cc.log("change attack action")
            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(cloneAttackAction);
        }


    }

});