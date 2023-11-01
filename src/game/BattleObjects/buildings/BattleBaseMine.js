// const OFFSET_HARVEST = 1;
var BattleBaseMine = BattleBuilding.extend({
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        this._capacityGold = 0;
        this._capacityElixir = 0;
        this._currentGold = 0;
        this._currentElixir = 0;
    },

});