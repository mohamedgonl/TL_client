var ElixirStorage = Building.extend({
    _upper: null,
    _type: "STO_2",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);


        // this.loadSprite(res_map.SPRITE.BODY.ELIXIR_STORAGE[level],null,1);
        // this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_STORAGE[level],null,1);
    },
    onAddIntoMapManager: function () {
        let mapManager = MapManager.Instance();
        let playerInfoManager = PlayerInfoManager.Instance();

        mapManager.addToListStorage(this);
        let capacity = LoadManager.Instance().getConfig(this._type,this._level,"capacity");
        playerInfoManager.changeMaxResource("elixir",capacity);
    }






});