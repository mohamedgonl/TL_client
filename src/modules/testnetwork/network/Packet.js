/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD || {};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.MAP_INFO = 1002;
gv.CMD.ARMY_INFO = 1004;
gv.CMD.CHEAT_RESOURCE = 1900;
gv.CMD.MOVE = 9999;
gv.CMD.BUY_RESOURCE = 4001;
gv.CMD.TRAIN_TROOP_CREATE = 5001;
gv.CMD.TRAIN_TROOP_SUCCESS = 5002;
gv.CMD.GET_TRAINING_LIST = 5003;
gv.CMD.CANCLE_TRAINING = 5004;
gv.CMD.FIND_MATCH = 6001;
gv.CMD.DO_ACTION = 6002;
gv.CMD.END_BATTLE = 6003;

//quyet----------------------
gv.CMD.REMOVE_OBSTACLE = 2009;
gv.CMD.CANCEL_BUILD = 2002;
gv.CMD.BUILD_SUCCESS = 2003;
gv.CMD.UPGRADE_BUILDING = 2004;
gv.CMD.CANCEL_UPGRADE = 2005;
gv.CMD.UPGRADE_SUCCESS = 2006;
gv.CMD.COLLECT_RESOURCE = 2007;
gv.CMD.MOVE_BUILDING = 2008;
gv.CMD.BUY_BUILDING = 2001;
gv.CMD.REMOVE_OBSTACLE_SUCCESS = 2010;
gv.CMD.QUICK_FINISH = 2013;
gv.CMD.BUY_RESOURCE_BY_GEM = 4002;
gv.CMD.GET_TIME_SERVER = 1003;
//quyet----------------------


testnetwork = testnetwork || {};
testnetwork.packetMap = {};

/** Outpacket */

//Handshake
CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
            this.setCmdId(gv.CMD.HAND_SHAKE);
        },
        putData: function () {
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
)

CmdSendUserInfo = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_INFO);
        },
        pack: function () {
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendMapInfo = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MAP_INFO);
        },
        pack: function () {
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendArmyInfo = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.ARMY_INFO);
        },
        pack: function () {
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendLogin = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_LOGIN);
        },
        pack: function (uid) {
            this.packHeader();
            this.putInt(uid);
            this.updateSize();
        }
    }
)
CmdSendBuyItem = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.BUY_RESOURCE);
        },
        pack: function (itemData) {
            this.packHeader();
            this.putString(itemData.cfgId)
            this.updateSize();
        }
    }
)

CmdSendTrainTroopCreate = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.TRAIN_TROOP_CREATE);
        },
        pack: function (data) {
            this.packHeader();
            this.putString(data.cfgId);
            this.putInt(data.count);
            this.putInt(data.barrackId);
            this.updateSize();
        }
    }
)

CmdSendTrainTroopSuccess = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.TRAIN_TROOP_SUCCESS);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.isDoneNow);
            this.putInt(data.barrackId);
            this.updateSize();
        }
    }
)

CmdSendMoveBuilding = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MOVE_BUILDING);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.putShort(data.posX);
            this.putShort(data.posY);
            this.updateSize();
        }
    }
)
CmdSendBuyBuilding = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.BUY_BUILDING);
        },
        pack: function (data) {
            this.packHeader();
            this.putString(data.type);
            this.putShort(data.posX);
            this.putShort(data.posY);
            this.updateSize();
        }
    }
)

CmdSendRemoveObstacle = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.REMOVE_OBSTACLE);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.updateSize();
        }
    }
)
CmdSendRemoveObstacleSuccess = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.REMOVE_OBSTACLE_SUCCESS);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.updateSize();
        }
    }
)

CmdSendGetTrainingList = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.GET_TRAINING_LIST);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.barrackId);
            this.updateSize();
        }
    }
)

CmdSendCancleTrain = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CANCLE_TRAINING);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.barrackId);
            this.putString(data.cfgId);
            this.updateSize();
        }
    }
)

CmdSendUpgradeBuilding = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.UPGRADE_BUILDING);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.updateSize();
        }
    })

CmdSendBuildBuildingSuccess = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.BUILD_SUCCESS);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.updateSize();
        }
    })

CmdSendUpgradeBuildingSuccess = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.UPGRADE_SUCCESS);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.updateSize();
        }
    });

CmdSendHarvest = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.COLLECT_RESOURCE);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.updateSize();
        }
    });


CmdSendCheatResource = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEAT_RESOURCE);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.gold);
            this.putInt(data.elixir);
            this.putInt(data.gem);
            this.updateSize();
        }
    }
)


CmdSendCancelBuild = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CANCEL_BUILD);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.updateSize();
        }
    });
CmdSendCancelUpgrade = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CANCEL_UPGRADE);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.updateSize();
        }
    });
CmdSendQuickFinish = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.QUICK_FINISH);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.id);
            this.updateSize();
        }
    });
CmdSendBuyResourceByGem = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.BUY_RESOURCE_BY_GEM);
        },
        pack: function (data) {
            this.packHeader();
            this.putInt(data.gold);
            this.putInt(data.elixir);
            this.updateSize();
        }
    })
CmdSendGetTimeServer = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.GET_TIME_SERVER);
        },
        pack: function () {
            this.packHeader();
            this.updateSize();
        }
    })
CmdSendFindMatch = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.FIND_MATCH);
        },
        pack: function () {
            this.packHeader();
            this.updateSize();
        }
    })
CmdSendDoAction = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.DO_ACTION);
        },
        pack: function ({type, tick, data}) {
            this.packHeader();
            this.putInt(type);
            this.putInt(tick);
            if (this.type === ACTION_TYPE.DROP_TROOP && data) {
                this.putString(data.troopType);
                this.putInt(data.posX);
                this.putInt(data.posY);
            }
            this.updateSize();
        }
    })

CmdSendEndBattle = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.END_BATTLE);
        },
        pack: function ({result, starAmount, trophyAmount, robbedGold, robbedElixir, listTroops, tick}) {
            this.packHeader();
            this.putInt(result ? 1 : 0);
            this.putInt(starAmount);
            this.putInt(trophyAmount);
            this.putInt(robbedGold);
            this.putInt(robbedElixir);
            this.putInt(listTroops.length);
            for (let troop of listTroops) {
                this.putString(troop.type);
                this.putInt(troop.amount);
            }
            this.putInt(tick);
            this.updateSize();
        }
    })


/**
 * InPacket
 */

//Handshake
testnetwork.packetMap[gv.CMD.HAND_SHAKE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.error = this.getError();
            this.token = this.getString();
        }
    }
);

testnetwork.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {

        }
    }
);


testnetwork.packetMap[gv.CMD.USER_INFO] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.name = this.getString();
            this.avatar = this.getString();
            this.level = this.getInt();
            this.rank = this.getInt();
            this.gold = this.getInt();
            this.elixir = this.getInt();
            this.gem = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.ARMY_INFO] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            const size = this.getInt();
            this.listTroops = {};
            for (let i = 0; i < size; i++) {
                const type = this.getString();
                const amount = this.getInt();
                this.listTroops[type] = amount;
            }
        }
    }
);

testnetwork.packetMap[gv.CMD.CHEAT_RESOURCE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.gold = this.getInt();
                this.elixir = this.getInt();
                this.gem = this.getInt();
            }
        }
    }
);

testnetwork.packetMap[gv.CMD.BUY_RESOURCE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.gold = this.getInt();
            this.elixir = this.getInt();
            this.gem = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.TRAIN_TROOP_CREATE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.barrackId = this.getInt();
            this.cfgId = this.getString();
            this.count = this.getInt();
            this.lastTrainingTime = this.getInt();
            this.newElixir = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.TRAIN_TROOP_SUCCESS] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.isDoneNow = this.getInt();
            this.barrackId = this.getInt();
            this.cfgId = this.getString();
            this.lastTrainingTime = this.getInt();
            this.gem = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.CANCLE_TRAINING] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.barrackId = this.getInt();
            this.cfgId = this.getString();
            this.lastTrainingTime = this.getInt();
            this.additionElixir = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.GET_TRAINING_LIST] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.barrackId = this.getInt();
            this.lastTrainingTime = this.getInt();
            let trainingListSize = this.getInt();
            let _trainingList = [];
            for (let i = 0; i < trainingListSize; i++) {
                let item = {};
                item.cfgId = this.getString();
                item.count = this.getInt();
                _trainingList.push(item);
            }
            let _doneList = []
            let doneListSize = this.getInt();
            cc.log("DONE LIST SIZE ::: ", doneListSize)
            for (let i = 0; i < doneListSize; i++) {
                let item = {};
                item.cfgId = this.getString();
                item.count = this.getInt();
                _doneList.push(item);
            }
            this.doneList = _doneList;

            cc.log("NHẬN DONE ::::::::::::::::::::::::" + JSON.stringify(_doneList));
            cc.log("NHẬN QUEUE ::::::::::::::::::::::::" + JSON.stringify(_trainingList));
            this.trainingList = _trainingList;

        }
    }
);

testnetwork.packetMap[gv.CMD.MAP_INFO] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            const size = this.getInt();
            this.listBuildings = [];
            for (let i = 0; i < size; i++) {
                const building = {
                    id: this.getInt(),
                    level: this.getInt(),
                    type: this.getString(),
                    posX: this.getInt(),
                    posY: this.getInt(),
                    status: this.getShort(),
                    startTime: this.getInt(),
                    endTime: this.getInt()
                };
                if (building.type.startsWith("RES"))
                    building.lastCollectTime = this.getInt();
                this.listBuildings.push(building);
            }
        }
    }
);

testnetwork.packetMap[gv.CMD.MOVE_BUILDING] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.error = this.getError();
        }
    }
);

testnetwork.packetMap[gv.CMD.BUY_BUILDING] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();

        },
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
                this.type = this.getString();
                this.posX = this.getShort();
                this.posY = this.getShort();
                this.status = this.getShort();
                this.startTime = this.getInt();
                this.endTime = this.getInt();
            }
        }
    }
);

testnetwork.packetMap[gv.CMD.REMOVE_OBSTACLE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();

        },
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
                this.status = this.getShort();
                this.startTime = this.getInt();
                this.endTime = this.getInt();
            }
        }
    })

testnetwork.packetMap[gv.CMD.REMOVE_OBSTACLE_SUCCESS] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();

        },
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
            }
        }
    }
)
testnetwork.packetMap[gv.CMD.UPGRADE_BUILDING] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();

        },
        // output: error, id, status(short), startTime, endTime
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
                this.status = this.getShort();
                this.startTime = this.getInt();
                this.endTime = this.getInt();
            }
        }
    });

testnetwork.packetMap[gv.CMD.BUILD_SUCCESS] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();

        },
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
            }
        }
    })

testnetwork.packetMap[gv.CMD.UPGRADE_SUCCESS] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
            }
        }
    })
testnetwork.packetMap[gv.CMD.COLLECT_RESOURCE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
                this.lastCollectTime = this.getInt();
                this.gold = this.getInt();
                this.elixir = this.getInt();

            }
        }
    });

testnetwork.packetMap[gv.CMD.CANCEL_BUILD] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        //error, id
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
            }
        }
    });

testnetwork.packetMap[gv.CMD.CANCEL_UPGRADE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        //error, id
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
            }
        }
    });

testnetwork.packetMap[gv.CMD.QUICK_FINISH] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.id = this.getInt();
                this.gem = this.getInt();
            }
        }
    });
testnetwork.packetMap[gv.CMD.BUY_RESOURCE_BY_GEM] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        //gem
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.gem = this.getInt();
                this.gold = this.getInt();
                this.elixir = this.getInt();
            }
        }
    });

testnetwork.packetMap[gv.CMD.GET_TIME_SERVER] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        //error,time
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.time = this.getInt();
            }
        }
    });

testnetwork.packetMap[gv.CMD.FIND_MATCH] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.error = this.getError();
            if (this.error === 0) {
                this.matchId = this.getInt();
                this.enemyId = this.getInt();
                this.enemyName = this.getString();
                this.availableGold = this.getInt();
                this.availableElixir = this.getInt();

                const buildingSize = this.getInt();
                this.buildings = [];

                for (let i = 0; i < buildingSize; i++) {
                    let id = this.getInt();
                    let type = this.getString();
                    let level = this.getInt();
                    let posX = this.getInt();
                    let posY = this.getInt();
                    this.buildings.push({id, type, level, posX, posY});
                }

                const troopSize = this.getInt();
                this.troops = [];

                for (let i = 0; i < troopSize; i++) {
                    let type = this.getString();
                    let amount = this.getInt();
                    this.troops.push({type, amount});
                }

                this.winPoint = this.getInt();
                this.losePoint = this.getInt();
                this.gold = this.getInt();
                this.goldCapacity = this.getInt();
                this.elixir = this.getInt();
                this.elixirCapacity = this.getInt();
                this.gem = this.getInt();
            }
        }
    }
);
testnetwork.packetMap[gv.CMD.DO_ACTION] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.error = this.getError();
        }
    }
);