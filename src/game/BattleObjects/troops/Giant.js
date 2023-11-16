var Giant = BaseTroop.extend({
    ctor: function (posX,posY) {
        this._type = "ARM_4";
            this._super(posX,posY);
    },
    toString: function () {
        this._super(this._type)
    }

})