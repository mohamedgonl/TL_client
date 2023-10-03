var PlayerInfoManager = cc.Class.extend({
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
        cc.log("update resource: " + JSON.stringify(this.resource, null, 2));
        InfoLayer.Instance().updateUI(this.resource);

    },

    setId : function (id) {
        this.id = id;
    },

    setPlayerInfo: function ({name, avatar, level, rank}) {
        cc.log("CALL SET INFO in plyer  info ::::::::")
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
        InfoLayer.Instance().updateUI(this.info);
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
    }
})
PlayerInfoManager.Instance = function () {
    if (PlayerInfoManager.instance == null) {
        PlayerInfoManager.instance = new PlayerInfoManager();
        PlayerInfoManager.instance.retain();
    }
    return PlayerInfoManager.instance;
}




