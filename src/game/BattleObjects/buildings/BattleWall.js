var BattleWall = BattleBuilding.extend({
    _type: BUILDING_TYPE.WALL,
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
    },
    loadSpriteByLevel: function (level) {
        if (level == null)
            level = this._level;
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

        //bfs ra 4 hướng xung quanh, khoảng cách 10 ô, nếu là tường thì rèindTarget những troop trong listTroopAttack

        //bfs
        let queue = [];
        queue.push({x: this._posX, y: this._posY, distance: 0});
        let visited = [];

        while(queue.length > 0){
            let cur = queue.shift();
            LogUtils.writeLog("cur: " + cur.x + " " + cur.y);
            //get building
            let building = BattleManager.getInstance().getBuildingByGrid(cur.x, cur.y);
            let buildingListTroopAttack = building && building.listTroopAttack;
            if(buildingListTroopAttack){
                for(let i = 0; i < buildingListTroopAttack.length; i++){
                    let troop = buildingListTroopAttack[i];
                    troop.refindTarget();
                }
            }

            visited.push(cur);
            let dx = [0, 0, 3, -3];
            let dy = [3, -3, 0, 0];
            for(let i = 0; i < 4; i++){
                let next = {x: cur.x + dx[i], y: cur.y + dy[i], distance: cur.distance + 1};
                if(next.distance > 10)
                                    continue;
                if(BattleManager.getInstance().getBuildingByGrid(next.x, next.y) && BattleManager.getInstance().getBuildingByGrid(next.x, next.y)._type === BUILDING_TYPE.WALL){
                    if(!visited.find((e) => e.x === next.x && e.y === next.y)){
                        queue.push(next);
                    }
                }
            }
        }

        this._super();
    }

});