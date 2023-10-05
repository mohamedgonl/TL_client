var ArmyCamp = Building.extend({

    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);
        this.loadConfig(ConfigManager.Instance().getConfigArmyCamp(this.level));
        this.loadSprite(res_map.SPRITE.BODY.ARMY_CAMP[1],null,0);
        this.loadSubSprite();
        // this.init();
    },





});