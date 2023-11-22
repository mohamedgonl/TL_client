var ArmyCamp = Building.extend({
    _type: "AMC_1",
    ctor: function (level,id, posX, posY,status,startTime,endTime) {
        this._super(level,id, posX, posY,status,startTime,endTime);
        this.troopAmount = {};
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

    addTroop: function ({cfgId, count}) {
      if(this.troopAmount[cfgId].count) {
          this.troopAmount[cfgId] = count;
      }
      else {
          this.troopAmount[cfgId] += count;
      }
    },

    getCurrentSpace: function () {
        let currentSpace = 0;
        for (let key in this.troopAmount) {
            if (this.troopAmount.hasOwnProperty(key)) {
                const value = this.troopAmount[key];
                currentSpace += TROOP_BASE[key]["housingSpace"] * value;
            }
        }
        return currentSpace;
    },

    getMaxSpace: function () {
        return  AMC["AMC_1"][this._level]["capacity"];
    }


});