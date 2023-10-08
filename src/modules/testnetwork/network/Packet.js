/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD || {};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.MAP_INFO = 1002;
gv.CMD.MOVE = 2001;
gv.CMD.BUY_RESOURCE = 4001;
gv.CMD.TRAIN_TROOP_CREATE = 5001;
gv.CMD.TRAIN_TROOP_SUCCESS = 5002;
gv.CMD.GET_TRAINING_LIST = 5003;
gv.CMD.CANCLE_TRAINING = 5004;



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

CmdSendLogin= fr.OutPacket.extend(
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
            this.putInt(data.barrackId)
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
            cc.log("PACKET ::::: ",data.isDoneNow, data.barrackId);
            this.packHeader();
            this.putInt(data.isDoneNow);
            this.putInt(data.barrackId);
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



CmdSendMove = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MOVE);
        },
        pack: function (direction) {
            this.packHeader();
            this.putShort(direction);
            this.updateSize();
        }
    }
)

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
                item.cfgId  = this.getString();
                item.count = this.getInt();
                _trainingList.push(item);
            }
            cc.log("NHẬN QUEUE ::::::::::::::::::::::::" + JSON.stringify(_trainingList) );
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
                };
                if (building.type.startsWith("RES"))
                    building.lastCollectTime = this.getInt();
                this.listBuildings.push(building);
            }
        }
    }
);


testnetwork.packetMap[gv.CMD.MOVE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.x = this.getInt();
            this.y = this.getInt();
        }
    }
);




