var PlayerInfoManager = cc.Layer.extend({
    instance: null,
    id: null,

    info: {
        name: "",
        avatar: "",
        level: 1,
        rank: 1,
    },
    maxResource: {
        gold: 0,
        elixir: 0,
    },
    resource: {
        gold: 0,
        elixir: 0,
        gem: 0
    },
    builder: {
        current: 0,
        max: 0,
    },
    army: {
        current: 0,
        max: 0,
    },

    getMaxResource: function () {
        return this.maxResource;
    },
    getResource: function (type) {
        if(type)
        {
            if(type === "gold")
                return this.resource.gold;
            else if(type === "elixir")
                return this.resource.elixir;
            else if(type === "gem")
                return this.resource.gem;
            else return 0;
        }
        return this.resource;
    },
    getInfo: function () {
        return this.info;
    },
    getBuilder: function () {
        return this.builder;
    },
    setResource: function ({gold, elixir, gem}) {
        if (gold >= 0) {
            this.resource.gold = gold;
        }
        if (elixir >= 0) {
            this.resource.elixir = elixir;
        }
        if (gem >= 0) {
            this.resource.gem = gem;
        }
        this.setUI({resource: this.resource});
        cc.eventManager.dispatchCustomEvent(EVENT_NAMES.RESOURCE_CHANGED)

    },
    setId: function (id) {
        this.id = id;
    },

    setPlayerInfo: function ({name, avatar, level, rank}) {
        if (name) {
            this.info.name = name;
        }
        if (avatar) {
            this.info.avatar = avatar;
        }
        if (level) {
            this.info.level = level;
        }
        if (rank) {
            this.info.rank = rank;
        }
        this.setUI({info: this.info});
    },

    setMaxResource: function ({gold, elixir, gem}) {
        if (gold) {
            this.maxResource.gold = gold;
        }
        if (elixir) {
            this.maxResource.elixir = elixir;
        }
        if (gem) {
            this.maxResource.gem = gem;
        }
        this.setUI({maxResource: this.maxResource});
    },
    changeResource : function({gold,elixir,gem}){
        cc.log("changeResource:::::::::::::::::::::::::::")
        if(gold!=null)
            this.resource.gold += gold;
        if(elixir!=null)
            this.resource.elixir += elixir;
        if(gem!=null)
            this.resource.gem += gem;
        this.setUI({resource: this.resource});
        cc.eventManager.dispatchCustomEvent(EVENT_NAMES.RESOURCE_CHANGED)
    },
    changeMaxResource : function({gold,elixir,gem}){
        cc.log("changeMaxResource:::::::::::::::::::::::::::")
        cc.log(JSON.stringify({gold,elixir,gem}))
        if(gold!=null)
            this.maxResource.gold += gold;
        if(elixir!=null)
            this.maxResource.elixir += elixir;
        if(gem!=null)
            this.maxResource.gem += gem;
        this.setUI({maxResource: this.maxResource});
        cc.eventManager.dispatchCustomEvent(EVENT_NAMES.MAX_RESOURCE_CHANGED)
    },
    changeBuilder: function (type, value) {
        if (type === "current") {
            this.builder.current += value;
        } else if (type === "max") {
            this.builder.max += value;
        } else return;
        this.setUI({builder: this.builder});
    },
    changeInfo: function (type, value) {
        if (type === "name") {
            this.info.name = value;
        } else if (type === "avatar") {
            this.info.avatar = value;
        } else if (type === "level") {
            this.info.level = value;
        } else if (type === "rank") {
            this.info.rank = value;
        }
        this.setUI({info: this.info});
    },
    checkEnoughResource: function (gold, elixir) {
        if (this.resource.gold >= gold && this.resource.elixir >= elixir) {
            return true;
        }
        return false;
    },
    setUI: function (data) {
        let InfoLayer = cc.director.getRunningScene().infoLayer;
        if (InfoLayer == null) return;

        if(data.resource)
        {
            cc.log(JSON.stringify(data.resource));
            GameUtilities.updateCurrentCapacityAllBuilding();
        }
        cc.log(data);

        InfoLayer.updateUI(data);
    },
    // buyResourceByGem: function (gold, elixir, callback) {
    //     callback();
    // }
    freeBuilderByGem: function (callback) {
        //for all building in Map Manager, if building is complete soonest, free it
        let buildingList = MapManager.Instance().getAllBuilding();
        let minTime = null,
            minBuilding = null;

        //get building complete soonest
        for (let i = 0; i < buildingList.length; i++) {
            let building = buildingList[i];
            if (building._state >0) {
                let timeLeft = building.getTimeLeft();
                if(timeLeft == null) continue;

                if (minTime == null || timeLeft < minTime) {
                    minTime = timeLeft;
                    minBuilding = building;
                }
            }
        }

        if (minBuilding) {
            minBuilding.onClickQuickFinish();
        }
        // if(callback)
        // callback();
    }
})

PlayerInfoManager.Instance = function () {
    if (PlayerInfoManager.instance == null) {
        PlayerInfoManager.instance = new PlayerInfoManager();
        PlayerInfoManager.instance.retain();
    }
    return PlayerInfoManager.instance;
}




