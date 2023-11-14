var BattleManager = cc.Class.extend({

    ctor: function () {
        this.init();
        this._battleGraph = null;
        this.listBuildings = new Map();
        this.listGameObjects = new Map();
        this.listTroops = new Map();
        this.listCurrentTroop = [];
        this.listUsedTroop = new Map();
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

        this.totalBuildingPoint = 0;
        this.buildingDestroyedPoint = 0;
        this.isDestroyedHalf = false;

        this.totalTroop = 0;
        this.totalDeadTroop = 0;

        this.battleStatus = BATTLE_STATUS.PREPARING;
        this.townHall = null;
        this.listResources = [];
        this.listWalls = [];
        this.listDefences = [];
        this.listBullets = [];
        this.listObstacles = [];
    },

    resetState: function () {
        this.listBuildings.clear();
        this.listGameObjects.clear();
        this.listTroops.clear();

        //for in list army
        for (let i = 0; i < this.listCurrentTroop.length; i++) {
            this.listCurrentTroop[i].removeFromParent();
        }
        this.listCurrentTroop = [];

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
            this.playerResources.gold = Math.min(gold, this.playerResources.goldCapacity);
        }
        if (elixir >= 0) {
            this.playerResources.elixir = Math.min(elixir, this.playerResources.elixirCapacity);
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

        //reload sprite wall after load all building
        for (let building of this.listWalls) {
            cc.log("++++++++++++++++++++++++")
            building.loadSpriteByLevel(building._level);
        }

        //load troops
        for (let index in troops) {
            let troop = troops[index];
            this.listTroops.set(troop.type, troop.amount);
            this.totalTroop += troop.amount;
        }
    },
    addToListCurrentTroop: function (troop) {
        this.listCurrentTroop.push(troop);
    },
    addToListUsedTroop: function (troop) {
        //key is troop type, value + 1
        if (this.listUsedTroop.has(troop._type)) {
            this.listUsedTroop.set(troop._type, this.listUsedTroop.get(troop._type) + 1);
        } else
            this.listUsedTroop.set(troop._type, 1);
    },

    setResourceToBuilding: function () {
        if (!this.listResources || this.listResources.length === 0)
            return;
        const goldCapacity = Math.floor(this.availableGold / this.listResources.length);
        const elixirCapacity = Math.floor(this.availableElixir / this.listResources.length);

        for (let building of this.listResources) {
            if (building._resourceType === RESOURCE_TYPE.GOLD) {
                building.setCapacity(goldCapacity);
            } else if (building._resourceType === RESOURCE_TYPE.ELIXIR)
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
                } else {
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
                    for (let row = building._posY + 1; row < building._posY + building._height - 1; row++) {
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

    //add gameObject to list and to grid
    addBuilding: function (gameObject) {
        let id = gameObject._id;
        let typeBuildingPrefix = gameObject._type.substring(0, 3);

        this.listGameObjects.set(id, gameObject);

        if (typeBuildingPrefix !== 'OBS') {
            this.listBuildings.set(id, gameObject);
            if (typeBuildingPrefix !== 'WAL')
                this.totalBuildingPoint += gameObject._maxHp;
        }
        //update list storage, list mine, list builder hut
        switch (typeBuildingPrefix) {
            case 'TOW':
                this.townHall = gameObject;
                break;
            case 'RES':
                this.listResources.push(gameObject);
                break;
            case 'STO':
                this.listResources.push(gameObject);
                break;
            case 'WAL':
                this.listWalls.push(gameObject);
                break;
            case 'DEF':
                this.listDefences.push(gameObject);
                break;
            case 'BDH':
                break;
            case 'OBS':
                this.listObstacles.push(gameObject);
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
    getListBullets: function () {
        return this.listBullets;
    },
    getDropTroopGrid: function () {
        return this.dropTroopGrid;
    },
    getListUsedTroops: function () {
        const listTroops = []
        for (let [troopType, amount] of this.listUsedTroop) {
            if (amount > 0)
                listTroops.push({type: troopType, amount})
        }
        return listTroops;
    },
    getListCurrentTroops: function () {
        return this.listCurrentTroop;
    },

    checkValidPutBuilding: function (building, newPosX, newPosY) {

        return true;
    },

    getEmptyPositionPutBuilding: function (building) {

        return null;
    },

    getDestroyedPercentage: function () {
        return Math.floor(this.buildingDestroyedPoint * 100 / this.totalBuildingPoint);
    },

    isAllTroopsDead: function () {
        return this.totalDeadTroop >= this.totalTroop;
    },

    increaseStarAmount: function () {
        this.starAmount++;
        this.battleScene.battleUILayer.updateStarUI();
    },

    onDestroyBuilding: function (building) {
        this.buildingDestroyedPoint += building._maxHp;

        this.battleScene.battleUILayer.updateDestroyPercentage(Math.floor(this.buildingDestroyedPoint * 100 / this.totalBuildingPoint));

        if (!this.isDestroyedHalf && this.buildingDestroyedPoint * 2 >= this.totalBuildingPoint) {
            this.isDestroyedHalf = true;
            this.increaseStarAmount();
        }

        if (building instanceof BattleTownhall)
            this.increaseStarAmount();

        //check if all buildings are destroyed
        if (this.buildingDestroyedPoint >= this.totalBuildingPoint) {
            this.increaseStarAmount();
            this.battleScene.onEndBattle(1);
            return;
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
        } else {
            for (let column = building._posX + 1; column < building._posX + building._width - 1; column++)
                for (let row = building._posY + 1; row < building._posY + building._height - 1; row++)
                    // this.findPathGrid[column][row] = 0;
                    this._battleGraph.changeNodeWeight(column, row, 0)
        }
    },
    onTroopDead: function (troop) {
        this.totalDeadTroop++;

        //update listCurrentTroop
        for (let i = 0; i < this.listCurrentTroop.length; i++) {
            if (this.listCurrentTroop[i] === troop) {
                this.listCurrentTroop.splice(i, 1);
                break;
            }
        }
        if (this.isAllTroopsDead()) {
            this.battleScene.onEndBattle(1);
        }
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

    //get list troops in a circle
    getListTroopsInRange: function (centerPoint, range) {
        //update listCurrentTroop
        const troops = [];
        for (let i = 0; i < this.listCurrentTroop.length; i++) {
            let troop = this.listCurrentTroop[i];
            if (!troop.isAlive())
                continue;
            if (cc.pDistance(centerPoint, cc.p(troop._posX, troop._posY)) <= range)
                troops.push(troop);
        }
        return troops;
    },

    getOrCreateBullet: function (type, startPoint, target, damagePerShot, attackRadius, initPos) {
        let newBullet = null;
        const listBullets = this.listBullets;
        for (let bullet of listBullets)
            if (!bullet.active && bullet._type === type) {
                bullet.init(startPoint, target);
                return bullet;
            }
        if (type === "DEF_1") {
            newBullet = new CannonBullet(type, startPoint, target, damagePerShot, attackRadius, initPos);
        } else if (type === "DEF_2") {
            newBullet = new ArcherTowerBullet(type, startPoint, target, damagePerShot, attackRadius, initPos);
        } else if (type === "DEF_3") {
            newBullet = new MortarBullet(type, startPoint, target, damagePerShot, attackRadius, initPos);
        }

        this.battleScene.battleLayer.addBullet(newBullet);
        this.listBullets.push(newBullet);

        return newBullet;
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
