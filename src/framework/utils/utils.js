//find distance from A to line BC
function findDistanceFromPointToLine(posA, posB, posC) {
    // const Ax = posA.x;
    // const Ay = posA.y;
    // const Bx = posB.x;
    // const By = posB.y;
    // const Cx = posC.x;
    // const Cy = posC.y;
    //
    // const A = By - Cy;
    // const B = Cx - Bx;
    // const C = Bx * Cy - Cx * By;
    //
    // const numerator = Math.abs(A * Ax + B * Ay + C);
    // const denominator = Math.sqrt(A * A + B * B);
    //
    // const distance = numerator / denominator;
    //
    // return distance;

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

}


//return new building from type
//getBuildingFromType(data.type, 1, data.id, data.posX, data.posY,data.status,data.startTime,data.endTime);
function getBuildingFromType(type, level, id, posX, posY,status,startTime,endTime) {
    var building = null;
    //log all param
    // cc.log("type: " + type + " level: " + level +
    //     " posX: " + posX + " posY: " + posY + " id: " + id +
    //     " status: " + status + " startTime: " + startTime + " endTime: " + endTime);


    //obstacle
    if(type.substring(0,3) === 'OBS'){

        var typeOBS = type.substring(4);
        building = new Obstacle(type,id, posX, posY,status,startTime,endTime);
        return building;
    }

    //building
    switch (type) {
        case 'TOW_1':
            building = new Townhall( level,id, posX, posY,status,startTime,endTime);
            break;
        case 'BDH_1':
            building = new BuilderHut( level,id, posX, posY,status,startTime,endTime);
            break;
        case 'AMC_1':
            building = new ArmyCamp( level,id, posX, posY, status, startTime,endTime);
            break;
        case 'RES_1':
            building = new GoldMine( level,id, posX, posY, status, startTime,endTime);
            break;
        case 'RES_2':
            building = new ElixirMine( level,id, posX, posY, status, startTime,endTime);
            break;
        case 'STO_1':
            building = new GoldStorage( level,id, posX, posY, status, startTime,endTime);
            break;
        case 'STO_2':
            building = new ElixirStorage( level,id, posX, posY, status, startTime,endTime);
            break;
        case 'BAR_1':
            building = new Barrack(level,id, posX, posY, status, startTime,endTime);
            break;
        case 'DEF_1':
            building = new Cannon( level,id, posX, posY, status, startTime,endTime);
            break;
        case 'WAL_1':
            building = new Wall( level,id, posX, posY, status, startTime,endTime);
            break;
        case 'CLC_1':
            building = new ClanCastle( level,id, posX, posY, status, startTime,endTime);
    }
    building.setType(type);
    return building;
}

// Hàm trợ giúp để tạo và cấu hình button
function createButton(imagePath, scale, position, callback, target) {
    var button = new ccui.Button(imagePath);
    button.setScale(scale);
    button.setPosition(position);
    button.addClickEventListener(callback.bind(target));
    return button;
}

//have time in ms, return string time format 3d2m or 2m3s or 12s , max 2 unit
function getTimeString(time) {
    var timeString = "";
    var day = Math.floor(time / (24 * 3600)  );
    var hour = Math.floor(time / 3600) % 24;
    var minute = Math.floor(time / 60 ) % 60;
    var second = Math.floor(time )% 60;

    if (day > 0) {
        timeString += day + "d";
        if (hour > 0) {
            timeString += hour + "h";
        }
    }
    else if (hour > 0) {
        timeString += hour + "h";
        if (minute > 0) {
            timeString += minute + "m";
        }
    }
    else if (minute > 0) {
        timeString += minute + "m";
        if (second > 0) {
            timeString += second + "s";
        }
    }
    else if (second > 0) {
        timeString += second + "s";
    }
    return timeString;
}


