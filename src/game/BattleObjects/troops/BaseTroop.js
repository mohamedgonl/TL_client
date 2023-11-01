var BaseTroop = cc.Node.extend({
    ctor: function (posX,posY) {
        this._super();
        this.setScale(0.5)
        this._posX = posX;
        this._posY = posY;
        this._favoriteTarget = TROOP_BASE[this._type]["favoriteTarget"];
        this._target = null;
        this.init();
        this._path = null;
        this.findTargetandPath();
        this.moveToTarget();
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
        if(this.oldDirectX !== directX || this.oldDirectY !== directY)
        {
            cc.log("change move action")
            this._bodySprite.stopAllActions();
            this._bodySprite.runAction(cloneMoveAction);
        }
        this.oldDirectX = directX;
        this.oldDirectY = directY;
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
    move: function (i) {
        if(i === this._path.length) {
            return;
        }
        //have array path, move to each grid in path 0.2s by setPosition
        let path = this._path;
        let self = this;
        cc.log(path[i].x + " " + path[i].y);

        let mapPos = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos({x: path[i].x, y: path[i].y});
        this.setPosition(mapPos);
        //delay 0.2s and call
        if (i < path.length - 1) {
            setTimeout(function () {
                self.move(i + 1);
            }, 200);
        }
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
    },
    moveToTarget: function () {
        let path = this._path;
        cc.log("length path: " + path.length);
        let self = this;
        //create sequence move from path 0 to path.length - 1
        let sequence = [];
        for(let i = 0; i < path.length; i++) {

            console.log(i);
            let mapPos = cc.director.getRunningScene().battleLayer.getMapPosFromGridPos({x: path[i].x, y: path[i].y});
            let moveAction = cc.moveTo(0.15,mapPos);

            let createDirectAction = function (index) {
                return cc.callFunc(function () {
                    let directX = path[index].x - self._posX;
                    let directY = path[index].y - self._posY;
                    self.setRunDirection(directX, directY);
                    self._posX = path[index].x;
                    self._posY = path[index].y;
                }, this);
            };

            let directAction = createDirectAction(i);
            sequence.push(cc.spawn(moveAction, directAction));
        }
        //after all sequence, call Attack
        sequence.push(cc.callFunc(function () {
            self.attack();
        }, this));
        // run sequence
        let sequenceAction = cc.sequence(sequence);
        this.runAction(sequenceAction);
    },
    attack: function () {

    }
});