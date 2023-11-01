var BattleBaseStorage = BattleBuilding.extend({

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        this._currentGold = 0;
        this._currentElixir = 0;

        //set capacity
        this._capacityGold = 0;
        this._capacityElixir = 0;
        let config = LoadManager.getInstance().getConfig(this._type, this._level);
        // this.setCapacity(config.capacity);

    },

    //get capacity , if building, return 0, if idle or upgrade, return capacity
    getCapacity: function () {
        if (this._state === 1) {
            return {
                gold: 0,
                elixir: 0
            }
        }
        return {
            gold: this._capacityGold,
            elixir: this._capacityElixir
        }
    },

    getCurrentAmount: function () {
        return {
            gold: this._currentGold,
            elixir: this._currentElixir
        }
    },

});