var ConfigManager = cc.Class.extend({

    instance: null,
    obstacle: null,
    ctor: function () {
        this.obstacle = cc.loader.getRes(res_map.JSON.OBSTACLE);
        this.townhall = cc.loader.getRes(res_map.JSON.TOWNHALL);
        this.storage = cc.loader.getRes(res_map.JSON.STORAGE);
        this.barrack = cc.loader.getRes(res_map.JSON.BARRACK);
        this.armyCamp = cc.loader.getRes(res_map.JSON.ARMY_CAMP);
        this.resource = cc.loader.getRes(res_map.JSON.RESOURCE);
        this.builderHut = cc.loader.getRes(res_map.JSON.BUILDER_HUT);
        this.defence = cc.loader.getRes(res_map.JSON.DEFENCE);
        this.wall = cc.loader.getRes(res_map.JSON.WALL);

    },
    getObstacle: function (index){
        return this.obstacle['OBS_'+index][1];
    },

    getConfigTownHall: function (level) {
        return this.townhall["TOW_1"][level];
    },
    getConfigGoldMine: function (level) {
        return this.resource["RES_1"][level];
    },
    getConfigElixirMine: function (level) {
        return this.resource["RES_2"][level];
    },
    getConfigBuilderHut: function (level) {
        return this.builderHut["BDH_1"][level];
    },
    getConfigArmyCamp: function (level) {
        return this.armyCamp["AMC_1"][level];
    },
    getConfigGoldStorage: function (level) {
        return this.storage["STO_1"][level];
    },
    getConfigElixirStorage: function (level) {
        return this.storage["STO_2"][level];
    },
    getConfigCannon: function (level) {
        return this.defence["DEF_1"][level];
    },
    getConfigWall: function (level) {
        return this.wall["WAL_1"][level];
    },
    getConfigBarrack: function (level) {
        return this.barrack["BAR_1"][level];
    }
});

ConfigManager.Instance = function () {
    if (ConfigManager.instance == null) {
        ConfigManager.instance = new ConfigManager();

    }
    return ConfigManager.instance;
}
