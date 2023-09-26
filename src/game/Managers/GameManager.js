var GameManager = cc.Class.extend({

    ctor: function () {
        if (!GameManager.instance) {
            GameManager.instance = this;
        }
        return GameManager.instance;
    },

    init: function (buildings) {
        this.listBuildings = buildings;
    },
})


var GameManager = new GameManager();

