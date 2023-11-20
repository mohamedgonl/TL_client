var Wall = Building.extend({
    _type: "WAL_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        //schedule load sprite
        //this.schedule(this.loadSpriteByLevel, 5);
    },
    loadMainSpriteByLevel: function (level = this._level) {
        let stateWall=0;
            //check up and right grid, if is wall
            let upBuilding = MapManager.getInstance().getBuildingByGrid(this._posX, this._posY + 1);
            let rightBuilding = MapManager.getInstance().getBuildingByGrid(this._posX + 1, this._posY);

            let upGrid = upBuilding && upBuilding._type === "WAL_1";
            let rightGrid = rightBuilding && rightBuilding._type === "WAL_1";

            if (upGrid && rightGrid) {
                stateWall = 3;
            }
            else if(upGrid && !rightGrid){
                stateWall = 2;
            }
            else if(!upGrid && rightGrid){
                stateWall = 1;
            }
        this.loadMainSprite(res_map.SPRITE.BODY.WALL[level][stateWall],null);
    },
    onMoved: function () {
        this._super();
        cc.log("wall onMoved")
        this.loadMainSpriteByLevel();
        this.reloadSpriteWallAround();
    },
    completeBuild: function () {
        this._super();
    },

    reloadSpriteWallAround: function () {
        //load wall below and left grid
        let belowBuilding = MapManager.getInstance().getBuildingByGrid(this._posX, this._posY - 1);
        let leftBuilding = MapManager.getInstance().getBuildingByGrid(this._posX - 1, this._posY);

        if(belowBuilding && belowBuilding._type === "WAL_1"){
            belowBuilding.loadMainSpriteByLevel(belowBuilding._level);
        }
        if(leftBuilding && leftBuilding._type === "WAL_1"){
            leftBuilding.loadMainSpriteByLevel(leftBuilding._level);
        }
    }

});