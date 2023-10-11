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
                this.onReceivedCheckBuyBuilding(packet);
                break;
            case gv.CMD.REMOVE_OBSTACLE:
                cc.log("REMOVE_OBSTACLE", packet);
                this.onReceivedRemoveObstacle(packet);
                break;
            case gv.CMD.REMOVE_OBSTACLE_SUCCESS:
                cc.log("REMOVE_OBSTACLE_SUCCESS", packet);
                this.onReceivedRemoveObstacleSuccess(packet);
                break;
            case gv.CMD.UPGRADE_BUILDING:
                cc.log("UPGRADE_BUILDING", packet);
                this.onReceivedUpgradeBuilding(packet);
                break;
            case gv.CMD.UPGRADE_SUCCESS:
                cc.log("UPGRADE_BUILDING_SUCCESS", packet);
                this.onReceivedUpgradeBuildingSuccess(packet);
                break;
            case gv.CMD.BUILD_SUCCESS:
                cc.log("BUILD_BUILDING_SUCCESS", packet);
                this.onReceivedBuildBuildingSuccess(packet);
                break;
            case gv.CMD.COLLECT_RESOURCE:
                cc.log("COLLECT_RESOURCE", packet);
                this.onReceivedHarvest(packet);
                break;
        }
    },

    onReceiveTrainTroopSuccess: function(packet) {
        if(packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("TRAIN TROOP REQUEST ERROR with code ::::::::: ", packet.getError());
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

        }
    },

    onReceiveGetTrainingList :function (packet) {
        if(packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("GET TRAINING LIST ERROR :::::::::::", packet.getError());
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
                    trainingPopup.getPage({barackId: packet.barrackId}).initTrainingList();
                    return;
                }
            }
        }
    },

    onReceiveCancleTrain: function (packet) {
        if(packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("TRAIN TROOP REQUEST ERROR with code ::::::::: ", packet.getError());
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

    onReceivedCheckBuyBuilding: function (packet) {
        if(packet.error !== 0) {
            cc.log("BUY BUILDING ERROR with code ::::::::: ", packet.error);
        }
        else {
            cc.log("BUY BUILDING SUCCESS ::::::::: ");
            //log all packet
            cc.log("packet: ", JSON.stringify(packet, null, 2));
            let mapLayer = cc.director.getRunningScene().mapLayer;

            mapLayer.exitModeBuyBuilding();
            let building = getBuildingFromType(packet.type, 1, packet.id, packet.posX, packet.posY,packet.status,packet.startTime,packet.endTime);
            MapManager.Instance().addBuilding(building);
            mapLayer.addBuildingToLayer(building);
            building.build(packet.startTime, packet.endTime);
            //bat lai info
        }
    },
    onReceivedRemoveObstacle: function (packet) {
      if(packet.error !==0){
          cc.log("REMOVE OBSTACLE ERROR with code ::::::::: ", packet.error);
      }
      else
      {
          cc.log("REMOVE OBSTACLE SUCCESS ::::::::: ");
          let obstacle = MapManager.Instance().getBuildingById(packet.id);
          obstacle.startRemove(packet.startTime, packet.endTime);
      }
    },
    onReceivedRemoveObstacleSuccess: function (packet) {
        if(packet.error !==0){
            cc.log("REMOVE OBSTACLE SUCCESS ERROR with code ::::::::: ", packet.error);
        }
        else
        {
            cc.log("REMOVE OBSTACLE SUCCESS SUCCESS ::::::::: ");
            let obstacle = MapManager.Instance().getBuildingById(packet.id);
            obstacle.completeRemove();
        }
    },
    onReceivedUpgradeBuilding: function (packet) {
        if(packet.error !==0){
            cc.log("UPGRADE BUILDING ERROR with code ::::::::: ", packet.error);
        }
        else
        {
            cc.log(JSON.stringify(packet, null, 2));
            cc.log("UPGRADE BUILDING SUCCESS ::::::::: ");
            let building = MapManager.Instance().getBuildingById(packet.id);
            building.upgrade(packet.startTime, packet.endTime);
        }
    },
    onReceivedUpgradeBuildingSuccess: function (packet) {
        if(packet.error !==0){
            cc.log("UPGRADE BUILDING SUCCESS ERROR with code ::::::::: ", packet.error);
        }
        else
        {
            cc.log("UPGRADE BUILDING SUCCESS SUCCESS ::::::::: ");
            let building = MapManager.Instance().getBuildingById(packet.id);
            building.completeUpgrade();
        }
    },
    onReceivedBuildBuildingSuccess: function (packet) {
        if(packet.error !==0){
            cc.log("BUILD BUILDING SUCCESS ERROR with code ::::::::: ", packet.error);
        }
        else
        {
            cc.log("BUILD BUILDING SUCCESS SUCCESS ::::::::: ");
            let building = MapManager.Instance().getBuildingById(packet.id);
            building.completeBuild();
        }
    },
    //+ api collect resource: 2007
    //   input: id
    //   output: error, id, gold, elixir, lastCollectTime
    onReceivedHarvest: function (packet) {
        cc.log("packet: ", JSON.stringify(packet, null, 2)  );
        if(packet.error !==0){
            cc.log("HARVEST ERROR with code ::::::::: ", packet.error);
        }
        else
        {
            cc.log("HARVEST SUCCESS ::::::::: ");
            let building = MapManager.Instance().getBuildingById(packet.id);
            building.harvest(packet.lastCollectTime, packet.gold, packet.elixir);
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
        cc.log("SEND train troop create request");
        var pk = this.gameClient.getOutPacket(CmdSendCancleTrain);
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },

    sendRequestTrainingSuccess: function (data) {
        var pk = this.gameClient.getOutPacket(CmdSendTrainTroopSuccess);
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },

    sendGetTrainingList : function (data) {
        var pk = this.gameClient.getOutPacket(CmdSendGetTrainingList);
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },

    //quyet-------------------------------------------------------------------
    sendMoveBuilding: function(id, posX, posY) {
        cc.log("SEND move building request");
        var pk = this.gameClient.getOutPacket(CmdSendMoveBuilding);
        pk.pack({id,posX, posY});
        this.gameClient.sendPacket(pk);
    },
    sendBuyBuilding: function (type, posX, posY) {
        cc.log("SEND buy building request");
        var pk = this.gameClient.getOutPacket(CmdSendBuyBuilding);
        pk.pack({type, posX, posY});
        this.gameClient.sendPacket(pk);
    },
    sendRemoveObstacle: function (id) {
        cc.log("SEND remove obstacle request");
        var pk = this.gameClient.getOutPacket(CmdSendRemoveObstacle);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    },
    sendRemoveObstacleSuccess: function (id) {
        cc.log("SEND remove obstacle success");
        var pk = this.gameClient.getOutPacket(CmdSendRemoveObstacleSuccess);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    },
    sendUpgradeBuilding: function (id) {
        cc.log("SEND upgrade building request");
        var pk = this.gameClient.getOutPacket(CmdSendUpgradeBuilding);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    },
    sendBuildBuildingSuccess: function (id) {
        cc.log("SEND build building success");
        var pk = this.gameClient.getOutPacket(CmdSendBuildBuildingSuccess);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    },
    sendUpgradeBuildingSuccess: function (id) {
        cc.log("SEND upgrade building success");
        var pk = this.gameClient.getOutPacket(CmdSendUpgradeBuildingSuccess);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    },
    sendHarvest: function (id) {
        cc.log("SEND harvest request");
        var pk = this.gameClient.getOutPacket(CmdSendHarvest);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    }

});



