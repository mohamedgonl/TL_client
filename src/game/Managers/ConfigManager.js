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

    }
    return ConfigManager.instance;
}
