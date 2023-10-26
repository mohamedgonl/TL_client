
var MapManager = cc.Class.extend({

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
        for(var i = 0; i < 40; i++){
            this.mapGrid[i] = [];
            for(var j = 0; j < 40; j++)
                this.mapGrid[i][j] = 0;
        }

    },

    //load from server to addBuildingToGameManager
    loadFromServer: function (buildings){
        for(let index in buildings){

            let construct = buildings[index];
            let id = construct.id;
            let type = construct.type;
            let posX =construct.posX;
            let posY =construct.posY;
            let level =construct.level;
            let status = construct.status;
            let startTime = construct.startTime;
            let endTime = construct.endTime;

            let building = getBuildingFromType(type, level,id, posX, posY,status,startTime,endTime);

            if(type.startsWith("RES"))
            {
                let lastCollectTime = construct.lastCollectTime;

            }


            if(building == null)
            {
                cc.log("building null------------------------------------------",type);
                continue;
            }
            else
            {
                this.addBuilding(building);

            }
        }

        const Algorithm = AlgorithmImplement.Instance();
        Algorithm.setGridMapStar(MapManager.Instance().mapGrid);
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
    addBuilding: function (building, isBuy = false) {
        // cc.log("building  ", JSON.stringify(building, null, 2));
        let posX = building._posX;
        let posY = building._posY;
        let id = building._id;
        let width = building._width;
        let height = building._height;
        let level = building._level;
        let typeBuilding = building._type;

        for(let column = posX; column < posX + width; column++)
            for(let row = posY; row < posY + height; row++)
                this.mapGrid[column][row] = id;

        building.onAddIntoMapManager();

        // add to list building {building._id: building}
        this.listBuildings.set(id,building);


        //update list storage, list mine, list builder hut


        switch (typeBuilding.substring(0,3)){
            case 'TOW':


                break;
            case 'RES':
                break;
            case 'STO':

                break;
            case 'BAR':
                ArmyManager.Instance().pushBarrack(building);
                break;
            case 'AMC':
                ArmyManager.Instance().pushArmyCamp(building);
                break;
            case 'BDH':
                break;
            default : break;

        }
        if(isBuy === true) {
            const Algorithm = AlgorithmImplement.Instance();
            Algorithm.setGridMapStar(MapManager.Instance().mapGrid);
            // cc.eventManager.dispatchCustomEvent(EVENT_NAMES.NEW_BUILDING_ADDED, {type: typeBuilding});

        }

    },
    moveBuilding: function (building,newPosX,newPosY) {

        var width = building._width;
        var height = building._height;
        // dat lai nhung o cu = 0
        for(var column = building._posX; column < building._posX + width; column++)
            for(var row = building._posY; row < building._posY + height; row++)
                this.mapGrid[column][row] = 0;

        //dat lai nhung o moi = id
        for(var column = newPosX; column < newPosX + width; column++)
            for(var row = newPosY; row < newPosY + height; row++)
                this.mapGrid[column][row] = building._id;

        //dat lai vi tri cua building va updateUI
        building._posX = newPosX;
        building._posY = newPosY;

        cc.eventManager.dispatchCustomEvent(EVENT_TROOP_NAME.MOVE_BUILDING, {buildingId: building.getId()});
        const Algorithm = AlgorithmImplement.Instance();
        Algorithm.setGridMapStar(MapManager.Instance().mapGrid);
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
    getBuildingByGrid: function (x,y) {
        //if x y null, return null
        if(x === null || y === null)
            return null;
        return this.listBuildings.get(this.mapGrid[x][y]) || null;
    },
    getListBuilderHut: function () {
        return this.listBuilderHut;
    },

    //listStorage included townhall, gold storage, elixir storage
    getListStorage: function () {
        return this.listStorage;
    },


    removeBuilding: function (building){
        // remove from building count
        this.buildingAmount[building._type] = Math.max(this.buildingAmount[building._type] - 1, 0) ;
        //remove from list
        this.listBuildings.delete(building._id);
        //remove from mapGrid
        for(var column = building._posX; column < building._posX + building._width; column++)
            for(var row = building._posY; row < building._posY + building._height; row++)
                this.mapGrid[column][row] = 0;


    },

    getBuildingCountByType:  function (type) {
        if(this.buildingAmount[type] === undefined) return 0;
        else {
            return this.buildingAmount[type];
        }
    },
    callBuilderToBuilding: function (building,state = "init") {
        let builder = new Builder(state,building);
        let mapLayer = cc.director.getRunningScene().mapLayer;
        mapLayer.addChild(builder,MAP_ZORDER_TROOP);
    },

    onFindMatch: function (){
        const loadingView = new Loading(Loading.START);
        this.gameScene.addChild(loadingView);
        loadingView.startLoading(function () {
            cc.director.runScene(new BattleScene());
            testnetwork.connector.sendFindMatch();
        })
    }
});


MapManager.Instance = function () {
    if (MapManager.instance == null) {
        MapManager.instance = new MapManager();
    }
    return MapManager.instance;
}
