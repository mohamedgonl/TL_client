var BaseStorage = Building.extend({

    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);


        this._currentGold = 0;
        this._currentElixir = 0;

        //set capacity
        this._capacityGold = 0;
        this._capacityElixir = 0;
        let config = LoadManager.Instance().getConfig(this._type,this._level);
        this.setCapacity(config.capacity);

        //listen event EVENT_NAMES.RESOURCE_CHANGED to update sprite
        cc.eventManager.addListener({
            event: cc.EventListener.CUSTOM,
            eventName: EVENT_NAMES.RESOURCE_CHANGED,
            callback: this.updateSprite.bind(this)
        }, this);

    },

    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.Instance();
        let playerInfoManager = PlayerInfoManager.Instance();

        mapManager.addToListStorage(this);

        //if idle or upgrade, add max resource, if build, not add
        switch (this._state){
            case 0:
            case 2:
                playerInfoManager.changeMaxResource({gold: this._capacityGold, elixir: this._capacityElixir});
                break;
            case 1:
                break;
        }
    },

    //get capacity , if building, return 0, if idle or upgrade, return capacity
    getCapacity: function () {

        if(this._state === 1){
            return{
                gold:0,
                elixir:0
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

    completeProcess: function () {
        this._super();
        let playerInfoManager = PlayerInfoManager.Instance();

        //before set new capacity
        let amountBefore = this.getCapacity();

        let configCapacity = LoadManager.Instance().getConfig(this._type,this._level,"capacity");

        this.setCapacity(configCapacity);

        let amountAfter = this.getCapacity();


        let amountIncrease = {
            gold: amountAfter.gold - amountBefore.gold,
            elixir: amountAfter.elixir - amountBefore.elixir
        }
        playerInfoManager.changeMaxResource(amountIncrease);
    },
    updateSprite: function () {

    }
});