/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD || {};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.MAP_INFO = 1002;
gv.CMD.MOVE = 2001;
gv.CMD.BUY_ITEM = 3001;

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
            this.setCmdId(gv.CMD.BUY_ITEM);
        },
        pack: function (itemData) {
            this.packHeader();
            this.putString(itemData.id)
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
                };
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




