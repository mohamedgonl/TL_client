var BaseStorage = Building.extend({

    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);


        this._currentGold = 0;
        this._currentElixir = 0;

        //set capacity


        //if in build, capacity = 0

        if(level == 1 && status == 1)
        {
            this._capacityGold = 0;
            this._capacityElixir = 0;
        }
        else
        {
            let config = LoadManager.getInstance().getConfig(this._type,this._level);
            this.setCapacity(config.capacity);
        }





    },

    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.getInstance();
        let playerInfoManager = PlayerInfoManager.getInstance();

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
    onAddIntoMapLayer: function () {
        this._super();
        this.updateSprite();
        //listen event EVENT_NAMES.RESOURCE_CHANGED to update sprite
        cc.eventManager.addListener({
            event: cc.EventListener.CUSTOM,
            eventName: EVENT_NAMES.RESOURCE_CHANGED,
            callback: this.updateSprite.bind(this)
        }, this);

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
            gold: this._capacityGold||0,
            elixir: this._capacityElixir||0
        }
    },

    getCurrentAmount: function () {
        return {
            gold: this._currentGold||0,
            elixir: this._currentElixir||0
        }
    },

    completeProcess: function () {
        this._super();
        let playerInfoManager = PlayerInfoManager.getInstance();

        //before set new capacity
        let amountBefore = this.getCapacity();


        let configCapacity = LoadManager.getInstance().getConfig(this._type,this._level,"capacity");

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