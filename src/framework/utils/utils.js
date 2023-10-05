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
function getBuildingFromType(type, id, level, posX, posY) {
    var building = null;

    //obstacle
    if(type.substring(0,3) === 'OBS'){

        var typeOBS = type.substring(4);
        building = new Obstacle(typeOBS,id, posX, posY);
        building.setType(type);
        return building;
    }

    //building
    switch (type) {
        case 'TOW_1':
            building = new Townhall(level,id, posX, posY);
            break;
        case 'BDH_1':
            building = new BuilderHut(level,id, posX, posY);
            break;
        case 'AMC_1':
            building = new ArmyCamp(level,id, posX, posY);
            break;
        case 'RES_1':
            building = new GoldMine(level,id, posX, posY);
            break;
        case 'RES_2':
            building = new ElixirMine(level,id, posX, posY);
            break;
        case 'STO_1':
            building = new GoldStorage(level,id, posX, posY);
            break;
        case 'STO_2':
            building = new ElixirStorage(level,id, posX, posY);
            break;
        case 'BAR_1':
            building = new Barrack(level,id, posX, posY);
            break;
        case 'DEF_1':
            building = new Cannon(level,id, posX, posY);
            break;
        case 'WAL_1':
            building = new Wall(level,id, posX, posY);
            break;
    }

    building.setType(type);
    return building;
}


