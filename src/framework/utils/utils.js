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