var ArmyCamp = Building.extend({
    _width: null,
    _height: null,
    ctor: function (level, posX, posY) {
        this._super(level, posX, posY);
        this.loadConfig(ConfigManager.Instance().getConfigArmyCamp(this.level));
        this._width = 3;
        this._height = 3;
        this.loadSprite(res_map.SPRITE.BODY.ARMY_CAMP[1], null, 0);
        cc.log("ArmyCamp ctor--------------------------------------------------------------------------------------")
    },


});