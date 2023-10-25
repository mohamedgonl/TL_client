var BattleManager = cc.Class.extend({

    ctor: function () {
        this.listBuildings = new Map();
        this.listStorage = [];
        this.listMine = [];
        this.listBuilderHut = [];
        this.buildingAmount = {};
        this.mapGrid = [];
        this.gameScene = null;
        this.townHall = null;

        //init map grid
        for (var i = 0; i < GRID_SIZE_BATTLE; i++) {
            this.mapGrid[i] = [];
            for (var j = 0; j < GRID_SIZE_BATTLE; j++)
                this.mapGrid[i][j] = 0;
        }

    },

    //load from server to addBuildingToGameManager
    loadFromServer: function (buildings) {
        for (let index in buildings) {
            let construct = buildings[index];
            let id = construct._id;
            let type = construct._type;
            let posX = (construct._posX + 1) * 3;
            let posY = (construct._posY + 1) * 3;
            let level = construct._level;

            let building = getBattleBuildingFromType(type, level, id, posX, posY);
            if (!building)
                continue;

            // if (type.startsWith("RES")) {
            //     let lastCollectTime = construct.lastCollectTime;
            //     building.setLastCollectTimeAndIconHarvest(lastCollectTime);
            // }

            //cc.log("building Add------------------------------------------",type);
            this.addBuilding(building);
            // cc.log(JSON.stringify(building))
        }

        const Algorithm = AlgorithmImplement.Instance();
        Algorithm.setGridMapStar(BattleManager.Instance().mapGrid);
    },
    addToListMine: function (building) {
        this.listMine.push(building);
    },
    addToListStorage: function (building) {
        this.listStorage.push(building);
    },
    addToListBuilderHut: function (building) {
        this.listBuilderHut.push(building);
    },
    //add building to list and to grid
    addBuilding: function (building) {

        let posX = building._posX;
        let posY = building._posY;
        let id = building._id;
        let width = building._width;
        let height = building._height;
        let level = building._level;
        let typeBuilding = building._type;

        for (let column = posX; column < posX + width; column++)
            for (let row = posY; row < posY + height; row++)
                this.mapGrid[column][row] = id;

        building.onAddIntoMapManager();

        // add to list building {building._id: building}
        this.listBuildings.set(id, building);

        //update list storage, list mine, list builder hut
        switch (typeBuilding.substring(0, 3)) {
            case 'TOW':

                break;
            case 'RES':
                break;
            case 'STO':

                break;
            case 'BAR':
                //cc.log("hanve barrack+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                ArmyManager.Instance().pushBarrack(building);
                break;
            case 'AMC':
                ArmyManager.Instance().pushArmyCamp(building);
                break;
            case 'BDH':
                break;
            default :
                break;

        }
    },

    getAllBuilding: function () {
        return Array.from(this.listBuildings.values());
    },

    getTownHall: function () {
        return this.townHall;
    },

    getBuildingById: function (id) {
        return this.listBuildings.get(id) || null;
    },

    getBuildingByGrid: function (x, y) {
        //if x y null, return null
        if (x === null || y === null)
            return null;
        cc.log("x y::::::::::::::::::::::::::::", x, y)
        return this.listBuildings.get(this.mapGrid[x][y]) || null;
    },

    getListBuilderHut: function () {
        return this.listBuilderHut;
    },

    //listStorage included townhall, gold storage, elixir storage
    getListStorage: function () {
        return this.listStorage;
    },

    checkValidPutBuilding: function (building, newPosX, newPosY) {

        return true;
    },

    getEmptyPositionPutBuilding: function (building) {

        return null;
    },

    removeBuilding: function (building) {
        // remove from building count
        this.buildingAmount[building._type] = Math.max(this.buildingAmount[building._type] - 1, 0);
        //remove from list
        this.listBuildings.delete(building._id);
        //remove from mapGrid
        for (var column = building._posX; column < building._posX + building._width; column++)
            for (var row = building._posY; row < building._posY + building._height; row++)
                this.mapGrid[column][row] = 0;
    },

    getBuildingCountByType: function (type) {
        if (this.buildingAmount[type] === undefined) return 0;
        else {
            return this.buildingAmount[type];
        }
    },

});

BattleManager.Instance = function () {
    if (BattleManager.instance == null) {
        BattleManager.instance = new BattleManager();
    }
    return BattleManager.instance;
}
