/**
 * Created by KienVN on 10/2/2017.
 */

var gv = gv || {};
var testnetwork = testnetwork || {};

testnetwork.Connector = cc.Class.extend({
    ctor: function (gameClient) {
        this.gameClient = gameClient;
        gameClient.packetFactory.addPacketMap(testnetwork.packetMap);
        gameClient.receivePacketSignal.add(this.onReceivedPacket, this);
    },
    onReceivedPacket: function (cmd, packet) {
        cc.log("onReceivedPacket:", cmd);
        switch (cmd) {
            case gv.CMD.HAND_SHAKE:
                this.sendLoginRequest(PlayerInfoManager.id);
                break;
            case gv.CMD.USER_LOGIN:
                // this.sendGetUserInfo();
                fr.getCurrentScreen().onFinishLogin();
                break;
            case gv.CMD.USER_INFO:
                fr.getCurrentScreen().onReceiveUserInfo(packet);
                break;
                case gv.CMD.MAP_INFO:
                fr.getCurrentScreen().onReceiveMapInfo(packet);
                break;
            case gv.CMD.BUY_ITEM:
                fr.getRunningScene().onBuyItemSuccess(packet);
                break;
            case gv.CMD.MOVE:
                cc.log("MOVE:", packet.x, packet.y);
                fr.getCurrentScreen().updateMove(packet.x, packet.y);
                break;
        }
    },
    sendGetUserInfo: function () {
        cc.log("sendGetUserInfo");
        var pk = this.gameClient.getOutPacket(CmdSendUserInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendGetMapInfo: function () {
        cc.log("sendGetMapInfo");
        var pk = this.gameClient.getOutPacket(CmdSendMapInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendLoginRequest: function (uid) {
        cc.log("sendLoginRequest");
        var pk = this.gameClient.getOutPacket(CmdSendLogin);
        pk.pack(uid);
        this.gameClient.sendPacket(pk);
    },
    sendBuyItemRequest: function (itemData) {
        cc.log("SEND buy item request");
        var pk = this.gameClient.getOutPacket(Cmd);
        pk.pack(uid);
        this.gameClient.sendPacket(pk);
    },
    sendMove: function (direction) {
        cc.log("SendMove:" + direction);
        var pk = this.gameClient.getOutPacket(CmdSendMove);
        pk.pack(direction);
        this.gameClient.sendPacket(pk);
    }
});



