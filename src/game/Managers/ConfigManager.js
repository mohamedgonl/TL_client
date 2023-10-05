//call when init game, get config and load resource to res
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
        //load resource to res
        this.loadResource();

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
    },

    loadResource : function () {
        //bo sung OBS

        //TOW_1
        // 1:'res/Buildings/townhall/TOW_1_1/idle/image0000.png'
        var townhallLevelCount = Object.keys(this.townhall["TOW_1"]).length;
        this.loadSpriteToRes(res_map.SPRITE.BODY.TOWNHALL, "res/Buildings/townhall/TOW_1_", "/idle/image0000.png", townhallLevelCount);

        //RES_1 gold mine
        // GOLD_MINE:{
        //                 BOTTOM:{
        //                     1: 'res/Buildings/gold mine/RES_1_1/idle/image0000.png',
        //                 },
        //                 UPPER:{
        //                     1: {
        //                       1: 'res/Effects/RES_1_1_effect/00.png',
        //                       2: 'res/Effects/RES_1_1_effect/01.png',
        //                     }
        //                 }
        //             }
        var goldMineLevelCount = Object.keys(this.resource["RES_1"]).length;
        this.loadSpriteToRes(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM, "res/Buildings/gold mine/RES_1_", "/idle/image0000.png", goldMineLevelCount);
        this.loadAnimationToRes(res_map.SPRITE.BODY.GOLD_MINE.UPPER,
            "res/Effects/RES_1_",
            "_effect/",
            ".png",
            goldMineLevelCount,
            COUNT_FRAME_GOLD_MINE_EFFECT);
        cc.log(JSON.stringify(res_map.SPRITE.BODY.GOLD_MINE, null, 2));
    },
    loadSpriteToRes: function (res_address, prefix, suffix, count) {
        for(var i = 1; i <= count; i++){
            var res = prefix + i + suffix;
            res_address[i] = res;
            //cc.log("added res " + res + " to res_address " + res_address[i])
        }
    },
    loadAnimationToRes: function (res_address, part1, part2, part3, countLevel, countFrame) {
        for(var i = 1; i <= countLevel; i++){
            var res = {};
            for(var j = 0; j < countFrame; j++){

                var frame;

                if(j < 10){
                    frame = part1 + i + part2 + "0" +j + part3;
                }
                else
                    frame = part1 + i + part2 + j + part3;

                res[j] = frame;

                cc.log("added res " + frame)    ;
            }
            res_address[i] = res;
        }
    }


});

ConfigManager.Instance = function () {
    if (ConfigManager.instance == null) {
        ConfigManager.instance = new ConfigManager();

    }
    return ConfigManager.instance;
}
