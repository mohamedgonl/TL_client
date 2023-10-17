var RandomUltils = RandomUltils || {}

RandomUltils.createRandom = function (quantity_of_nums) {
    var milliseconds = new Date().getMilliseconds();
    return Math.floor(milliseconds * quantity_of_nums / 1000);
}