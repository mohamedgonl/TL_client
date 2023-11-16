var Thief = BattleTroop.extend({
    ctor: function (posX, posY) {
        this._type = "ARM_3";
        this._super(posX, posY);
    },
    toString: function () {
        this._super(this._type)
    }

})