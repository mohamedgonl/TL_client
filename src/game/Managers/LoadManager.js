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
        let townhallLevelCount = 6;
        this.loadSpriteToRes(res_map.SPRITE.BODY.TOWNHALL, "res/Buildings/townhall/TOW_1_", "/idle/image0000.png", townhallLevelCount);

        //RES_1 gold mine
        let goldMineLevelCount = Object.keys(this["RES_1"]).length;
        this.loadSpriteToRes(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM, "res/Buildings/gold mine/RES_1_", "/idle/image0000.png", goldMineLevelCount);
        this.loadSpriteFolderToRes(res_map.SPRITE.BODY.GOLD_MINE.UPPER,
            "res/Effects/RES_1_",
            "_effect/",
            ".png",
            goldMineLevelCount,
            COUNT_FRAME_MINE_EFFECT);

        //RES_2 elixir mine
        //bottom: res/Buildings/elixir collector/RES_2_1/idle/image0000.png
        //upper: res/Effects/RES_2_1_effect/00.png
        let elixirMineLevelCount = Object.keys(this["RES_2"]).length;
        this.loadSpriteToRes(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM, "res/Buildings/elixir collector/RES_2_", "/idle/image0000.png", elixirMineLevelCount);

        this.loadSpriteFolderToRes(res_map.SPRITE.BODY.ELIXIR_MINE.UPPER,
            "res/Effects/RES_2_",
            "_effect/",
            ".png",
            elixirMineLevelCount,
            COUNT_FRAME_MINE_EFFECT);

        //STO_1
        let goldStorageLevelCount = Object.keys(this["STO_1"]).length;
        //body res/Buildings/gold storage/STO_1_1/idle/image0000.png to image0003.png
        this.loadSpriteFolderToRes(res_map.SPRITE.BODY.GOLD_STORAGE,
            "res/Buildings/gold storage/STO_1_",
            "/idle/image00",
            ".png",
            goldStorageLevelCount,
            4);

        //STO_2
        let elixirStorageLevelCount = Object.keys(this["STO_2"]).length;
        //body
        //res/Buildings/elixir storage/STO_2_1/idle/image0000.png
        this.loadSpriteFolderToRes(res_map.SPRITE.BODY.ELIXIR_STORAGE,
            "res/Buildings/elixir storage/STO_2_",
            "/idle/image00",
            ".png",
            elixirStorageLevelCount,
            4);

        //BDH_1

        //AMC_1
        //body 1 sprite
        //res/Buildings/army camp/AMC_1_1/idle/image0000.png
        let armyCampLevelCount = Object.keys(this["AMC_1"]).length;
        this.loadSpriteToRes(res_map.SPRITE.BODY.ARMY_CAMP, "res/Buildings/army camp/AMC_1_", "/idle/image0000.png", armyCampLevelCount);

        //BAR_1
        //body 1 sprite
        //res/Buildings/barrack/BAR_1_1/idle/image0000.png
        let barrackLevelCount = Object.keys(this["BAR_1"]).length;
        this.loadSpriteToRes(res_map.SPRITE.BODY.BARRACK, "res/Buildings/barrack/BAR_1_", "/idle/image0000.png", barrackLevelCount);

        //DEF_1
        //body 5 sprites
        //res/Buildings/cannon/canon_1/idle/image0000.png to image0004.png
        let cannonLevelCount = Object.keys(this["DEF_1"]).length;
        this.loadSpriteFolderToRes(res_map.SPRITE.BODY.CANNON,
            "res/Buildings/cannon/canon_",
            "/idle/image00",
            ".png",
            cannonLevelCount,
            5);

        //WAL_1
        //body 4 sprites
        //res/Buildings/wall/WAL_1_1/WAL_1_1/idle/image0000.png
        let wallLevelCount = 7;
        let part1 = "res/Buildings/wall/WAL_1_";
        let part2 = "/WAL_1_";
        let part3 = "/idle/image000";
        let part4 = ".png";
        for(let i = 1; i <= wallLevelCount; i++) {
            let res = {};
            for(let j = 0; j < 4; j++){
                    res[j] = part1 + i + part2 + i + part3 + j + part4;
            }
            res_map.SPRITE.BODY.WALL[i] = res;
        }
    },

    loadSpriteToRes: function (res_address, prefix, suffix, count) {
        for(var i = 1; i <= count; i++){
            var res = prefix + i + suffix;
            res_address[i] = res;
            //cc.log("added res " + res + " to res_address " + res_address[i])
        }
    },
    loadSpriteFolderToRes: function (res_address, part1, part2, part3, countLevel, countFrame) {
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
