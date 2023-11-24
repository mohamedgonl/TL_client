//return new building from type
//getBuildingFromType(data.type, 1, data.id, data.posX, data.posY,data.status,data.startTime,data.endTime);
function getBuildingFromType(type, level, id, posX, posY, status, startTime, endTime) {
    cc.log("GET BUILDING FROM TYPE :: " + type)
    var building = null;

    //obstacle
    if (type.substring(0, 3) === GAMEOBJECT_PREFIX.OBSTACLE) {

        building = new Obstacle(type, id, posX, posY, status, startTime, endTime);
        building.retain();
        return building;
    }

    //building
    switch (type) {
        case BUILDING_TYPE.TOWN_HALL:
            building = new Townhall(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.BUILDER_HUT:
            building = new BuilderHut(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.ARMY_CAMP:
            building = new ArmyCamp(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.GOLD_MINE:
            building = new GoldMine(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.ELIXIR_MINE:
            building = new ElixirMine(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.GOLD_STORAGE:
            building = new GoldStorage(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.ELIXIR_STORAGE:
            building = new ElixirStorage(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.BARRACK:
            building = new Barrack(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.CANNON:
            building = new Cannon(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.WALL:
            building = new Wall(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.ARCHER_TOWER:
            building = new ArcherTower(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.MORTAR:
            building = new Mortar(level, id, posX, posY, status, startTime, endTime);
            break;
        case BUILDING_TYPE.AIR_DEFENSE:
            building = new AirDefense(level, id, posX, posY, status, startTime, endTime);
            break;
        default:
            cc.log("getBuildingFromType: not found type: " + type);
            break;

    }
    // building.setType(type);
    if (building) building.retain();
    return building;
}

function getBattleBuildingFromType(type, level, id, posX, posY) {
    var building = null;

    if (type.substring(0, 3) === GAMEOBJECT_PREFIX.OBSTACLE) {
        var typeOBS = type.substring(4);
        building = new BattleObstacle(type, id, posX, posY);
        return building;
    }

    switch (type) {
        case BUILDING_TYPE.TOWN_HALL:
            building = new BattleTownhall(level, id, posX, posY);
            break;
        case BUILDING_TYPE.BUILDER_HUT:
            building = new BattleBuilderHut(level, id, posX, posY);
            break;
        case BUILDING_TYPE.ARMY_CAMP:
            building = new BattleArmyCamp(level, id, posX, posY);
            break;
        case BUILDING_TYPE.GOLD_MINE:
            building = new BattleGoldMine(level, id, posX, posY);
            break;
        case BUILDING_TYPE.ELIXIR_MINE:
            building = new BattleElixirMine(level, id, posX, posY);
            break;
        case BUILDING_TYPE.GOLD_STORAGE:
            building = new BattleGoldStorage(level, id, posX, posY);
            break;
        case BUILDING_TYPE.ELIXIR_STORAGE:
            building = new BattleElixirStorage(level, id, posX, posY);
            break;
        case BUILDING_TYPE.BARRACK:
            building = new BattleBarrack(level, id, posX, posY);
            break;
        case BUILDING_TYPE.CANNON:
            building = new BattleCannon(level, id, posX, posY);
            break;
        case BUILDING_TYPE.ARCHER_TOWER:
            building = new BattleArcherTower(level, id, posX, posY);
            break;
        case BUILDING_TYPE.MORTAR:
            building = new BattleMortar(level, id, posX, posY);
            break;
        case BUILDING_TYPE.AIR_DEFENSE:
            building = new BattleAirDefense(level, id, posX, posY);
            break;
        case BUILDING_TYPE.WALL:
            building = new BattleWall(level, id, posX, posY);
            break;
    }

    if (building)
        building.setType(type);
    return building;
}

var Utils = {
    //add , to number every 3 digits
    numberToText: function (number) {
        if (number === 0)
            return "0";

        let text = "";
        let count = 0;
        while (number > 0) {
            let temp = number % 10;
            text = temp + text;
            number = Math.floor(number / 10);
            count++;
            if (count % 3 === 0 && number > 0) {
                text = "," + text;
            }
        }
        return text;
    },
    //have time in ms, return string time format 3d2m or 2m3s or 12s , max 2 unit
    getTimeString: function (time) {
        var timeString = "";
        var day = Math.floor(time / (24 * 3600));
        var hour = Math.floor(time / 3600) % 24;
        var minute = Math.floor(time / 60) % 60;
        var second = Math.floor(time) % 60;

        if (day > 0) {
            timeString += day + "d";
            if (hour > 0) {
                timeString += hour + "h";
            }
        } else if (hour > 0) {
            timeString += hour + "h";
            if (minute > 0) {
                timeString += minute + "m";
            }
        } else if (minute > 0) {
            timeString += minute + "m";
            if (second > 0) {
                timeString += second + "s";
            }
        } else if (second > 0) {
            timeString += second + "s";
        }
        return timeString;
    },
    //find distance from A to line BC
    findDistanceFromPointToLine: function (posA, posB, posC) {
        //vector CA
        var CA = cc.pSub(posA, posC);
        //vector CB
        var CB = cc.pSub(posB, posC);
        //project of CA on CB
        var project = cc.pProject(CA, CB);

        //distance from A to line BC
        var distance = cc.pDistance(CA, project);

        //if A is on the left of BC
        //cc.log("cross: " + cc.pCross(CA, CB));
        if (cc.pCross(CA, CB) > 0) {
            distance = -distance;
        }
        return distance;

    },
    // Hàm trợ giúp để tạo và cấu hình button
    createButton: function (imagePath, scale, position, callback, target) {
        var button = new ccui.Button(imagePath);
        button.setScale(scale);
        button.setPosition(position);
        button.addClickEventListener(callback.bind(target));
        return button;
    },
    calculateGBuyRes: function (gold, elixir) {
        return Math.ceil(gold / G_BUY_GOLD) + Math.ceil(elixir / G_BUY_ELIXIR);
    },
    calculateGBuyTime: function (time) {
        //G BUY SECOND = 900
        return Math.ceil(time / G_BUY_SECOND);
    },
    roundFloat: function (val, n) {
        let tmp = 1;
        for (let i = 0; i < n; i++) {
            tmp *= 10;
        }
        return Math.round(val * tmp) / tmp;
    }
}
var GameUtilities = {
    updateCurrentCapacityAllBuilding: function () {
        let listStorage = MapManager.getInstance().getListStorage();
        let townhall = MapManager.getInstance().getTownHall();
        let goldCurrent = PlayerInfoManager.getInstance().getResource("gold")
        let elixirCurrent = PlayerInfoManager.getInstance().getResource("elixir")
        let listGoldStorage = [];
        let listElixirStorage = [];

        for (let i = 0; i < listStorage.length; i++) {
            if (listStorage[i]._capacityGold) {
                listGoldStorage.push(listStorage[i]);
            }
            if (listStorage[i]._capacityElixir) {
                listElixirStorage.push(listStorage[i]);
            }
        }
        //add townhall to list

        //update gold storage
        let length = listGoldStorage.length;
        for (let i = 0; i < length; i++) {
            let storage = listGoldStorage[i];
            let capacity = storage._capacityGold;
            if (goldCurrent / (length - i) > capacity) {
                storage.setCurrentAmount(capacity, "gold");
                goldCurrent -= capacity;

            } else {
                let newAmount = Math.floor(goldCurrent / (length - i));
                console.log("newAmount:-------------------- " + newAmount + " " + storage._id);
                storage.setCurrentAmount(newAmount, "gold");
                goldCurrent -= newAmount;
            }
        }


        //update elixir storage
        length = listElixirStorage.length;
        for (let i = 0; i < length; i++) {
            let storage = listElixirStorage[i];
            let capacity = storage._capacityElixir;
            if (elixirCurrent / (length - i) > capacity) {
                storage.setCurrentAmount(capacity, "elixir");
                elixirCurrent -= capacity;
            } else {
                let newAmount = Math.floor(elixirCurrent / (length - i));
                storage.setCurrentAmount(newAmount, "elixir");
                elixirCurrent -= newAmount;
            }
        }

    },
    loadResource: function () {
        //DEF_2
        //shadow
        for (let i = 1; i <= MAXLEVEL.DEF_2; i++) {
            DEF_2[i] = {};
            DEF_2[i].shadow = "res/Buildings/defense_base/DEF_2_" + i + "_Shadow.png";
        }
        //archer_idle
        for (let i = 1; i <= MAXLEVEL.DEF_2; i++) {
            DEF_2[i].archer_idle = [];
            for (let j = 0; j <= 5; j++) {
                DEF_2[i].archer_idle.push("res/Buildings/AcherTower/DEF_2_" + i + "/DEF_2_" + i + "/idle/image000" + j + ".png");
            }
        }

        //DEF_1
        //shadow
        for (let i = 1; i <= MAXLEVEL.DEF_1; i++) {
            DEF_1[i].shadow = "res/Buildings/defense_base/DEF_1_" + i + "_Shadow.png";
        }
    }
}
DEF_1 = {};
DEF_2 = {};
MAXLEVEL = {
    DEF_1: 9,
    DEF_2: 9,
}



