var BuilderHut = Building.extend({
    _type: "BDH_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        this._bodySprite = res_map.SPRITE.BODY.BUILDER_HUT[level];
        this._upperSprite = null;
        this._shadowType = 1;
        this._isUpperAnimate = false;

    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level],null,1);
    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.getInstance();
        let playerInfoManager = PlayerInfoManager.getInstance();
        mapManager.addToListBuilderHut(this);
        playerInfoManager.changeBuilder("max",1);
        playerInfoManager.changeBuilder("current",1);
    }
});
