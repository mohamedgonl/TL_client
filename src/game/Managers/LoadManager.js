//call when init game, get config and load resource to res
var LoadManager = cc.Class.extend({

    instance: null,
    obstacle: null,
    ctor: function () {


        this['TOW_1'] = cc.loader.getRes(res_map.JSON.TOWNHALL)['TOW_1'];
        this['STO_1'] = cc.loader.getRes(res_map.JSON.STORAGE)['STO_1'];
        this['STO_2'] = cc.loader.getRes(res_map.JSON.STORAGE)['STO_2'];
        this['BAR_1'] = cc.loader.getRes(res_map.JSON.BARRACK)['BAR_1'];
        this['AMC_1'] = cc.loader.getRes(res_map.JSON.ARMY_CAMP)['AMC_1'];
        this['BDH_1'] = cc.loader.getRes(res_map.JSON.BUILDER_HUT)['BDH_1'];
        this['DEF_1'] = cc.loader.getRes(res_map.JSON.DEFENCE)['DEF_1'];
        this['WAL_1'] = cc.loader.getRes(res_map.JSON.WALL)['WAL_1'];
        this['RES_1'] = cc.loader.getRes(res_map.JSON.RESOURCE)['RES_1'];
        this['RES_2'] = cc.loader.getRes(res_map.JSON.RESOURCE)['RES_2'];


        //add to resource OBS_1 to OBS_27
        var jsonObstacle = cc.loader.getRes(res_map.JSON.OBSTACLE);
        var obstacleCount = Object.keys(jsonObstacle).length;
        for(var i = 1; i <= obstacleCount; i++){
            var res = jsonObstacle['OBS_'+i];
            this['OBS_'+i] = res;
        }
        //load resource to res
        this.loadResource();

    },

    //get config from json
    // example {type: TOW_1, level: 1, key: posX}
    getConfig: function (type, level=1, key) {
        if(key == null)
            return this[type][level];
       return this[type][level][key];
    },

    loadResource : function () {
        //bo sung OBS

        //TOW_1
        // 1:'res/Buildings/townhall/TOW_1_1/idle/image0000.png'
        var townhallLevelCount = Object.keys(this["TOW_1"]).length;
        this.loadSpriteToRes(res_map.SPRITE.BODY.TOWNHALL, "res/Buildings/townhall/TOW_1_", "/idle/image0000.png", townhallLevelCount);

        //RES_1 gold mine
        var goldMineLevelCount = Object.keys(this["RES_1"]).length;
        this.loadSpriteToRes(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM, "res/Buildings/gold mine/RES_1_", "/idle/image0000.png", goldMineLevelCount);
        this.loadAnimationToRes(res_map.SPRITE.BODY.GOLD_MINE.UPPER,
            "res/Effects/RES_1_",
            "_effect/",
            ".png",
            goldMineLevelCount,
            COUNT_FRAME_GOLD_MINE_EFFECT);
       // cc.log(JSON.stringify(res_map.SPRITE.BODY.GOLD_MINE, null, 2));
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

                //cc.log("added res " + frame)    ;
            }
            res_address[i] = res;
        }
    }


});

LoadManager.Instance = function () {
    if (LoadManager.instance == null) {
        LoadManager.instance = new LoadManager();

    }
    return LoadManager.instance;
}
