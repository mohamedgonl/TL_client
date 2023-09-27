var GameManager = cc.Class.extend({

    ctor: function () {
        if (!GameManager.instance) {
            GameManager.instance = this;
        }
        return GameManager.instance;
    },

    init: function (buildings) {
        this.listBuildings = buildings;
       // cc.log("listBuildings" + JSON.stringify(this.listBuildings));
    },

})


var GameManager = new GameManager();

