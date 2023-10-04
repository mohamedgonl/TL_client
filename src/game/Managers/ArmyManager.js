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
        cc.log(this._barrackList);
    },

    updateTotalSpace: function (space) {
        cc.log("UPDATE SPACE :::: ", space);
        this._totalSpace = space;
        let event = new cc.EventCustom(TRAINING_EVENTS.UPDATE_SPACE);
        event.data ={
            space: space
        };
        cc.eventManager.dispatchEvent(event);

    },

    getTotalSpace: function () {
        cc.log("GET TOTAL SPAC :::::", this._totalSpace)
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




