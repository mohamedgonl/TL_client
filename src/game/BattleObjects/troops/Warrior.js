var Warrior = BattleTroop.extend({
    ctor: function (posX,posY) {
        this._type = "ARM_1",
        this._super(posX,posY);
    },
    toString: function () {
        this._super(this._type)
    }

})