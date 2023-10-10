LoadManager.Instance();

var MapManager = cc.Layer.extend({
    instance: null,
    listBuildings: new Map(),
    townHall: null,
    listStorage: [],
    listMine:[],
    listBuilderHut: [],
    //mapGrid is [][]
    mapGrid: [],
    gameScene : null,
    ctor: function () {

        this._super();

        //init map grid
        for(var i = 0; i < 40; i++){
            this.mapGrid[i] = [];
            for(var j = 0; j < 40; j++)
                this.mapGrid[i][j] = 0;
        }

    },

    //load from server
    //chua lam status
    loadFromServer: function (buildings){
        //cc.log("buildings",JSON.stringify(buildings,null,2));




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
            if(building == null)
            {
                cc.log("building null------------------------------------------",type);
                continue;
            }
            else
            {
                //cc.log("building Add------------------------------------------",type);
                this.addBuilding(building);
            }

        }

    },

    //add building to list and to grid
    addBuilding: function (building) {
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

        // add to list building {building._id: building}
        this.listBuildings.set(building._id, building);

        //update list storage, list mine, list builder hut
        var playerInfoManager = PlayerInfoManager.Instance();

        switch (typeBuilding.substring(0,3)){
            case 'TOW':
                this.townHall = building;
                let capacityGold = LoadManager.Instance().getConfig(typeBuilding,level,"capacityGold");
                let capacityElixir = LoadManager.Instance().getConfig(typeBuilding,level,"capacityElixir");
                playerInfoManager.changeMaxResource("gold",capacityGold);
                playerInfoManager.changeMaxResource("elixir",capacityElixir);
                break;
            case 'RES':
                this.listMine.push(building);
                break;
            case 'STO':
                this.listStorage.push(building);
                let capacityBuilding = LoadManager.Instance().getConfig(typeBuilding,level,"capacity");
                let typeResource = LoadManager.Instance().getConfig(typeBuilding,level,"type");
                playerInfoManager.changeMaxResource(typeResource,capacityBuilding);
                break;
            case 'BAR':
                //cc.log("hanve barrack+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                ArmyManager.Instance().pushBarrack(building);
                break;
            case 'AMC':
                ArmyManager.Instance().pushArmyCamp(building);
                break;
            case 'BDH':
                this.listBuilderHut.push(building);
                playerInfoManager.changeBuilder("current",1);
                playerInfoManager.changeBuilder("max",1);
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

    checkValidPutBuilding: function (building, newPosX, newPosY) {
        var id = building._id;
        var width = building._width;
        var height = building._height;


        //check out of map
        if(newPosX < 0 || newPosX + width > 40 || newPosY < 0 || newPosY + height > 40)
            return false;

        //check overlap
        for(var column = newPosX; column < newPosX + width; column++)
            for(var row = newPosY; row < newPosY + height; row++)
                if(this.mapGrid[column][row] != 0 && this.mapGrid[column][row] != id)
                    return false;

        return true;
    },

    getEmptyPositionPutBuilding: function (building) {
        let width = building._width;
        let height = building._height;
        cc.log("width: " + width + " height: " + height)

        //find empty rect to place building in mapGrid
        for(let column = 0; column < 40; column++)
            for(let row = 0; row < 40; row++)
                if(this.checkValidPutBuilding(building, column, row))
                    return {x: column, y: row};

        return null;
    },
    removeObstacle: function (obstacle){
        //remove from list
        this.listBuildings.delete(obstacle._id);
        //remove from mapGrid
        for(var column = obstacle._posX; column < obstacle._posX + obstacle._width; column++)
            for(var row = obstacle._posY; row < obstacle._posY + obstacle._height; row++)
                this.mapGrid[column][row] = 0;
    }


});


MapManager.Instance = function () {
    if (MapManager.instance == null) {
        MapManager.instance = new MapManager();
        MapManager.instance.retain();
    }
    return MapManager.instance;
}
