var Builder = cc.Sprite.extend({

    ctor: function(posX,posY)
    {
        this._super();
        this._body = new cc.Sprite();
        this._body.setTexture(res_map.SPRITE.BUILDER.DOWN[0]);
        this._body.setScale(0.5,0.5)
        this._body.setAnchorPoint(0.5,0.5);
        this.addChild(this._body);

        let mapLayer = cc.director.getRunningScene().getMapLayer();
        let listBDH = MapManager.Instance().getListBuilderHut();
        this._builderHut = listBDH[0];
        let posStartInMap = mapLayer.getMapPosFromGridPos(cc.pAdd(this._builderHut.getGridPosition(), cc.p(1,0)));
        this.setPosition(posStartInMap.x,posStartInMap.y);
        this._gridPosition = cc.pAdd(this._builderHut.getGridPosition(), cc.p(1,0));
        let target = MapManager.Instance().getTownHall();
        this._target = target;
        this.runTo(target);
    },
    //run to target , use A* algorithm, target is building
    runTo: function (target) {
        let targetDirection = cc.pSub(target.getGridPosition(), this.getGridPosition());
        cc.log("targetDirection: " + targetDirection.x + " " + targetDirection.y)
        // cc.log("target: " + target.getGridPosition().x + " " + target.getGridPosition().y)
        cc.log("builder: " + this.getGridPosition().x + " " + this.getGridPosition().y)
        if(targetDirection.x >= 0 && targetDirection.y >= 0)
        {
            //check can walk in grid +1 +1
            if(this.canWalkInGrid(cc.pAdd(this.getGridPosition(), cc.p(1,1)))) {
                this.moveEachStep(res_map.SPRITE.BUILDER.DOWN[0], cc.pAdd(this.getGridPosition(), cc.p(1,1)), 0.5);
            }
            //if x =0 , check can walk in grid 0 +1
            else if(targetDirection.x === 0 && this.canWalkInGrid(cc.pAdd(this.getGridPosition(), cc.p(0,1)))) {
                this.moveEachStep(res_map.SPRITE.BUILDER.DOWN[0], cc.pAdd(this.getGridPosition(), cc.p(0,1)), 0.5);
            }
            //if y =0 , check can walk in grid +1 0
            else if(targetDirection.y === 0 && this.canWalkInGrid(cc.pAdd(this.getGridPosition(), cc.p(1,0)))) {
                this.moveEachStep(res_map.SPRITE.BUILDER.DOWN[0], cc.pAdd(this.getGridPosition(), cc.p(1,0)), 0.5);
            }
            //else random 1 step
            else {
                let random = Math.floor(Math.random() * 2);
                cc.log("random: " + random)
                if(random === 0) {
                    if(this.canWalkInGrid(cc.pAdd(this.getGridPosition(), cc.p(1,0)))) {
                        this.moveEachStep(res_map.SPRITE.BUILDER.DOWN[0], cc.pAdd(this.getGridPosition(), cc.p(1,0)), 0.5);
                    }
                    else if(this.canWalkInGrid(cc.pAdd(this.getGridPosition(), cc.p(0,1)))) {
                        this.moveEachStep(res_map.SPRITE.BUILDER.DOWN[0], cc.pAdd(this.getGridPosition(), cc.p(0,1)), 0.5);
                    }
                }
                else {
                    if(this.canWalkInGrid(cc.pAdd(this.getGridPosition(), cc.p(0,1)))) {
                        this.moveEachStep(res_map.SPRITE.BUILDER.DOWN[0], cc.pAdd(this.getGridPosition(), cc.p(0,1)), 0.5);
                    }
                    else if(this.canWalkInGrid(cc.pAdd(this.getGridPosition(), cc.p(1,0)))) {
                        this.moveEachStep(res_map.SPRITE.BUILDER.DOWN[0], cc.pAdd(this.getGridPosition(), cc.p(1,0)), 0.5);
                    }
                }
            }
        }
        else cc.log("can't run to target++++++++++++++++++++++++++++++++++")
        // else
        // if(targetDirection.x > 0 && targetDirection.y < 0 && this.canWalkInGrid(cc.pAdd(this.getGridPosition(), cc.p(1,-1)))) {
        //
        // }

    },
    moveEachStep: function (texture, gridPos, time) {
        // cc.log("moveEachStep: " + gridPos.x + " " + gridPos.y)
        this._body.setTexture(texture);
        this._gridPosition = gridPos;
        let mapLayer = cc.director.getRunningScene().getMapLayer();
        let posInMap = mapLayer.getMapPosFromGridPos(this._gridPosition);
        this.setPosition(posInMap.x, posInMap.y);
        //after 0.5s run to target setTime
        this.scheduleOnce(function () {
            this.runTo(this._target);
        }, time);

        // call back runTo
        // this.runAction(cc.sequence(cc.moveTo(time, posInMap.x, posInMap.y), cc.callFunc(this.runTo(this._target), this)));
    },

    canWalkInGrid: function (gridPos) {
        let id = MapManager.Instance().mapGrid[gridPos.x][gridPos.y];
        if(id === undefined) return false;
        if(id === 0) return true;
        if(id === -1) return false;
        if(id === null) return false;

        //nếu 4 ô trên dưới trái phải của nó đều bằng id thì không thể đi qua
        let id1 = MapManager.Instance().mapGrid[gridPos.x][gridPos.y + 1];
        let id2 = MapManager.Instance().mapGrid[gridPos.x][gridPos.y - 1];
        let id3 = MapManager.Instance().mapGrid[gridPos.x + 1][gridPos.y];
        let id4 = MapManager.Instance().mapGrid[gridPos.x - 1][gridPos.y];

        if(id1 === id && id2 === id && id3 === id && id4 === id) return false;
        return true;
    },
    getGridPosition: function () {
        return this._gridPosition;
    }
});