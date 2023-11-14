var BattleWall = BattleBuilding.extend({
    _type: "WAL_1",
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
        this.loadSprite(res_map.SPRITE.BODY.WALL[level][stateWall], null, 0, null, res_map.SPRITE.BODY.WALL.JUNK);
    },

    addTroopAttack: function (troop) {
        cc.log("add troop attack")
        this._listTroopAttack.push(troop);
    },
    removeTroopAttack: function (troop) {
        let index = this._listTroopAttack.indexOf(troop);
        if (index !== -1) {
            this._listTroopAttack.splice(index, 1);
        }
    },
    onDestroy: function () {
        this._super();
        //remove all troop attack this wall
        this._listTroopAttack.map(troop => {
            if(troop && troop._target === this)
                troop.refindTarget();
        })
    }

});