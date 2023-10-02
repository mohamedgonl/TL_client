var PlayerInfoManager = cc.Class.extend({
    instance: null,

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
        InfoLayer.Instance().updateResource(this.resource);

    },

    setInfo: function ({id, name, avatar, level, rank}) {
        if (id) {
            this.id = id;
        }
        if (name) {
            this.name = name;
        }
        if (avatar) {
            this.avatar = avatar;
        }
        if (level) {
            this.level = level;
        }
        if (rank) {
            this.rank = rank;
        }
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
    }
    return PlayerInfoManager.instance;
}




