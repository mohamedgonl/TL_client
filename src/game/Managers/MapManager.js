ConfigManager.Instance();

var MapManager = cc.Layer.extend({
    instance: null,
    listBuildings: new Map(),
    townHall: null,
    listStorage: [],
    listMine:[],
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

        //this.init();
    },

    init: function () {

        this.setScale(ZOOM_DEFAULT);
        this.addEvent();
        this.initBackground();
    },

    //load from server
    //chua lam status
    loadFromServer: function (buildings){
        //cc.log("load from server:", JSON.stringify(buildings, null, 2));
        for(let index in buildings){

            let construct = buildings[index];
            let id = construct.id;
            let type = construct.type;
            let posX =construct.posX;
            let posY =construct.posY;
            let level =construct.level;

            let building = getBuildingFromType(type,id, level, posX, posY);
            if(building == null) continue;
            this.addBuilding(building);
        }

    },

    //add building to list and to grid
    addBuilding: function (building) {
        //cc.log("building  ", JSON.stringify(building, null, 2));
        let posX = building._posX;
        let posY = building._posY;
        let id = building._id;
        let width = building._width;
        let height = building._height;

        for(let column = posX; column < posX + width; column++)
            for(let row = posY; row < posY + height; row++)
                this.mapGrid[column][row] = id;

        // add to list building {building._id: building}
        this.listBuildings.set(building._id, building);



        switch (building.getType().substring(0,3)){
            case 'TOW':
                this.townHall = building;
                break;
            case 'GoldMine':
            case 'ElixirMine':
                this.listMine.push(building);
                break;
            case 'GoldStorage':
            case 'ElixirStorage':
                this.listStorage.push(building);
                break;
            case 'BAR':
                ArmyManager.Instance().pushBarrack(building);
                break;
            case 'ArmyCamp':
                let currentSpace = ArmyManager.Instance().getTotalSpace();
                ArmyManager.Instance().updateTotalSpace(currentSpace + AMC["AMC_1"][building.level]["capacity"]);
                break;
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


    checkValidMoveBuilding: function (building,newPosX, newPosY) {
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

    addEvent: function () {

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (event) {
                this.touch(event);
                return true;
            }.bind(this),

            onTouchEnded: function (event) {
                return true;
            },

            onTouchMoved: function (event) {
                this.moveView(event.getDelta());
                return true;
            }.bind(this)

        }, this);

        //scale by scroll
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,

            onMouseScroll: this.zoom.bind(this)
        }, this);

        //click space to check
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode) {
                if(keyCode == cc.KEY.space)
                {
                    this.test();
                }

            }.bind(this)

        },this);
    },

    test: function (){
        //log map grid
        // cc.log("map grid ::::::")
        // for(var i = 0; i < 40; i++){
        //     var str = "";
        //     for(var j = 0; j < 40; j++)
        //         str += this.mapGrid[i][j] + " ";
        //     cc.log(str);
        // }


        //log list building
        this.listBuildings.forEach(function (building) {
            cc.log(JSON.stringify(building, null, 2));
        });

    }


});


MapManager.Instance = function () {
    if (MapManager.instance == null) {
        MapManager.instance = new MapManager();
        MapManager.instance.retain();
    }
    return MapManager.instance;
}
