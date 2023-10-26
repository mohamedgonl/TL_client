var Townhall = BaseStorage.extend({
    _type: "TOW_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        let config = LoadManager.getInstance().getConfig(this._type,this._level);
        this._currentGold = 0;
        this._currentElixir = 0;
        this._capacityGold = config.capacityGold;
        this._capacityElixir = config.capacityElixir;

        this._bodySprite = res_map.SPRITE.BODY.TOWNHALL[level];
        this._upperSprite = null;
        this._shadowType = 1;
        this._isUpperAnimate = false;
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.TOWNHALL[level],null,1);
    },

    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.getInstance();
        mapManager.townHall = this;
    },


    completeProcess: function () {
        this._super();
        let playerInfoManager = PlayerInfoManager.getInstance();

        //before set new capacity
        let amountBefore = this.getCapacity();

        let configCapacityGold = LoadManager.getInstance().getConfig(this._type,this._level,"capacityGold");
        let configCapacityElixir = LoadManager.getInstance().getConfig(this._type,this._level,"capacityElixir");

        this.setCapacity({gold: configCapacityGold, elixir: configCapacityElixir});

        let amountAfter = this.getCapacity();


        let amountIncrease = {
            gold: amountAfter.gold - amountBefore.gold,
            elixir: amountAfter.elixir - amountBefore.elixir
        }
        playerInfoManager.changeMaxResource(amountIncrease);
    },
    setCapacity: function({gold,elixir}){
        this._capacityGold = gold;
        this._capacityElixir = elixir;
    },
    setCurrentAmount: function(value,type){
        if(type === "gold"){
            this._currentGold = value;
        }
        else if(type === "elixir"){
            this._currentElixir = value;
        }
    }
});


