var PlayerInfo = cc.Class.extend({
    maxResource : {
        gold: 1000000,
        elixir: 1000000,
    },
    resource: {
        gold: 59000,
        elixir: 78000,
        gem: 242
    },

    ctor: function () {
        if (!PlayerInfo.instance) {
            PlayerInfo.instance = this;
        }
        return PlayerInfo.instance;
    },

    getMaxResource: function() {
        return this.maxResource;
    },

    getResource: function() {
        return this.resource;
    },

    setResource: function({gold, elixir, gem}) {
        if(gold) {
            this.resource.gold = gold;
        }
        if(elixir) {
            this.resource.elixir = elixir;
        }
        if(gem) {
            this.resource.gem = gem;
        }
    },

    setMaxResource: function({gold, elixir, gem}) {
        if(gold) {
            this.maxResource.gold = gold;
        }
        if(elixir) {
            this.maxResource.elixir = elixir;
        }
        if(gem) {
            this.maxResource.gem = gem;
        }
    }
})


var PlayerInfoManager = new PlayerInfo()

