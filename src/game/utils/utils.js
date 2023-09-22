//find distance from A to line BC
function findDistanceFromPointToLine(posA, posB, posC) {
    const Ax = posA.x;
    const Ay = posA.y;
    const Bx = posB.x;
    const By = posB.y;
    const Cx = posC.x;
    const Cy = posC.y;

    const A = By - Cy;
    const B = Cx - Bx;
    const C = Bx * Cy - Cx * By;

    const numerator = Math.abs(A * Ax + B * Ay + C);
    const denominator = Math.sqrt(A * A + B * B);

    const distance = numerator / denominator;

    return distance;
}

//get intersect pos of 2 line AC and BD
function getIntersectPos(posA, posB, posC, posD) {
    const ABx = posB.x - posA.x;
    const ABy = posB.y - posA.y;
    const ACx = posC.x - posA.x;
    const ACy = posC.y - posA.y;
    const ADx = posD.x - posA.x;
    const ADy = posD.y - posA.y;

    const denominator = ABx * ADy - ABy * ADx;

    if (denominator === 0) {
        // Đường thẳng AC và BD là song song, không có giao điểm
        return null;
    }

    const t = (ACx * ADy - ACy * ADx) / denominator;
    const intersectX = posA.x + t * ABx;
    const intersectY = posA.y + t * ABy;

    return cc.v2(intersectX, intersectY);
}