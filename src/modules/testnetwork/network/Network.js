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
                this.sendLoginRequest(PlayerInfoManager.Instance().id);
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
            case gv.CMD.CHEAT_RESOURCE:
                if (packet.error === 0)
                    PlayerInfoManager.Instance().setResource({
                        gold: packet.gold,
                        elixir: packet.elixir,
                        gem: packet.gem,
                    });
                break;
            case gv.CMD.BUY_RESOURCE:
                cc.director.getRunningScene().onBuyResourceSuccess(packet);
                break;
            case gv.CMD.TRAIN_TROOP_CREATE:
                this.onReceiveTrainTroopCreate(packet);
                break;
            case gv.CMD.TRAIN_TROOP_SUCCESS:
                this.onReceiveTrainTroopSuccess(packet);
                break;
            case gv.CMD.CANCLE_TRAINING:
                this.onReceiveCancleTrain(packet);
                break;
            case gv.CMD.GET_TRAINING_LIST:
                this.onReceiveGetTrainingList(packet);
                break;
            case gv.CMD.MOVE:
                cc.log("MOVE:", packet.x, packet.y);
                fr.getCurrentScreen().updateMove(packet.x, packet.y);
                break;
            case gv.CMD.MOVE_BUILDING:
                cc.log("MOVE_BUILDING", packet);
                cc.director.getRunningScene().mapLayer.onReceivedCheckMoveBuilding(packet);
                break;
            case gv.CMD.BUY_BUILDING:
                cc.log("BUY_BUILDING", packet);
                cc.director.getRunningScene().mapLayer.onReceivedCheckBuyBuilding(packet);
                break;
            case gv.CMD.MOVE:
                cc.log("MOVE:", packet.x, packet.y);
                // fr.getCurrentScreen().updateMove(packet.x, packet.y);
                break;
        }
    },

    onReceiveTrainTroopSuccess: function(packet) {
        if(packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("TRAIN TROOP REQUEST ERROR with code ::::::::: ", packet.getError());
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();

            trainingPopup.getPage({barackId: packet.barrackId}).updateUI(1);
        }
        else {
            cc.log("TRAIN TROOP DONE REQUEST SUCCESS ::::::::: ");
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();
            let trainingPage = trainingPopup.getPage({barackId: packet.barrackId});
            if(packet.isDoneNow) {
                trainingPage.onDoneNowSuccess(packet);
            }
            else {
                trainingPage.onTrainSuccess(packet);
            }
        }
    },

    onReceiveTrainTroopCreate: function (packet) {
        if(packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("TRAIN TROOP REQUEST ERROR with code ::::::::: ", packet.getError());
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();
            cc.log(packet.barrackId)
            trainingPopup.getPage({barackId: packet.barrackId}).updateUI(1);
        }
        else {
            cc.log("TRAIN TROOP CREATE REQUEST SUCCESS ::::::::: ");
            let event = {}
            event.data = {
                barrackId: packet.barrackId,
                cfgId: packet.cfgId,
                count: packet.count,
                lastTrainingTime: packet.lastTrainingTime
            }
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();
            trainingPopup.getPage({barackId: packet.barrackId}).onCanCreateTrain([event]);

            PlayerInfoManager.Instance().setResource({elixir: packet.newElixir})

        }
    },

    onReceiveGetTrainingList :function (packet) {
        if(packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("GET TRAINING LIST ERROR :::::::::::", packet.getError());
            ArmyManager.Instance();
        }
        else {
            cc.log("GET TRAINING LIST SUCCESS :::::::::::");
            let barracks = ArmyManager.Instance().getBarrackList();
            for (let i = 0; i < barracks.length; i++) {
                if(barracks[i].getId() === packet.barrackId) {
                    barracks[i].setTrainingList(packet.trainingList);
                    barracks[i].setLastTrainingTime(packet.lastTrainingTime);
                    let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
                    let trainingPopup = popUpLayer.getTrainingPopup();
                    cc.log("TRAIN : " + trainingPopup._trainPages)
                    trainingPopup.getPage({barackId: packet.barrackId}).initTrainingList();
                    return;
                }
            }
        }
    },

    onReceiveCancleTrain: function (packet) {
        if(packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("TRAIN TROOP REQUEST ERROR with code ::::::::: ", packet.getError());
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();

            trainingPopup.getPage({barackId: packet.barrackId}).updateUI(1);
        }
        else {
            cc.log("TRAIN TROOP CANCLE REQUEST SUCCESS ::::::::: ");
            let event = {}
            event.data = {
                barrackId: packet.barrackId,
                cfgId: packet.cfgId,
                lastTrainingTime: packet.lastTrainingTime,
            }
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();
            PlayerInfoManager.Instance().addResource({elixir: event.data.additionElixir});
            trainingPopup.getPage({barackId: packet.barrackId}).onCancelTrainTroopSuccess(event);

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
    sendCheatResource: function (dataRes) {
        cc.log("send cheat res");
        var pk = this.gameClient.getOutPacket(CmdSendCheatResource);
        const data = {
            gold: dataRes.gold >= 0 ? dataRes.gold : -1,
            elixir: dataRes.elixir >= 0 ? dataRes.elixir : -1,
            gem: dataRes.gem >= 0 ? dataRes.gem : -1,
        }
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },
    sendLoginRequest: function (uid) {
        cc.log("sendLoginRequest");
        var pk = this.gameClient.getOutPacket(CmdSendLogin);
        pk.pack(uid);
        this.gameClient.sendPacket(pk);
    },

    sendBuyResourceRequest: function (itemData) {
        cc.log("SEND buy resource request");
        var pk = this.gameClient.getOutPacket(CmdSendBuyItem);
        pk.pack(itemData);
        this.gameClient.sendPacket(pk);
    },

    sendRequestTrainingCreate: function (data) {
        cc.log("SEND train troop create request");
        var pk = this.gameClient.getOutPacket(CmdSendTrainTroopCreate);
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },

    sendRequestCancleTrain: function (data) {
        cc.log("SEND train troop cancel request");
        var pk = this.gameClient.getOutPacket(CmdSendCancleTrain);
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },

    sendRequestTrainingSuccess: function (data) {
        var pk = this.gameClient.getOutPacket(CmdSendTrainTroopSuccess);
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },

    sendGetTrainingList: function (data) {
        var pk = this.gameClient.getOutPacket(CmdSendGetTrainingList);
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },
    sendMoveBuilding: function (id, posX, posY) {
        cc.log("SEND move building request");
        var pk = this.gameClient.getOutPacket(CmdSendMoveBuilding);
        pk.pack({id, posX, posY});
        this.gameClient.sendPacket(pk);
    },
    sendBuyBuilding: function (type, posX, posY) {
        cc.log("SEND buy building request");
        var pk = this.gameClient.getOutPacket(CmdSendBuyBuilding);
        pk.pack({type, posX, posY});
        this.gameClient.sendPacket(pk);

    },

    sendMove: function (direction) {
        // cc.log("SendMove:" + direction);
        // var pk = this.gameClient.getOutPacket(CmdSendMove);
        // pk.pack(direction);
        // this.gameClient.sendPacket(pk);
    }
});



