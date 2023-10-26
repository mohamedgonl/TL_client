// const OFFSET_HARVEST = 1;
var BattleBaseMine = BattleBuilding.extend({
    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        this._capacityGold = 0;
        this._capacityElixir = 0;
        this._currentGold = 0;
        this._currentElixir = 0;
    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.getInstance();
        mapManager.addToListMine(this);
    },
    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation) {
        this._super(bodySprite, upperSprite, shadow_type, isUpperAnimation);

        // this._iconHarvest have bg, and bg.icon is sprite of harvest icon
        let node = CCSUlties.parseUIFile(res_ui.ICON_HARVEST);

        this._iconHarvest = node;
        this.addChild(this._iconHarvest, ZORDER_BUILDING_EFFECT);
        this._iconHarvest.setVisible(false);
    },

});