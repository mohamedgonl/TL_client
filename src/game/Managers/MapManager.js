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
    loadFromServer: function (buildings){

        for(var index in buildings){

            var construct = buildings[index];

            var id = construct.id;
            var type = construct.type;
            var posX =construct.posX;
            var posY =construct.posY;
            var level =construct.level;
            var building = getBuildingFromType(type,id, level, posX, posY);
            if(building == null) continue;

            this.addMapGrid(id,posX,posY,building._width,building._height);

            this.listBuildings.push(building);
            switch (type.substring(0,3)){
                case 'TOW':
                    this.townHall = building;
                    break;
                case 'RES':
                    this.listMine.push(building);
                    break;
                case 'STO':
                    this.listStorage.push(building);
                    break;
            }
        }
        //log map grid
        for(var i = 0; i < 40; i++){
            var str = "";
            for(var j = 0; j < 40; j++)
                str += this.mapGrid[i][j] + " ";
            cc.log(str);
        }

        // cc.log("listMine:",JSON.stringify(this.listMine, null, 2));
        // cc.log("listSTO:",JSON.stringify(this.listStorage, null, 2));
        // cc.log("townHall:",JSON.stringify(this.townHall, null, 2));
        cc.log("listBuildings:",JSON.stringify(this.listBuildings, null, 2));
        //sort list mine by level
    },

    //for 2d array map grid 0 0 to 39 39 add id to each grid
    addMapGrid: function (id,posX,posY,width,height) {
        for(var column = posX; column < posX + width; column++)
            for(var row = posY; row < posY + height; row++)
                this.mapGrid[column][row] = id;
    },
    changeMapGrid: function (id,newPosX,newPosY) {

        var width = this.getBuildingById(id)._width;
        var height = this.getBuildingById(id)._height;

        // for 40x40 o, o nao co id thi set bang 0
        for(var column = 0; column < 40; column++)
            for(var row = 0; row < 40; row++)
                if(this.mapGrid[column][row] == id)
                    this.mapGrid[column][row] = 0;



        //add grid vao vi tri moi
        this.addMapGrid(id,newPosX,newPosY,width,height);
    },
    changePositionBuilding: function (id,newPosX,newPosY) {

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
        cc.log("map grid ::::::")
        for(var i = 0; i < 40; i++){
            var str = "";
            for(var j = 0; j < 40; j++)
                str += this.mapGrid[i][j] + " ";
            cc.log(str);
        }

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
