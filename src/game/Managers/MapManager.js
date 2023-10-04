ConfigManager.Instance();

var MapManager = cc.Layer.extend({
    instance: null,
    listBuildings: [],
    townHall: null,
    listStorage: [],
    listMine:[],
    //mapGrid is [][]
    mapGrid: [],
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
        for(var index in buildings){

            var construct = buildings[index];

            var id = construct.id;
            var type = construct.type;
            var posX =construct.posX;
            var posY =construct.posY;
            var level =construct.level;

            var building = getBuildingFromType(type,id, level, posX, posY);
            if(building == null) continue;
            cc.log(building.getName()+" ____" +JSON.stringify(building, null, 2));
            this.addBuilding(building);
        }
    },

    //add building to list and to grid
    addBuilding: function (building) {
        //cc.log("building  ", JSON.stringify(building, null, 2));
        var posX = building._posX;
        var posY = building._posY;
        var id = building._id;
        var width = building._width;
        var height = building._height;


        for(var column = posX; column < posX + width; column++)
            for(var row = posY; row < posY + height; row++)
                this.mapGrid[column][row] = id;

        this.listBuildings.push(building);
        switch (building.getName()){
            case 'Townhall':
                this.townHall = building;
                break;
            case 'GoldMine'||'ElixirMine':
                this.listMine.push(building);
                break;
            case 'GoldStorage'||'ElixirStorage':
                this.listStorage.push(building);
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

    getTownHall: function () {
        return this.townHall;
    },
    getBuildingById: function (id) {
        for(var i = 0; i < this.listBuildings.length; i++)
            if(this.listBuildings[i]._id == id)
                return this.listBuildings[i];
        return null;
    },

    checkValidMoveBuilding: function (building,newPosX, newPosY) {
        var id = building._id;
        var width = building._width;
        var height = building._height;

        //check out of map
        // if(newPosX < 0 || newPosX + width > 40 || newPosY < 0 || newPosY + height > 40)
        //     return false;

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
        cc.log("list building ::::::")
        for(var i = 0; i < this.listBuildings.length; i++){
            cc.log(JSON.stringify(this.listBuildings[i], null, 2));
        }

    }


});


MapManager.Instance = function () {
    if (MapManager.instance == null) {
        MapManager.instance = new MapManager();
        MapManager.instance.retain();
    }
    return MapManager.instance;
}
