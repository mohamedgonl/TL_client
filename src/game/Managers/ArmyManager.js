var ArmyManager = cc.Class.extend({
    instance: null,
    _barrackList: [],
    _armyCampList: [],
    _armyAmount: {},
    _totalSpace: 0,

    ctor: function () {
        this.init();
    },
    init: function () {

    },

    pushBarrack: function (barack) {
        this._barrackList.push(barack);
    },

    updateTotalSpace: function (space) {
        this._totalSpace = space;
        let event = new cc.EventCustom(TRAINING_EVENTS.UPDATE_SPACE);
        event.data ={
            space: space
        };
        cc.eventManager.dispatchEvent(event);

    },

    getTotalSpace: function () {
        return this._totalSpace;
    },

    getBarrackList: function () {
        return this._barrackList;
    },

    getTroopCount : function () {

    },



})
ArmyManager.Instance = function () {
    if (ArmyManager.instance == null) {
        ArmyManager.instance = new ArmyManager();
    }
    return ArmyManager.instance;
}




