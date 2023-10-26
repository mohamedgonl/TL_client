var ArmyManager = cc.Class.extend({

    ctor: function () {
        this.init();
        this._barrackList = [];
        this._armyCampList = [];
        this._armyAmount = {};
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

    getCurrentSpace: function () {
        let currentSpace = 0;
        for (let key in this._armyAmount) {
            if (this._armyAmount.hasOwnProperty(key)) {
                const value = this._armyAmount[key];
                currentSpace += TROOP_BASE[key]["housingSpace"] *value;
            }
        }
        return currentSpace;
    },

    getMaxSpace: function () {
        let maxTotalSpace = 0;
        this._armyCampList.map(armyCamp => {
            maxTotalSpace += AMC["AMC_1"][armyCamp._level]["capacity"];
        })
        return maxTotalSpace;
    },

    getBarrackList: function () {
        return this._barrackList;
    },

    getTroopCount: function () {

    },

    updateArmyAmount: function (troops, curPage, isInit = false) {

        troops.map(e => {
            if (!isInit) {
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
                current: this.getCurrentSpace(),
                max: this.getMaxSpace()
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
ArmyManager.getInstance = function () {
    if (ArmyManager.instance == null) {
        ArmyManager.instance = new ArmyManager();
    }
    return ArmyManager.instance;
}
ArmyManager.releaseInstance = function () {

    ArmyManager.instance = null;
}




