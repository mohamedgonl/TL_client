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
        cc.log("UPDATE :: " +JSON.stringify(this.resource))
        cc.eventManager.dispatchCustomEvent(EVENT_NAMES.RESOURCE_CHANGED)

    },

    addResource: function ({gold, elixir, gem}) {
        if (gold) {
            this.resource.gold += gold;
        }
        if (elixir) {
            this.resource.elixir += elixir;
        }
        if (gem) {
            this.resource.gem += gem;
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
    changeResource: function (type, value) {
        if (type === "gold") {
            this.resource.gold += value;
        } else if (type === "elixir") {
            this.resource.elixir += value;
        } else return;
        this.setUI({resource: this.resource});
        cc.eventManager.dispatchCustomEvent(EVENT_NAMES.RESOURCE_CHANGED)
    },
    changeMaxResource: function (type, value) {
        if (type === "gold") {
            this.maxResource.gold += value;
        } else if (type === "elixir") {
            this.maxResource.elixir += value;
        } else return;
        this.setUI({maxResource: this.maxResource});
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
        InfoLayer.updateUI(data);
    },
})

PlayerInfoManager.Instance = function () {
    if (PlayerInfoManager.instance == null) {
        PlayerInfoManager.instance = new PlayerInfoManager();
        PlayerInfoManager.instance.retain();
    }
    return PlayerInfoManager.instance;
}




