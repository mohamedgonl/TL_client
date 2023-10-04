var PlayerInfoManager = cc.Layer.extend({
    instance: null,

    id: null,

    info:{
        name: "",
        avatar: "",
        level: 1,
        rank: 1,
    },

    maxResource: {
        gold: 1000000,
        elixir: 1000000,
    },
    resource: {
        gold: 59000,
        elixir: 78000,
        gem: 242
    },

    getMaxResource: function () {
        return this.maxResource;
    },

    getResource: function () {
        return this.resource;
    },

    setResource: function ({gold, elixir, gem}) {
        if (gold) {
            this.resource.gold = gold;
        }
        if (elixir) {
            this.resource.elixir = elixir;
        }
        if (gem) {
            this.resource.gem = gem;
        }

        this.onChangedInfo({resource: this.resource});
    },

    setId : function (id) {
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
        this.onChangedInfo({info: this.info});
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
    },

    //on changed info dispatch an event to InfoLayer to update UI
    onChangedInfo: function (data) {
        cc.eventManager.dispatchCustomEvent(EVENT_PLAYER_INFO_CHANGED, data);
        cc.log("dispatch event: " + JSON.stringify(data, null, 2));
    }
})
PlayerInfoManager.Instance = function () {
    if (PlayerInfoManager.instance == null) {
        PlayerInfoManager.instance = new PlayerInfoManager();
        PlayerInfoManager.instance.retain();
    }
    return PlayerInfoManager.instance;
}




