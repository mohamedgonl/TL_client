var BattleManager = cc.Class.extend({

    ctor: function () {
        this.init();
        this._battleGraph = null;
        this.listBuildings = new Map();
        this.listTroops = new Map();

        this.buildingAmount = {};

        this.mapGrid =[];  //map of building id
        this.findPathGrid = []; //map of weight for find path, if wall, weight += 9 ; if center of building, weight +=9999;

        this.battleMap = [];//map logic for drop troops
        this.battleScene = null;

        //init map grid
        for (var i = 0; i < GRID_SIZE_BATTLE; i++) {
            this.mapGrid[i] = [];
            this.findPathGrid[i] = [];
            this.battleMap[i] = [];
            for (var j = 0; j < GRID_SIZE_BATTLE; j++) {
                this.mapGrid[i].push(0);
                this.findPathGrid[i].push(0);
                this.battleMap[i].push(0);
            }
        }
    },

    init: function (){
        this.isWin = false;
        this.starAmount = 0;
        this.battleStatus = BATTLE_STATUS.PREPARING;
        this.townHall = null;
        this.listResources = [];
        this.listWalls = [];
        this.listDefences = [];
        this.listBullets = [];
    },

    resetState: function () {
        this.listBuildings.clear();
        this.listTroops.clear();

        //init map grid
        for (var i = 0; i < GRID_SIZE_BATTLE; i++) {
            for (var j = 0; j < GRID_SIZE_BATTLE; j++) {
                this.mapGrid[i][j] = 0;
                this.findPathGrid[i][j] = 0;
                this.battleMap[i][j] = 0;
            }
        }

        this.init();
    },

    loadFromServer: function (data) {
        const {
            matchId,
            enemyId,
            enemyName,
            availableGold,
            availableElixir,
            winPoint,
            losePoint,
            buildings,
            troops
        } = data;

        //load info
        this.matchId = matchId;
        this.enemyId = enemyId;
        this.enemyName = enemyName;
        this.availableGold = availableGold;
        this.availableElixir = availableElixir;
        this.winPoint = winPoint;
        this.losePoint = losePoint;

        //load buildings
        for (let index in buildings) {
            let construct = buildings[index];
            let id = construct.id;
            let type = construct.type;
            let posX = construct.posX;
            let posY = construct.posY;
            let level = construct.level;

            let building = getBattleBuildingFromType(type, level, id, posX, posY);

            if (!building)
                continue;

            this.addBuilding(building);
        }
        this.initMapLogic();

        //load troops
        for (let index in troops) {
            let troop = troops[index];
            this.listTroops.set(troop.type, troop.amount);
        }
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

    initMapLogic: function () {
        for (let building of this.listBuildings.values())
            if (!building._type.startsWith("OBS")) {

                //update mapGrid
                    for (let column = building._posX; column < building._posX  + building._width; column++)
                        for (let row = building._posY ; row < building._posY  + building._height; row++)
                            this.mapGrid[column][row] = building._id;

                //update findPathGrid
                if(building._type.startsWith("WAL")) {
                    for (let column = building._posX ; column < building._posX + building._width ; column++)
                        for (let row = building._posY ; row < building._posY + building._height ; row++)
                            this.findPathGrid[column][row] = 9;
                }
                else{
                    for (let column = building._posX + 1; column < building._posX + building._width - 1; column++)
                        for (let row = building._posY + 1; row < building._posY + building._height - 1; row++)
                            this.findPathGrid[column][row] = 99999;
                }

                //update battleMap
                const padding = 3;
                for (let column = Math.max(building._posX - padding, 0);
                     column < Math.min(building._posX + building._width + padding, GRID_SIZE_BATTLE - 1);
                     column++)
                    for (let row = Math.max(building._posY - padding, 0);
                         row < Math.min(building._posY + building._height + padding, GRID_SIZE_BATTLE - 1);
                         row++)
                        this.battleMap[column][row] = 1;
            }

        //update battle graph
        this._battleGraph = new BattleGraph(this.findPathGrid);
        cc.log("get battle graph");
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

        // building.onAddIntoMapManager();

        // add to list building {building._id: building}
        this.listBuildings.set(id, building);

        //update list storage, list mine, list builder hut
        switch (typeBuilding.substring(0, 3)) {
            case 'TOW':
                this.townHall = building;
                break;
            case 'RES':
                this.listResources.push(building);
                break;
            case 'STO':
                this.listResources.push(building);
                break;
            case 'WAL':
                this.listWalls.push(building);
                break;
            case 'DEF':
                this.listDefences.push(building);
                break;
            case 'BDH':
                break;
            default :
                break;

        }
    },

    getAllBuilding: function () {
        return this.listBuildings;
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
        return this.listBuildings.get(this.mapGrid[x][y]) || null;
    },

    getListResources: function () {
        return this.listResources;
    },
    getListDefences: function () {
        return this.listDefences;
    },

    checkValidPutBuilding: function (building, newPosX, newPosY) {

        return true;
    },

    getEmptyPositionPutBuilding: function (building) {

        return null;
    },

    onDestroyBuilding: function (building) {
        // remove from building count
        this.buildingAmount[building._type] = Math.max(this.buildingAmount[building._type] - 1, 0);

        //update troopMap
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
    getMapGrid: function () {
        return this.mapGrid;
    },
    getFindPathGrid: function () {
        return this.findPathGrid;
    },
    getBattleGraph: function () {
        return this._battleGraph;
    },

    addBullet: function (bullet, defence) {
        this.battleScene.battleLayer.addBullet(bullet, defence);
        this.listBullets.push(bullet);
    },
});

BattleManager.getInstance = function () {
    if (BattleManager.instance == null) {
        BattleManager.instance = new BattleManager();
    }
    return BattleManager.instance;
}
BattleManager.releaseInstance = function () {
    BattleManager.instance = null;
}
