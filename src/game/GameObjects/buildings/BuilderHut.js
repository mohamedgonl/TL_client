var BuilderHut = Building.extend({
    _type: "BDH_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        // this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level],null,1)
        // this.loadSubSprite();

    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level],null,1);
    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.Instance();
        let playerInfoManager = PlayerInfoManager.Instance();
        mapManager.addToListBuilderHut(this);
        playerInfoManager.changeBuilder("max",1);
        playerInfoManager.changeBuilder("current",1);
    }
});
