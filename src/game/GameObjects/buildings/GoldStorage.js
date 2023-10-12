var GoldStorage = Building.extend({
    _upper: null,
    _type: "STO_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);


        // this.loadSprite(res_map.SPRITE.BODY.GOLD_STORAGE[level],null,1);
        // this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.GOLD_STORAGE[level],null,1);
    },
    loadButton: function () {
        this._super();
        let infoLayer = cc.director.getRunningScene().infoLayer;
        infoLayer.addButtonToMenu("Nâng cấp",res.BUTTON.UPGRADE_BUTTON,0,this.onClickUpgrade.bind(this));
    },
    onAddIntoMapManager: function () {
        let mapManager = MapManager.Instance();
        let playerInfoManager = PlayerInfoManager.Instance();

        mapManager.addToListStorage(this);
        let capacity = LoadManager.Instance().getConfig(this._type,this._level,"capacity");
        playerInfoManager.changeMaxResource("gold",capacity);
    }






});