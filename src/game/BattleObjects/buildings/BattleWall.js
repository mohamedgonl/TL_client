var BattleWall = BattleBuilding.extend({
    _type: BUILDING_TYPE.WALL,
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
        this._listTroopAttack = [];
    },
    loadSpriteByLevel: function (level) {
        if (level == null)
            level = this._level;

        cc.log("level:::::",this._level)
        let stateWall=0;
        //check up and right grid, if is wall
        let upBuilding = BattleManager.getInstance().getBuildingByGrid(this._posX, this._posY + 3); // battle grid size is x3
        let rightBuilding = BattleManager.getInstance().getBuildingByGrid(this._posX + 3, this._posY); // battle grid size is x3

        let upGrid = upBuilding && upBuilding._type === BUILDING_TYPE.WALL;
        let rightGrid = rightBuilding && rightBuilding._type === BUILDING_TYPE.WALL;

        if (upGrid && rightGrid) {
            stateWall = 3;
        }
        else if(upGrid && !rightGrid){
            stateWall = 2;
        }
        else if(!upGrid && rightGrid){
            stateWall = 1;
        }
        this.loadSprite(res_map.SPRITE.BODY.WALL[level][stateWall], null, 0, null, res_map.SPRITE.BODY.WALL.JUNK);
    },
    onDestroy: function () {
        this._super();
        //get list troop from battle manager
        let listTroop = BattleManager.getInstance().getListCurrentTroops();

        //for in list troop, if troop attack type wall, remove from list troop attack
        for (let i = 0; i < listTroop.length; i++) {
            if(!listTroop[i].isAlive()) continue;
            if(listTroop[i]._target._type.startsWith(GAMEOBJECT_PREFIX.WALL)){
                listTroop[i].refindTarget();
            }
        }

    }

});