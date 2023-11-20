var ArmyCamp = Building.extend({
    _type: "AMC_1",
    ctor: function (level,id, posX, posY,status,startTime,endTime) {
        this._super(level,id, posX, posY,status,startTime,endTime);
        this._bodySprite = res_map.SPRITE.BODY.ARMY_CAMP[level];
        this._upperSprite = null;
        this._shadowType = 0;
        this._isUpperAnimate = false;
    },
    loadMainSpriteByLevel: function (level) {
        this.loadMainSprite(res_map.SPRITE.BODY.ARMY_CAMP[level], null, 0);
    },
    onAddIntoMapManager: function () {
        this._super();
        ArmyManager.getInstance().pushArmyCamp(this);
    },
    completeProcess: function () {
        this._super();
        ArmyManager.getInstance().updateArmyInfo();
    },


});