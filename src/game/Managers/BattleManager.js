var BattleManager = cc.Class.extend({

    ctor: function () {
        this.init();
        this._battleGraph = null;
        this.listBuildings = new Map();
        this.listGameObjects = new Map();
        this.listTroops = new Map();
        this.listArmy = [];

        this.buildingAmount = {};

        this.mapGrid = [];  //map of building id
        this.findPathGrid = []; //map of weight for find path, if wall, weight += 9 ; if center of building, weight +=9999;

        this.dropTroopGrid = [];//map logic for drop troops, 1 mean can drop, 0 mean can not drop
        this.battleScene = null;

        //init map grid
        for (var i = 0; i < GRID_SIZE_BATTLE; i++) {
            this.mapGrid[i] = [];
            this.findPathGrid[i] = [];
            this.dropTroopGrid[i] = [];
            for (var j = 0; j < GRID_SIZE_BATTLE; j++) {
                this.mapGrid[i].push(0);
                this.findPathGrid[i].push(0);
                this.dropTroopGrid[i].push(1);
            }
        }
    },

    init: function () {
        this.starAmount = 0;
        this.robbedGold = 0;
        this.robbedElixir = 0;
        this.playerResources = {
            gold: 0,
            elixir: 0,
            gem: 0,
            goldCapacity: 0,
            elixirCapacity: 0,
        };
        this.battleStatus = BATTLE_STATUS.PREPARING;
        this.townHall = null;
        this.listResources = [];
        this.listWalls = [];
        this.listDefences = [];
        this.listBullets = [];
    },

    resetState: function () {
        this.listBuildings.clear();
        this.listGameObjects.clear();
        this.listTroops.clear();
        this.listArmy = [];

        //init map grid
        for (var i = 0; i < GRID_SIZE_BATTLE; i++) {
            for (var j = 0; j < GRID_SIZE_BATTLE; j++) {
                this.mapGrid[i][j] = 0;
                this.findPathGrid[i][j] = 0;
                this.dropTroopGrid[i][j] = 1;
            }
        }

        this.init();
    },

    getPlayerResource: function (type) {
        if (type === RESOURCE_TYPE.GOLD)
            return this.playerResources.gold;
        else if (type === RESOURCE_TYPE.ELIXIR)
            return this.playerResources.elixir;
        else if (type === RESOURCE_TYPE.G)
            return this.playerResources.gem;
        return 0;
    },

    getPlayerMaxResource: function (type) {
        if (type === RESOURCE_TYPE.GOLD)
            return this.playerResources.goldCapacity;
        else if (type === RESOURCE_TYPE.ELIXIR)
            return this.playerResources.elixirCapacity;
        return 0;
    },

    setPlayerResource: function ({gold, elixir, gem,}) {
        if (gold >= 0) {
            this.playerResources.gold = gold;
        }
        if (elixir >= 0) {
            this.playerResources.elixir = elixir;
        }
        if (gem >= 0) {
            this.playerResources.gem = gem;
        }

        let BattleUILayer = cc.director.getRunningScene().battleUILayer;
        if (!BattleUILayer) return;
        BattleUILayer.updatePlayerResources();
    },

    loadFromServer: function (data) {
        const {
            matchId,
            enemyId,
            enemyName,
            availableGold,
            availableElixir,
            gold,
            elixir,
            gem,
            goldCapacity,
            elixirCapacity,
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
        this.playerResources.goldCapacity = goldCapacity;
        this.playerResources.elixirCapacity = elixirCapacity;
        this.playerResources.gold = gold;
        this.playerResources.elixir = elixir;
        this.playerResources.gem = gem;
        this.battleStatus = BATTLE_STATUS.PREPARING;

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

        this.setResourceToBuilding();

        this.initMapLogic();

        //load troops
        for (let index in troops) {
            let troop = troops[index];
            this.listTroops.set(troop.type, troop.amount);
        }
    },
    addToListArmy: function (troop) {
        this.listArmy.push(troop);
    },

    setResourceToBuilding: function () {
        if (!this.listResources || this.listResources.length === 0)
            return;
        const goldCapacity = Math.floor(this.availableGold / this.listResources.length);
        const elixirCapacity = Math.floor(this.availableElixir / this.listResources.length);

        for (let building of this.listResources) {
            if (building._resourceType === RESOURCE_TYPE.GOLD){
                building.setCapacity(goldCapacity);
            }
            else if (building._resourceType === RESOURCE_TYPE.ELIXIR)
                building.setCapacity(elixirCapacity);
        }

        let lastBuilding = this.listResources[this.listResources.length - 1];
        if (lastBuilding._resourceType === RESOURCE_TYPE.GOLD)
            lastBuilding.setCapacity(this.availableGold - goldCapacity * (this.listResources.length - 1));
        else if (lastBuilding._resourceType === RESOURCE_TYPE.ELIXIR)
            lastBuilding.setCapacity(this.availableElixir - elixirCapacity * (this.listResources.length - 1));
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
        for (let building of this.listBuildings.values()) {
            if (!building._type.startsWith("OBS")) {

                //update mapGrid
                for (let column = building._posX; column < building._posX + building._width; column++)
                    for (let row = building._posY; row < building._posY + building._height; row++)
                        this.mapGrid[column][row] = building._id;

                //update findPathGrid
                if (building._type.startsWith("WAL")) {
                    for (let column = building._posX; column < building._posX + building._width; column++)
                        for (let row = building._posY; row < building._posY + building._height; row++)
                            this.findPathGrid[column][row] = 9;
                }
                else {
                    for (let column = building._posX + 1; column < building._posX + building._width - 1; column++)
                        for (let row = building._posY + 1; row < building._posY + building._height - 1; row++)
                            this.findPathGrid[column][row] = 99999;

                }

                //update dropTroopGrid
                const padding = 3;
                for (let column = Math.max(building._posX - padding, 0);
                     column < Math.min(building._posX + building._width + padding, GRID_SIZE_BATTLE - 1);
                     column++)
                    for (let row = Math.max(building._posY - padding, 0);
                         row < Math.min(building._posY + building._height + padding, GRID_SIZE_BATTLE - 1);
                         row++)
                        this.dropTroopGrid[column][row] = 0;
            }
            //is OBS
            else {
                for (let column = building._posX + 1; column < building._posX + building._width - 1; column++)
                    for (let row = building._posY + 1; row < building._posY + building._height - 1; row++)
                    {
                        this.findPathGrid[column][row] = 99999;
                        this.dropTroopGrid[column][row] = 0;
                    }


                //update dropTroopGrid
            }
        }

        //update battle graph
        this._battleGraph = new BattleGraph(this.findPathGrid);

        cc.log("get battle graph");
    },

    //add building to list and to grid
    addBuilding: function (building) {
        let id = building._id;
        let typeBuilding = building._type;

        this.listGameObjects.set(id, building);

        if (typeBuilding.substring(0, 3) !== 'OBS')
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

    getAllGameObjects: function () {
        return this.listGameObjects;
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
    getDropTroopGrid: function () {
        return this.dropTroopGrid;
    },

    checkValidPutBuilding: function (building, newPosX, newPosY) {

        return true;
    },

    getEmptyPositionPutBuilding: function (building) {

        return null;
    },

    onDestroyBuilding: function (building) {
        //check if all buildings are destroyed
        let totalDestroyed = 0;
        for (let building of this.listBuildings.values()){
            if (building.isDestroy())
                totalDestroyed++;
        }
        if (totalDestroyed === this.listBuildings.size){
            this.battleScene.onEndBattle();
        }

        // remove from building count
        this.buildingAmount[building._type] = Math.max(this.buildingAmount[building._type] - 1, 0);

        //update troopMap
        for (var column = building._posX; column < building._posX + building._width; column++)
            for (var row = building._posY; row < building._posY + building._height; row++)
                this.mapGrid[column][row] = 0;

        //update findPathGrid
        if (building._type.startsWith("WAL")) {
            for (let column = building._posX; column < building._posX + building._width; column++)
                for (let row = building._posY; row < building._posY + building._height; row++)
                    // this.findPathGrid[column][row] = 0;
                    this._battleGraph.changeNodeWeight(column, row, 0)
        }
        else {
            for (let column = building._posX + 1; column < building._posX + building._width - 1; column++)
                for (let row = building._posY + 1; row < building._posY + building._height - 1; row++)
                    // this.findPathGrid[column][row] = 0;
                    this._battleGraph.changeNodeWeight(column, row, 0)
        }
    },
    onDestroyTroop: function (troop) {

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

    robResource: function (resource, type) {
        if (type === RESOURCE_TYPE.GOLD) {
            this.robbedGold += resource;
            this.battleScene.battleUILayer.setResourceLeft(this.availableGold - this.robbedGold, type);
            this.setPlayerResource({gold: this.playerResources.gold + resource});
        } else if (type === RESOURCE_TYPE.GOLD) {
            this.robbedElixir += resource;
            this.battleScene.battleUILayer.setResourceLeft(this.availableElixir - this.robbedElixir, type);
            this.setPlayerResource({elixir: this.playerResources.elixir + resource});
        }
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
