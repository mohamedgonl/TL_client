//call when init game, get config and load resource to res
TOW_1 = cc.loader.getRes(res_map.JSON.TOWNHALL)['TOW_1'];
STO_1 = cc.loader.getRes(res_map.JSON.STORAGE)['STO_1'];
STO_2 = cc.loader.getRes(res_map.JSON.STORAGE)['STO_2'];
BAR_1 = cc.loader.getRes(res_map.JSON.BARRACK)['BAR_1'];
AMC_1 = cc.loader.getRes(res_map.JSON.ARMY_CAMP)['AMC_1'];
BDH_1 = cc.loader.getRes(res_map.JSON.BUILDER_HUT)['BDH_1'];
DEF_1 = cc.loader.getRes(res_map.JSON.DEFENCE)['DEF_1'];
DEF_1.baseConfig = cc.loader.getRes(res_map.JSON.DEFENCE_BASE)['DEF_1'];
WAL_1 = cc.loader.getRes(res_map.JSON.WALL)['WAL_1'];
RES_1 = cc.loader.getRes(res_map.JSON.RESOURCE)['RES_1'];
RES_2 = cc.loader.getRes(res_map.JSON.RESOURCE)['RES_2'];

var LoadManager = cc.Node.extend({

    instance: null,
    obstacle: null,
    ctor: function () {
        this._super();

        this['TOW_1'] = cc.loader.getRes(res_map.JSON.TOWNHALL)['TOW_1'];
        this['STO_1'] = cc.loader.getRes(res_map.JSON.STORAGE)['STO_1'];
        this['STO_2'] = cc.loader.getRes(res_map.JSON.STORAGE)['STO_2'];
        this['BAR_1'] = cc.loader.getRes(res_map.JSON.BARRACK)['BAR_1'];
        this['AMC_1'] = cc.loader.getRes(res_map.JSON.ARMY_CAMP)['AMC_1'];
        this['BDH_1'] = cc.loader.getRes(res_map.JSON.BUILDER_HUT)['BDH_1'];

        this['DEF_1'] = cc.loader.getRes(res_map.JSON.DEFENCE)['DEF_1'];
        const def1Base = cc.loader.getRes(res_map.JSON.DEFENCE_BASE)['DEF_1'];
        this['DEF_1'].baseConfig = def1Base;

        this['DEF_2'] = cc.loader.getRes(res_map.JSON.DEFENCE)['DEF_2'];
        const def2Base = cc.loader.getRes(res_map.JSON.DEFENCE_BASE)['DEF_2'];
        this['DEF_2'].baseConfig = def2Base;

        this['DEF_3'] = cc.loader.getRes(res_map.JSON.DEFENCE)['DEF_3'];
        const def3Base = cc.loader.getRes(res_map.JSON.DEFENCE_BASE)['DEF_3'];
        this['DEF_3'].baseConfig = def3Base;


        this['WAL_1'] = cc.loader.getRes(res_map.JSON.WALL)['WAL_1'];
        this['RES_1'] = cc.loader.getRes(res_map.JSON.RESOURCE)['RES_1'];
        this['RES_2'] = cc.loader.getRes(res_map.JSON.RESOURCE)['RES_2'];

        //add to resource OBS_1 to OBS_27
        var jsonObstacle = cc.loader.getRes(res_map.JSON.OBSTACLE);
        var obstacleCount = Object.keys(jsonObstacle).length;
        for (var i = 1; i <= obstacleCount; i++) {
            var res = jsonObstacle['OBS_' + i];
            this['OBS_' + i] = res;
        }
        //load resource to res
        this.loadResource();

    },

    //get config from json
    // example {type: TOW_1, level: 1, key: posX}
    getConfig: function (type, level = 1, key) {
        if (level === 0) return null;

        if (type === "BDH_1" && key === "coin") {
            let bdhCount = MapManager.getInstance().buildingAmount["BDH_1"];
            return this[type][bdhCount + 1][key];
        }

        if (key == null)
            return this[type][level];
        return this[type][level][key];


    },

    getDefBaseConfig: function (type) {
        if (type.startsWith("DEF")) {
            return this[type].baseConfig;
        }
        return null;
    },

    loadResource: function () {
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

        //DEF_2
        //body

        let def2LevelCount =  9;
        //path res/Buildings/defense_base/DEF_1_1_Shadow.png
        this.loadSpriteToRes(res_map.SPRITE.BODY.ARCHER_TOWER, "res/Buildings/defense_base/DEF_2_", "_Shadow.png", def2LevelCount);

        //upper : archer idle
        //link "res/Buildings/AcherTower/DEF_2_1/DEF_2_1/idle/image0000.png to image0004.png"

        let part1 = "res/Buildings/AcherTower/DEF_2_";
        let part2 = "/DEF_2_";
        let part3 = "/idle/image000";
        let part4 = ".png";

        for (let i = 1; i <= def2LevelCount; i++) {
            let res = {};
            for (let j = 0; j < 5; j++) {
                res[j] = part1 + i + part2 + i + part3 + j + part4;
            }
            res_map.SPRITE.BODY.ARCHER_TOWER.UPPER.IDLE[i] = res;
        }

        //upper : archer attack
        //link res/Buildings/AcherTower/DEF_2_1/DEF_2_1/attack01/image0000.png

        part1 = "res/Buildings/AcherTower/DEF_2_";
        part2 = "/DEF_2_";
        part3 = "/attack01/image00";
        part4 = ".png";

        for (let i = 1; i <= def2LevelCount; i++) {
            let res = {};
            for (let j = 0; j < 65; j++) {
                if(j<10)
                    res[j] = part1 + i + part2 + i + part3 + "0" + j + part4;
                else
                    res[j] = part1 + i + part2 + i + part3 + j + part4;
            }
            res_map.SPRITE.BODY.ARCHER_TOWER.UPPER.ATTACK[i] = res;
        }



        //DEF 3

        let def3LevelCount = 9;
        //path res/Buildings/Mortar/DEF_3_1/DEF_3_1/idle/image0000.png - > 5

        part1 = "res/Buildings/Motar/DEF_3_";
        part2 = "/DEF_3_";
        part3 = "/idle/image000";
        part4 = ".png";

        for (let i = 1; i <= def3LevelCount; i++) {
            let res = {};
            for (let j = 0; j < 5; j++) {
                res[j] = part1 + i + part2 + i + part3 + j + part4;
            }
            res_map.SPRITE.BODY.MORTAR[i] = res;
        }

        //DEF_1 ATK  res/Buildings/cannon/canon_1/attack01/image0000.png
        for(let level = 1; level <=cannonLevelCount; level ++)
        {
            let prefixLink = "res/Buildings/cannon/canon_"+level+"/attack01/image00"
            res_map.SPRITE.BODY.CANNON.ATK_0[level] = {}
            res_map.SPRITE.BODY.CANNON.ATK_1[level] = {}
            res_map.SPRITE.BODY.CANNON.ATK_2[level] = {}
            res_map.SPRITE.BODY.CANNON.ATK_3[level] = {}
            res_map.SPRITE.BODY.CANNON.ATK_4[level] = {}
            this.loadSpriteToRes(res_map.SPRITE.BODY.CANNON.ATK_0[level],prefixLink,".png",null,0,6);
            this.loadSpriteToRes(res_map.SPRITE.BODY.CANNON.ATK_1[level],prefixLink,".png",null,7,13);
            this.loadSpriteToRes(res_map.SPRITE.BODY.CANNON.ATK_2[level],prefixLink,".png",null,14,20);
            this.loadSpriteToRes(res_map.SPRITE.BODY.CANNON.ATK_3[level],prefixLink,".png",null,21,27);
            this.loadSpriteToRes(res_map.SPRITE.BODY.CANNON.ATK_4[level],prefixLink,".png",null,28,34);
        }

        //DEF_2 ATK res/Buildings/AcherTower/DEF_2_1/DEF_2_1/attack01/image0000.png
        for(let level =1; level <= def2LevelCount; level ++)
        {
            let prefixLink = "res/Buildings/AcherTower/DEF_2_"+level+"/DEF_2_"+level+"/attack01/image00";
            res_map.SPRITE.BODY.ARCHER_TOWER.ATK_0[level] = {}
            res_map.SPRITE.BODY.ARCHER_TOWER.ATK_1[level] = {}
            res_map.SPRITE.BODY.ARCHER_TOWER.ATK_2[level] = {}
            res_map.SPRITE.BODY.ARCHER_TOWER.ATK_3[level] = {}
            res_map.SPRITE.BODY.ARCHER_TOWER.ATK_4[level] = {}
            this.loadSpriteToRes(res_map.SPRITE.BODY.ARCHER_TOWER.ATK_0[level],prefixLink,".png",null,0,12)
            this.loadSpriteToRes(res_map.SPRITE.BODY.ARCHER_TOWER.ATK_1[level],prefixLink,".png",null,13,25)
            this.loadSpriteToRes(res_map.SPRITE.BODY.ARCHER_TOWER.ATK_2[level],prefixLink,".png",null,26,38)
            this.loadSpriteToRes(res_map.SPRITE.BODY.ARCHER_TOWER.ATK_3[level],prefixLink,".png",null,39,51)
            this.loadSpriteToRes(res_map.SPRITE.BODY.ARCHER_TOWER.ATK_4[level],prefixLink,".png",null,52,64)
        }

        //DEF_3 ATK res/Buildings/Motar/DEF_3_1/DEF_3_1/attack01/image0000.png
        for(let level =1; level <= def3LevelCount; level ++)
        {
            let prefixLink = "res/Buildings/Motar/DEF_3_"+level+"/DEF_3_"+level+"/attack01/image00";
            res_map.SPRITE.BODY.MORTAR.ATK_0[level] = {}
            res_map.SPRITE.BODY.MORTAR.ATK_1[level] = {}
            res_map.SPRITE.BODY.MORTAR.ATK_2[level] = {}
            res_map.SPRITE.BODY.MORTAR.ATK_3[level] = {}
            res_map.SPRITE.BODY.MORTAR.ATK_4[level] = {}
            this.loadSpriteToRes(res_map.SPRITE.BODY.MORTAR.ATK_0[level],prefixLink,".png",null,0,4)
            this.loadSpriteToRes(res_map.SPRITE.BODY.MORTAR.ATK_1[level],prefixLink,".png",null,5,9)
            this.loadSpriteToRes(res_map.SPRITE.BODY.MORTAR.ATK_2[level],prefixLink,".png",null,10,14)
            this.loadSpriteToRes(res_map.SPRITE.BODY.MORTAR.ATK_3[level],prefixLink,".png",null,15,19)
            this.loadSpriteToRes(res_map.SPRITE.BODY.MORTAR.ATK_4[level],prefixLink,".png",null,20,24)
        }
        // cc.log("++++++++++++---------------::::::::::::::::")
        // cc.log(JSON.stringify(res_map.SPRITE.BODY.CANNON.ATK_0,null,2))
        // cc.log("++++++++++++---------------::::::::::::::::")
        //WAL_1
        //body 4 sprites
        //res/Buildings/wall/WAL_1_1/WAL_1_1/idle/image0000.png
        let wallLevelCount = 7;
         part1 = "res/Buildings/wall/WAL_1_";
         part2 = "/WAL_1_";
         part3 = "/idle/image000";
         part4 = ".png";
        for (let i = 1; i <= wallLevelCount; i++) {
            let res = {};
            for (let j = 0; j < 4; j++) {
                res[j] = part1 + i + part2 + i + part3 + j + part4;
            }
            res_map.SPRITE.BODY.WALL[i] = res;
        }

        //builder
        // res/builder/run/image0000.png

        //BUILDER:{
        //             LINK: "res/builder/run/image",
        //             DOWN:{//res/builder/run/image0000.png
        //                  //0000 -> 0007
        //             },
        //             UP:{
        //                 //0032 -> 0039
        //             },
        //             LEFT:{
        //                 //0016 -> 0023
        //             },
        //             DOWN_LEFT:{
        //                 //0008 -> 0015
        //             },
        //             UP_LEFT:{
        //                 //0024 -> 0031
        //             }
        //         }

        //add to BUILDER.DOWN
        let builderDown = {};
        for (let i = 0; i < 8; i++) {
            let res = "res/builder/run/image000" + i + ".png";
            builderDown[i] = res;
        }
        res_map.SPRITE.BUILDER.DOWN = builderDown;

        //add to BUILDER.UP
        let builderUp = {};
        for (let i = 32; i < 40; i++) {
            let res = "res/builder/run/image00" + i + ".png";
            builderUp[i - 32] = res;
        }
        res_map.SPRITE.BUILDER.UP = builderUp;

        //add to BUILDER.LEFT
        let builderLeft = {};
        for (let i = 16; i < 24; i++) {
            let res = "res/builder/run/image00" + i + ".png";
            builderLeft[i - 16] = res;
        }
        res_map.SPRITE.BUILDER.LEFT = builderLeft;

        //add to BUILDER.DOWN_LEFT
        let builderDownLeft = {};
        for (let i = 8; i < 16; i++) {
            let res;
            if (i < 10)
                res = "res/builder/run/image000" + i + ".png";
            else
                res = "res/builder/run/image00" + i + ".png";

            builderDownLeft[i - 8] = res;
        }
        res_map.SPRITE.BUILDER.DOWN_LEFT = builderDownLeft;

        //add to BUILDER.UP_LEFT
        let builderUpLeft = {};
        for (let i = 24; i < 32; i++) {
            let res = "res/builder/run/image00" + i + ".png";
            builderUpLeft[i - 24] = res;
        }
        res_map.SPRITE.BUILDER.UP_LEFT = builderUpLeft;

        //add to BUILDER.BUILD.UP
        // 1:"res/builder/attack01/image0032.png"
        //32 -> 39
        let builderBuildUp = {};
        for (let i = 0; i < 8; i++) {
            let res = "res/builder/attack01/image00" + (32 + i) + ".png";
            builderBuildUp[i] = res;
        }
        res_map.SPRITE.BUILDER.BUILD.UP = builderBuildUp;

        this.loadSpriteTroops();
        this.createAnimation();
    },

    loadSpriteToRes: function (res_address, prefix, suffix, count,start,end) {
        if(res_address === undefined)
        {
            res_address={}
        }
        if(start!=null)
        {
            for (let i = start; i <= end; i++) {
                let iString = i;
                if(i<10) iString = "0"+i;
                var res = prefix + iString + suffix;
                res_address[i-start]=res;
            }
            return;
        }
        for (var i = 1; i <= count; i++) {
            var res = prefix + i + suffix;
            res_address[i] = res;
            //cc.log("added res " + res + " to res_address " + res_address[i])
        }
    },
    loadSpriteFolderToRes: function (res_address, part1, part2, part3, countLevel, countFrame) {
        for (var i = 1; i <= countLevel; i++) {
            var res = {};
            for (var j = 0; j < countFrame; j++) {

                var frame;

                if (j < 10) {
                    frame = part1 + i + part2 + "0" + j + part3;
                } else
                    frame = part1 + i + part2 + j + part3;

                res[j] = frame;

                //cc.log("added res " + frame)    ;
            }
            res_address[i] = res;
        }
    },
    loadSpriteTroops: function () {
        //ARM_1 run
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/run/image0", 0, 13, res_troop.RUN.ARM_1.DOWN);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/run/image0", 14, 27, res_troop.RUN.ARM_1.DOWN_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/run/image0", 28, 41, res_troop.RUN.ARM_1.LEFT);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/run/image0", 42, 55, res_troop.RUN.ARM_1.UP_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/run/image0", 56, 69, res_troop.RUN.ARM_1.UP);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/run/image0", 70, 83, res_troop.RUN.ARM_1.RIGHT);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/run/image0", 84, 97, res_troop.RUN.ARM_1.UP_RIGHT);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/run/image0", 98, 111, res_troop.RUN.ARM_1.DOWN_RIGHT);

        // ARM_2 run
        this.addAnimationToTarget("res/Troops/ARM_2_1/ARM_2_1/run/image0", 0, 15, res_troop.RUN.ARM_2.DOWN);
        this.addAnimationToTarget("res/Troops/ARM_2_1/ARM_2_1/run/image0", 16, 31, res_troop.RUN.ARM_2.DOWN_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_2_1/ARM_2_1/run/image0", 32, 47, res_troop.RUN.ARM_2.LEFT);
        this.addAnimationToTarget("res/Troops/ARM_2_1/ARM_2_1/run/image0", 48, 63, res_troop.RUN.ARM_2.UP_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_2_1/ARM_2_1/run/image0", 64, 79, res_troop.RUN.ARM_2.UP);
        this.addAnimationToTarget("res/Troops/ARM_2_1/ARM_2_1/run/image0", 80, 95, res_troop.RUN.ARM_2.DOWN_RIGHT);
        this.addAnimationToTarget("res/Troops/ARM_2_1/ARM_2_1/run/image0", 96, 111, res_troop.RUN.ARM_2.RIGHT);
        this.addAnimationToTarget("res/Troops/ARM_2_1/ARM_2_1/run/image0", 112, 127, res_troop.RUN.ARM_2.UP_RIGHT);

        //ARM_3 run
        this.addAnimationToTarget("res/Troops/ARM_3_1/ARM_3_1/run/image0", 0, 11, res_troop.RUN.ARM_3.DOWN);
        this.addAnimationToTarget("res/Troops/ARM_3_1/ARM_3_1/run/image0", 12, 23, res_troop.RUN.ARM_3.DOWN_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_3_1/ARM_3_1/run/image0", 24, 35, res_troop.RUN.ARM_3.LEFT);
        this.addAnimationToTarget("res/Troops/ARM_3_1/ARM_3_1/run/image0", 36, 47, res_troop.RUN.ARM_3.UP_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_3_1/ARM_3_1/run/image0", 48, 59, res_troop.RUN.ARM_3.UP);
        this.addAnimationToTarget("res/Troops/ARM_3_1/ARM_3_1/run/image0", 60, 71, res_troop.RUN.ARM_3.DOWN_RIGHT);
        this.addAnimationToTarget("res/Troops/ARM_3_1/ARM_3_1/run/image0", 72, 83, res_troop.RUN.ARM_3.UP_RIGHT);
        this.addAnimationToTarget("res/Troops/ARM_3_1/ARM_3_1/run/image0", 84, 95, res_troop.RUN.ARM_3.RIGHT);

        //ARM_4 run
        this.addAnimationToTarget("res/Troops/ARM_4_1/ARM_4_1/run/image0", 0, 15, res_troop.RUN.ARM_4.DOWN);
        this.addAnimationToTarget("res/Troops/ARM_4_1/ARM_4_1/run/image0", 16, 31, res_troop.RUN.ARM_4.DOWN_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_4_1/ARM_4_1/run/image0", 32, 47, res_troop.RUN.ARM_4.LEFT);
        this.addAnimationToTarget("res/Troops/ARM_4_1/ARM_4_1/run/image0", 48, 63, res_troop.RUN.ARM_4.UP_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_4_1/ARM_4_1/run/image0", 64, 79, res_troop.RUN.ARM_4.UP);
        this.addAnimationToTarget("res/Troops/ARM_4_1/ARM_4_1/run/image0", 80, 95, res_troop.RUN.ARM_4.DOWN_RIGHT);
        this.addAnimationToTarget("res/Troops/ARM_4_1/ARM_4_1/run/image0", 96, 111, res_troop.RUN.ARM_4.RIGHT);
        this.addAnimationToTarget("res/Troops/ARM_4_1/ARM_4_1/run/image0", 112, 127, res_troop.RUN.ARM_4.UP_RIGHT);

        //ARM_6 run
        this.addAnimationToTarget("res/Troops/ARM_6_1/run/image0", 0, 15, res_troop.RUN.ARM_6.DOWN);
        this.addAnimationToTarget("res/Troops/ARM_6_1/run/image0", 16, 31, res_troop.RUN.ARM_6.DOWN_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_6_1/run/image0", 32, 47, res_troop.RUN.ARM_6.LEFT);
        this.addAnimationToTarget("res/Troops/ARM_6_1/run/image0", 48, 63, res_troop.RUN.ARM_6.UP_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_6_1/run/image0", 64, 79, res_troop.RUN.ARM_6.UP);

        //ARM_1 attack
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/attack01/image0", 0, 12, res_troop.ATTACK.ARM_1.DOWN);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/attack01/image0", 13, 25, res_troop.ATTACK.ARM_1.DOWN_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/attack01/image0", 26, 38, res_troop.ATTACK.ARM_1.LEFT);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/attack01/image0", 39, 51, res_troop.ATTACK.ARM_1.UP_LEFT);
        this.addAnimationToTarget("res/Troops/ARM_1_1/ARM_1_1/attack01/image0", 52, 64, res_troop.ATTACK.ARM_1.UP);
    },
    createAnimation: function () {
        //DEAD_EFFECT
    },
    addAnimationToTarget: function (link, start, end, target) {
        let animation = new cc.Animation();
        for (var i = start; i <= end; i++) {
            let res;
            if (i < 10)
                res = link + "00" + i + ".png";
            else if (i < 100)
                res = link + "0" + i + ".png";
            else
                res = link + i + ".png";
            target[i - start] = res;
            // cc.log("RES:::::::::::", res);
            animation.addSpriteFrameWithFile(res);
        }
        //loop in 1s

        animation.setDelayPerUnit(1/(end-start+1));
        animation.setRestoreOriginalFrame(true);
        target.ANIM = cc.animate(animation).repeatForever();
        target.ANIM.retain();
    }
});

LoadManager.getInstance = function () {
    if (LoadManager.instance == null) {
        LoadManager.instance = new LoadManager();
        LoadManager.instance.retain();

    }
    return LoadManager.instance;
}

var res_troop = {
    RUN: {
        ARM_1: {
            DOWN: {
                //0000 -> 0013
                1: "res/Troops/ARM_1_1/ARM_1_1/run/image0000.png",
            },
            DOWN_LEFT: {
                //0014 -> 0027
                1: "res/Troops/ARM_1_1/ARM_1_1/run/image0014.png",
            },
            LEFT: {
                //0028 -> 0041
                1: "res/Troops/ARM_1_1/ARM_1_1/run/image0028.png",
            },
            UP_LEFT: {
                //0042 -> 0055
                1: "res/Troops/ARM_1_1/ARM_1_1/run/image0042.png",
            },
            UP: {
                //0056 -> 0069
                1: "res/Troops/ARM_1_1/ARM_1_1/run/image0056.png",
            },
            RIGHT: {
                //0070 -> 0083
                1: "res/Troops/ARM_1_1/ARM_1_1/run/image0070.png",
            },
            UP_RIGHT: {
                //0084 -> 0097
                1: "res/Troops/ARM_1_1/ARM_1_1/run/image0084.png",
            },
            DOWN_RIGHT: {
                //0098 -> 0111
                1: "res/Troops/ARM_1_1/ARM_1_1/run/image0098.png",
            }
        },
        ARM_2: {
            DOWN: {
                //0000 -> 0015
                1: "res/Troops/ARM_2_1/ARM_2_1/run/image0000.png",
            },
            DOWN_LEFT: {
                //0016 -> 0031
            },
            LEFT: {
                //0032 -> 0047
            },
            UP_LEFT: {
                //0048 -> 0063
            },
            UP: {
                //0064 -> 0079
            },
            DOWN_RIGHT: {
                //0080 -> 0095
            },
            RIGHT: {
                //0096 -> 0111
            },
            UP_RIGHT: {
                //0112 -> 0127
            }
        },
        ARM_3: {
            DOWN: {
                //0000 -> 0011
                1: "res/Troops/ARM_3_1/ARM_3_1/run/image0000.png",
            },
            DOWN_LEFT: {
                //0012 -> 0023
            },
            LEFT: {
                //0024 -> 0035
            },
            UP_LEFT: {
                //0036 -> 0047
            },
            UP: {
                //0048 -> 0059
            },
            DOWN_RIGHT: {
                //0060 -> 0071
            },
            UP_RIGHT: {
                //0072 -> 0083
            },
            RIGHT: {
                //0084 -> 0095
            }
        },
        ARM_4: {
            DOWN: {
                //0000 -> 0015
                1: "res/Troops/ARM_4_1/ARM_4_1/run/image0000.png",
            },
            DOWN_LEFT: {
                //0016 -> 0031
            },
            LEFT: {
                //0032 -> 0047
            },
            UP_LEFT: {
                //0048 -> 0063
            },
            UP: {
                //0064 -> 0079
            },
            DOWN_RIGHT: {
                //0080 -> 0095
            },
            RIGHT: {
                //0096 -> 0111
            },
            UP_RIGHT: {
                //0112 -> 0127
            }
        },
        ARM_6: {
            DOWN: {
                //0000 -> 0015
                1: "res/Troops/ARM_6_1/run/image0000.png",
            },
            DOWN_LEFT: {
                //0016 -> 0031
            },
            LEFT: {
                //0032 -> 0047
            },
            UP_LEFT: {
                //0048 -> 0063
            },
            UP: {
                //0064 -> 0079
            }
        }

    },
    ATTACK:{
        ARM_1: {
            DOWN: {
                //0000 -> 0012
                1: "res/Troops/ARM_1_1/ARM_1_1/attack01/image0000.png",
            },
            DOWN_LEFT: {
                //0013 -> 0025
            },
            LEFT: {
                //0026 -> 0038
            },
            UP_LEFT: {
                //0039 -> 0051
            },
            UP: {
                //0052 -> 0064
            }

        }
    },
    SHADOW: {
        SMALL: "res/Map/map_obj_bg/1x1_bong.png",
        BIG: "res/Map/map_obj_bg/big_shadow_troop.png"
    }
}
var effect= {
    RIP: "res/battle/rip_elixir.png",
    GHOST: "res/battle/ghost.png",
    // DEAD_EFFECT: null,
}