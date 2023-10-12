var ArmyManager = cc.Class.extend({
    instance: null,
    _barrackList: [],
    _armyCampList: [],
    _armyAmount: {},
    _maxTotalSpace: 0,
    _currentSpace: 0,

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
        this._maxTotalSpace += AMC["AMC_1"][armyCamp._level]["capacity"];
    },

    setArmyAmount: function (armyAmount) {
        this._armyAmount = armyAmount;
    },

    initTroopSprites: function () {
        let troops = [];

        for (let key in this._armyAmount) {
            if (this._armyAmount.hasOwnProperty(key)) {
                const value = this._armyAmount[key];
                let troop = {cfgId: key, count: value};
                troops.push(troop);
            }
        }

        this.updateArmyAmount(troops, null, true)
    },

    updateMaxTotalSpace: function (space) {
        this._maxTotalSpace = space;
        let event = new cc.EventCustom(TRAINING_EVENTS.UPDATE_SPACE);
        event.data = {
            space: space
        };
        cc.eventManager.dispatchEvent(event);

    },

    getCurrentSpace: function () {
        return this._currentSpace;
    },

    getMaxSpace: function () {
        return this._maxTotalSpace;
    },

    getBarrackList: function () {
        return this._barrackList;
    },

    getTroopCount: function () {

    },

    updateArmyAmount: function (troops, curPage ,isInit = false) {

        troops.map(e => {
            if(!isInit) {
                if (!this._armyAmount[e.cfgId]) {
                    this._armyAmount[e.cfgId] = e.count;
                } else {
                    this._armyAmount[e.cfgId] += e.count;
                }
                this._currentSpace += TROOP_BASE[e.cfgId]["housingSpace"] * e.count;
            }

            // create troop sprite run to army camp
            let armyCampIndex;
            if (this._armyCampList.length === 1) {
                armyCampIndex = 0;
            } else {
                armyCampIndex = (this._armyAmount[e.cfgId] - 1) % (this._armyCampList.length);
            }
            let data = {barrackIndex: curPage, cfgId: e.cfgId, count: e.count, armyCampIndex: armyCampIndex};
            this.createTroopOnMap(data);

        });

        cc.director.getRunningScene().infoLayer.updateUI({
            army: {
                current: this._currentSpace,
                max: this._maxTotalSpace
            }
        });

    },

    createTroopOnMap: function ({barrackIndex, cfgId, count, armyCampIndex}) {
        cc.log("DATA : \n" + JSON.stringify({barrackIndex, cfgId, count, armyCampIndex}));
        for (let i = 0; i < count; i++) {
            let newTroop = new Troop(cfgId, 1, barrackIndex, armyCampIndex)
            let mapLayer = cc.director.getRunningScene().getMapLayer();
            mapLayer.addChild(newTroop, MAP_ZORDER_TROOP);

        }
    }


})
ArmyManager.Instance = function () {
    if (ArmyManager.instance == null) {
        ArmyManager.instance = new ArmyManager();
    }
    return ArmyManager.instance;
}




