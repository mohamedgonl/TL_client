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
        cc.log("update army info")
        cc.director.getRunningScene().infoLayer.updateUI({
            army: {
                current: this.getCurrentSpace(),
                max: this.getMaxSpace()
            }
        });
    },

    getArmyCampList: function () {
        return this._armyCampList;
    },
    updateArmyInfo: function () {
        cc.log("update army info")
        cc.director.getRunningScene().infoLayer.updateUI({
            army: {
                current: this.getCurrentSpace(),
                max: this.getMaxSpace()
            }
        });
    },

    pushArmyCamp: function (armyCamp) {
        this._armyCampList.push(armyCamp);
        cc.log("update army info")
        cc.director.getRunningScene().infoLayer.updateUI({
            army: {
                current: this.getCurrentSpace(),
                max: this.getMaxSpace()
            }
        });
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
                currentSpace += TROOP_BASE[key]["housingSpace"] * value;
            }
        }
        return currentSpace;
    },

    getMaxSpace: function () {
        let maxTotalSpace = 0;
        this._armyCampList.map(armyCamp => {
            if (armyCamp._state !== 1)
                maxTotalSpace += AMC["AMC_1"][armyCamp._level]["capacity"];
        })
        return maxTotalSpace;
    },

    getBarrackList: function () {
        return this._barrackList;
    },

    getTroopCount: function () {

    },

    getMaxSpaceAmcIndex: function () {
        let max = 0;
        let _index = 0;
        this._armyCampList.map((e,index) => {
            cc.log("FIND MAX:::: max space : " + e.getMaxSpace() + " : current :: " + e.getCurrentSpace() + " index :: " + index)
            if(e.getMaxSpace() - e.getCurrentSpace() > max) {
                max = e.getMaxSpace() - e.getCurrentSpace();
                _index = index;
            }
        });

        return _index;
    },



    updateArmyAmount: function (troops, curPage, isInit = false) {
        cc.log("PARAMS :: " + JSON.stringify(troops) + " PAGE : " + curPage + " isInit : " + isInit)
        cc.log("ARMY LIST :: " + this._armyCampList.length)
        troops.map(e => {
            if (TROOP_ANIMS_LIST.indexOf(e.cfgId) !== -1) {
                if (!isInit) {
                    if (!this._armyAmount[e.cfgId]) {
                        this._armyAmount[e.cfgId] = e.count;
                    } else {
                        this._armyAmount[e.cfgId] += e.count;
                    }
                    this._currentSpace += TROOP_BASE[e.cfgId]["housingSpace"] * e.count;
                }

                // create troop sprite run to army camp
                for (let i = 0; i< e.count; i++) {
                    let index = this.getMaxSpaceAmcIndex();
                    let data = {barrackIndex: curPage, cfgId: e.cfgId, count: 1, armyCampIndex: index};
                    this._armyCampList[index].addTroop({cfgId: e.cfgId, count: 1})
                    this.createTroopOnMap(data);
                }

            }

        });

        cc.log("update army info")
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




