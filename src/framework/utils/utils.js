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
    return distance;

}

function changeTypeBuildingToBuilding(type) {
    if (type.substring(0, 3) === 'OBS') {
        return type;
    }
    switch (type) {
        case 'TOW_1':
            return 'Townhall';
        case 'BDH_1':
            return 'BuilderHut';
        case 'AMC_1':
            return 'ArmyCamp';
        case 'RES_1':
            return 'GoldMine';
        case 'RES_2':
            return 'ElixirMine';
    }
    return null;
}