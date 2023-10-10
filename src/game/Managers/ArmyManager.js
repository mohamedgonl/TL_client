var ArmyManager = cc.Class.extend({
    instance: null,
    _barrackList: [],
    _armyCampList: [],
    _armyAmount: {},
    _maxTotalSpace: 0,
    _currentSpace:0,

    ctor: function () {
        this.init();
    },
    init: function () {

    },

    pushBarrack: function (barack) {
        this._barrackList.push(barack);
    },

    getArmyCampList: function () {
      return this._armyCampList;
    },

    pushArmyCamp: function (armyCamp) {
        this._armyCampList.push(armyCamp);
        this._maxTotalSpace += AMC["AMC_1"][armyCamp.level]["capacity"];
    },

    updateMaxTotalSpace: function (space) {
        this._maxTotalSpace = space;
        let event = new cc.EventCustom(TRAINING_EVENTS.UPDATE_SPACE);
        event.data ={
            space: space
        };
        cc.eventManager.dispatchEvent(event);

    },

    getCurrentSpace:  function () {
        return this._currentSpace;
    },

    getMaxSpace  :function () {
        return this._maxTotalSpace;
    },


    getTotalSpace: function () {
        return this._totalSpace;
    },

    getBarrackList: function () {
        return this._barrackList;
    },

    getTroopCount : function () {

    },

    updateArmyAmount: function (troops, curPage) {
        cc.log("DÂT EM NE ANH "+ JSON.stringify(troops) +" "+curPage)
        troops.map(e => {
            if(!this._armyAmount[e.cfgId]) {
                this._armyAmount[e.cfgId] = e.count;
            }
            else {
                this._armyAmount[e.cfgId] += e.count;
            }
            this._currentSpace += TROOP_BASE[e.cfgId]["housingSpace"] * e.count;

            // create troop sprite run to army camp
            let event = new cc.EventCustom(TRAINING_EVENTS.CREATE_TROOP_ON_MAP);

            let armyCampIndex;
            if(this._armyCampList.length === 1) {
                armyCampIndex = 0;
            }
            else {
                armyCampIndex = this._armyAmount[e.cfgId] % (this._armyCampList.length) - 1;
            }

            event.data = {barrackIndex: curPage, cfgId: e.cfgId, count: e.count, armyCampIndex: armyCampIndex};
            cc.log("BẮN  EVENT " +JSON.stringify(event.data))

            cc.eventManager.dispatchEvent(event);
        });


    },

    createTroopOnMap : function (barrack, armyCamp, troopCfgId) {

    }



})
ArmyManager.Instance = function () {
    if (ArmyManager.instance == null) {
        ArmyManager.instance = new ArmyManager();
    }
    return ArmyManager.instance;
}




