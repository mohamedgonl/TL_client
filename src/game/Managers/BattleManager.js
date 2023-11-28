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

        this.buildingWeightGrid = []; //map of weight for find path, if wall, weight += 9 ; if center of building, weight +=9999;
        this.buildingWeightGridWithoutWall = []; //map of weight for find path; if center of building, weight +=9999;

        this.dropTroopGrid = [];//map logic for drop troops, 1 mean can drop, 0 mean can not drop
        this.battleScene = null;

        //init map grid
        for (var i = 0; i < GRID_SIZE_BATTLE; i++) {
            this.mapGrid[i] = [];
            this.buildingWeightGrid[i] = [];
            this.buildingWeightGridWithoutWall[i] = [];
            this.dropTroopGrid[i] = [];
            for (var j = 0; j < GRID_SIZE_BATTLE; j++) {
                this.mapGrid[i].push(0);
                this.buildingWeightGrid[i].push(0);
                this.buildingWeightGridWithoutWall[i].push(0);
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

        this.totalBuildingPoint = 0;//to calc destroy percentage
        this.buildingDestroyedPoint = 0;//to calc destroy percentage
        this.isDestroyedHalf = false;

        this.totalTroop = 0;
        this.totalDeadTroop = 0;

        this.battleStatus = BATTLE_STATUS.PREPARING;
        this.townHall = null;
        this.listResources = [];
        this.listWalls = [];
        this.listDefences = [];

        this.listBullets = [];
        this.listTroopBullets = [];

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
                this.buildingWeightGrid[i][j] = 0;
                this.buildingWeightGridWithoutWall[i][j] = 0;
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
        if (this.isOnReplayMode()) return;

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
            troops,
            actions
        } = data;

        //load info
        this.matchId = matchId;
        this.enemyId = enemyId;
        this.enemyName = enemyName;
        this.availableGold = availableGold; //maximum gold can be robbed
        this.availableElixir = availableElixir; //maximum elixir can be robbed
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
            building.loadSpriteByLevel(building._level);
        }

        //load troops
        for (let index in troops) {
            let troop = troops[index];
            this.listTroops.set(troop.type, troop.amount);
            this.totalTroop += troop.amount;
        }

        if (this.isOnReplayMode()) {
            this.actions = actions;
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

        let goldBuildingAmount = 0;
        let elixirBuildingAmount = 0;

        for (let building of this.listResources) {
            if (building._resourceType === RESOURCE_TYPE.GOLD) {
                goldBuildingAmount++;
            } else if (building._resourceType === RESOURCE_TYPE.ELIXIR)
                elixirBuildingAmount++;
        }

        const goldCapacity = Math.floor(this.availableGold / goldBuildingAmount);
        const elixirCapacity = Math.floor(this.availableElixir / elixirBuildingAmount);

        for (let building of this.listResources) {
            if (building._resourceType === RESOURCE_TYPE.GOLD) {
                building.setCapacity(goldCapacity);
            } else if (building._resourceType === RESOURCE_TYPE.ELIXIR)
                building.setCapacity(elixirCapacity);
        }

        for (let i = this.listResources.length - 1; i >= 0; i--) {
            let lastBuilding = this.listResources[i];
            if (lastBuilding._resourceType === RESOURCE_TYPE.GOLD) {
                lastBuilding.setCapacity(this.availableGold - goldCapacity * (goldBuildingAmount - 1));
                break;
            }
        }
        for (let i = this.listResources.length - 1; i >= 0; i--) {
            let lastBuilding = this.listResources[i];
            if (lastBuilding._resourceType === RESOURCE_TYPE.ELIXIR) {
                lastBuilding.setCapacity(this.availableElixir - elixirCapacity * (elixirBuildingAmount - 1));
                break;
            }
        }
    },

    initMapLogic: function () {
        for (let building of this.listBuildings.values()) {
            if (!building._type.startsWith(GAMEOBJECT_PREFIX.OBSTACLE)) {

                //update mapGrid
                for (let column = building._posX; column < building._posX + building._width; column++)
                    for (let row = building._posY; row < building._posY + building._height; row++)
                        this.mapGrid[column][row] = building._id;

                //update buildingWeightGrid
                if (building._type.startsWith(GAMEOBJECT_PREFIX.WALL)) {
                    for (let column = building._posX; column < building._posX + building._width; column++)
                        for (let row = building._posY; row < building._posY + building._height; row++) {
                            this.buildingWeightGrid[column][row] = BATTLE_GRAPH.WALL_WEIGHT;
                        }

                } else {
                    for (let column = building._posX + 1; column < building._posX + building._width - 1; column++)
                        for (let row = building._posY + 1; row < building._posY + building._height - 1; row++) {
                            this.buildingWeightGrid[column][row] = BATTLE_GRAPH.BUILDING_WEIGHT;
                            this.buildingWeightGridWithoutWall[column][row] = BATTLE_GRAPH.BUILDING_WEIGHT;
                        }


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
                // for (let column = building._posX + 1; column < building._posX + building._width - 1; column++)
                //     for (let row = building._posY + 1; row < building._posY + building._height - 1; row++) {
                //         this.buildingWeightGrid[column][row] = 99999;
                //         this.dropTroopGrid[column][row] = 0;
                //     }
                //update dropTroopGrid
            }
        }

        //update battle graph
        this._battleGraph = new BattleGraph(this.buildingWeightGrid, this.mapGrid);
        this._battleGraphWithoutWall = new BattleGraph(this.buildingWeightGridWithoutWall, this.mapGrid);
    },


    //add gameObject to list and to grid
    addBuilding: function (gameObject) {
        let id = gameObject._id;
        let typeBuildingPrefix = gameObject._type.substring(0, 3);

        this.listGameObjects.set(id, gameObject);

        if (typeBuildingPrefix !== GAMEOBJECT_PREFIX.OBSTACLE) {
            this.listBuildings.set(id, gameObject);
            if (typeBuildingPrefix !== GAMEOBJECT_PREFIX.WALL)
                this.totalBuildingPoint += gameObject._maxHp;
        }
        //update list storage, list mine, list builder hut
        switch (typeBuildingPrefix) {
            case GAMEOBJECT_PREFIX.TOWN_HALL:
                this.townHall = gameObject;
                break;
            case GAMEOBJECT_PREFIX.RESOURCE:
                this.listResources.push(gameObject);
                break;
            case GAMEOBJECT_PREFIX.STORAGE:
                this.listResources.push(gameObject);
                break;
            case GAMEOBJECT_PREFIX.WALL:
                this.listWalls.push(gameObject);
                break;
            case GAMEOBJECT_PREFIX.DEFENCE:
                this.listDefences.push(gameObject);
                break;
            case GAMEOBJECT_PREFIX.OBSTACLE:
                this.listObstacles.push(gameObject);
                break;
            default :
                break;

        }
    },

    onStartBattle: function () {
        this.battleStatus = BATTLE_STATUS.HAPPENNING;

        // LogUtils.writeLog("LIST INIT BUILDING")
        // for (let building of this.listBuildings.values()) {
        //     LogUtils.writeLog(([building._id, building._type, building._level, building._posX, building._posY, building._hp, building._resourceLeft].join('-')))
        // }
        // //log troop amount
        // LogUtils.writeLog("TROOP AMOUNT: " + JSON.stringify(Array.from(this.listTroops.entries())));
    },

    onEndBattle: function () {
        this.battleStatus = BATTLE_STATUS.END;
        LogUtils.writeLog("------------------------------------------ BATTLE ENDED ------------------------------------------");
        LogUtils.writeLog("LIST BUILDING");
        for (let building of this.listBuildings.values()) {
            LogUtils.writeLog(building.toString());

        }

        LogUtils.writeLog("LIST TROOP");
        for (let troop of this.listCurrentTroop) {
            LogUtils.writeLog(troop.toString());

        }

        LogUtils.writeLog("LIST BULLET");
        this.listBullets.map(e => {
            LogUtils.writeLog(e.toString());
        });

        LogUtils.writeLog("STAR: " + this.starAmount);
        LogUtils.writeLog("PERCENT : " + Math.floor(this.buildingDestroyedPoint * 100 / this.totalBuildingPoint))
        LogUtils.writeLog("RESOURCE GOT");
        LogUtils.writeLog("GOLD : " + this.robbedGold + " ELIXIR : " + this.robbedElixir);
        LogUtils.writeLog("TROOPS : ");
        this.listUsedTroop.forEach((value, key) => {
            LogUtils.writeLog("Key: " + key + ", Value: " + value);
        });


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
    getListTroopBullets: function () {
        return this.listTroopBullets;
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

    getDestroyedPercentage: function () {
        return Math.floor(this.buildingDestroyedPoint * 100 / this.totalBuildingPoint);
    },

    isOnReplayMode: function () {
        return this.onReplay;
    },

    isAllTroopsDead: function () {
        return this.totalDeadTroop >= this.totalTroop;
    },

    increaseStarAmount: function () {
        this.starAmount++;
        this.battleScene.battleUILayer.updateStarUI();
    },
    onTroopBulletDead: function (bullet) {
        for (let i = 0; i < this.listTroopBullets.length; i++) {
            if (this.listTroopBullets[i] === bullet) {
                this.listTroopBullets.splice(i, 1);
                break;
            }
        }
    },

    onDestroyBuilding: function (building) {
        if (!building._type.startsWith(GAMEOBJECT_PREFIX.WALL)) {
            this.buildingDestroyedPoint += building._maxHp;

            this.battleScene.battleUILayer.updateDestroyPercentage(Math.floor(this.buildingDestroyedPoint * 100 / this.totalBuildingPoint));

            if (!this.isDestroyedHalf && this.buildingDestroyedPoint * 2 >= this.totalBuildingPoint) {
                this.isDestroyedHalf = true;
                this.increaseStarAmount();
            }
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

        //update mapGrid
        for (var column = building._posX; column < building._posX + building._width; column++)
            for (var row = building._posY; row < building._posY + building._height; row++)
                this.mapGrid[column][row] = 0;

        //update buildingWeightGrid
        if (building._type.startsWith(GAMEOBJECT_PREFIX.WALL)) {
            for (let column = building._posX; column < building._posX + building._width; column++)
                for (let row = building._posY; row < building._posY + building._height; row++)
                    // this.buildingWeightGrid[column][row] = 0;
                    this._battleGraph.changeNodeWeight(column, row, 0)
        } else {
            for (let column = building._posX + 1; column < building._posX + building._width - 1; column++)
                for (let row = building._posY + 1; row < building._posY + building._height - 1; row++)
                    // this.buildingWeightGrid[column][row] = 0;
                    this._battleGraph.changeNodeWeight(column, row, 0)
        }
    },
    onTroopDead: function (troop) {
        //remove from list current troop
        for (let i = 0; i < this.listCurrentTroop.length; i++) {
            if (this.listCurrentTroop[i] === troop) {
                this.listCurrentTroop.splice(i, 1);
                break;
            }
        }
        this.totalDeadTroop++;

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
        return this.buildingWeightGrid;
    },
    getBattleGraph: function () {
        return this._battleGraph;
    },
    getBattleGraphWithoutWall: function () {
        return this._battleGraphWithoutWall;
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

    getOrCreateBullet: function (type, startPoint, target, damagePerShot, attackRadius, attackArea, initPos) {
        let newBullet = null;
        const listBullets = this.listBullets;
        for (let bullet of listBullets)
            if (!bullet.active && bullet._type === type) {
                bullet.init(startPoint, target, damagePerShot, initPos);
                return bullet;
            }
        if (type === BUILDING_TYPE.CANNON) {
            newBullet = new CannonBullet(type, startPoint, target, damagePerShot, attackRadius, attackArea, initPos);
        } else if (type === BUILDING_TYPE.ARCHER_TOWER) {
            newBullet = new ArcherTowerBullet(type, startPoint, target, damagePerShot, attackRadius, attackArea, initPos);
        } else if (type === BUILDING_TYPE.MORTAR) {
            newBullet = new MortarBullet(type, startPoint, target, damagePerShot, attackRadius, attackArea, initPos);
        } else if (type === BUILDING_TYPE.AIR_DEFENSE) {
            newBullet = new AirDefenseBullet(type, startPoint, target, damagePerShot, attackRadius, attackArea, initPos);
        }

        this.battleScene.battleLayer.addBullet(newBullet);
        this.listBullets.push(newBullet);

        return newBullet;
    },
    initTroopBullet: function (type, target, startPoint, damage) {
        let troopBullet = null;
        const listTroopBullets = this.listTroopBullets;
        for (let bullet of listTroopBullets)
            if (!bullet.active && bullet._type === type) {
                bullet.init(target, startPoint, damage);
                return bullet;
            }
        if (type === TROOP_TYPE.ARCHER) {
            troopBullet = new ArcherBullet(target, startPoint, damage);
        }
    },

    robResource: function (resource, type) {
        if (type === RESOURCE_TYPE.GOLD) {
            this.robbedGold += resource;
            this.battleScene.battleUILayer.setResourceLeft(this.availableGold - this.robbedGold, type);
            this.setPlayerResource({gold: this.playerResources.gold + resource});
        } else if (type === RESOURCE_TYPE.ELIXIR) {
            this.robbedElixir += resource;
            this.battleScene.battleUILayer.setResourceLeft(this.availableElixir - this.robbedElixir, type);
            this.setPlayerResource({elixir: this.playerResources.elixir + resource});
        }
    },

    addTroopBullet: function (bullet) {
        this.listTroopBullets.push(bullet);
    }

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
