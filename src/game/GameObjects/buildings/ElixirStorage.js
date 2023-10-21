var ElixirStorage = BaseStorage.extend({
    _type: "STO_2",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
    },
    //load sprite by level , type = 0, 1 , 2, 3 (0->25%,26->50%,51->75%,76->100%)
    loadSpriteByLevel: function (level,type =0) {
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_STORAGE[level][type],null,1);
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
        this.loadSpriteByLevel(this._level,type);
    }

});