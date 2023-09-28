var ConfigManager = cc.Class.extend({

    instance: null,
    obstacle: null,
    ctor: function () {
        this.obstacle = cc.loader.getRes(res_map.JSON.OBSTACLE);
    },
    getObstacle: function (index){
        return this.obstacle['OBS_'+index][1];
    }
});

ConfigManager.Instance = function () {
    if (ConfigManager.instance == null) {
        ConfigManager.instance = new ConfigManager();
        var a = cc.p(1,10);
        var b = cc.p(7,1);
        var c = cc.pProject(a,b);
        cc.log("project of a and b: "+c.x + " " + c.y);
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    }
    return ConfigManager.instance;
}
