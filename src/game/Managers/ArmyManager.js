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

    updateArmyAmount: function (troops) {
        troops.map(e => {
            if(!this._armyAmount[e.cfgId]) {
                this._armyAmount[e.cfgId] = e.count;
            }
            else {
                this._armyAmount[e.cfgId] += e.count;
            }
            this._currentSpace += TROOP_BASE[e.cfgId]["housingSpace"] * e.count;
        });


    }



})
ArmyManager.Instance = function () {
    if (ArmyManager.instance == null) {
        ArmyManager.instance = new ArmyManager();
    }
    return ArmyManager.instance;
}




