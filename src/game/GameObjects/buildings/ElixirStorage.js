var ElixirStorage = BaseStorage.extend({
    _type: BUILDING_TYPE.ELIXIR_STORAGE,
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        this._upperSprite = null;
        this._shadowType = 1;
        this._isUpperAnimate = false;
    },
    //load sprite by level , type = 0, 1 , 2, 3 (0->25%,26->50%,51->75%,76->100%)
    loadMainSpriteByLevel: function (level,type =0) {
        this.loadMainSprite(res_map.SPRITE.BODY.ELIXIR_STORAGE.BOTTOM[level][type],null,1);
    },

    //update current amount and change sprite
    setCurrentAmount: function(value){
        this._currentElixir = value;
        this.updateSprite();
    },
    setCapacity: function (value) {
        this._capacityElixir = value;
        this.updateSprite();
    },
    updateSprite: function () {

        let type;
        let percent = this._currentElixir / this._capacityElixir;
        if(percent <= 0.25){
            type = 0;
        }
        else if(percent <= 0.5){
            type = 1;
        }
        else if(percent <= 0.75){
            type = 2;
        }
        else{
            type = 3;
        }
        // this.loadSpriteByLevel(this._level,type);
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
    getCapacityByLevel: function (level) {
        let configCapacity = LoadManager.getInstance().getConfig(this._type,level,"capacity");
        return {gold: 0, elixir: configCapacity};
    }

});