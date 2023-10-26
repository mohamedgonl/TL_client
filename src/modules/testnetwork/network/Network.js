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
                this.sendLoginRequest(PlayerInfoManager.getInstance().id);
                break;
            case gv.CMD.USER_LOGIN:
                // this.sendGetUserInfo();
                if (typeof cc.director.getRunningScene().onFinishLogin === 'function') {
                    cc.director.getRunningScene().onFinishLogin();
                }
                break;
            case gv.CMD.USER_INFO:
                cc.director.getRunningScene().onReceiveUserInfo(packet);
                break;
            case gv.CMD.MAP_INFO:
                cc.director.getRunningScene().onReceiveMapInfo(packet);
                break;
            case gv.CMD.ARMY_INFO:
                cc.director.getRunningScene().onReceiveArmyInfo(packet);
                break;
            case gv.CMD.CHEAT_RESOURCE:
                if (packet.error === 0)
                    cc.log("CHEAT RESOURCE SUCCESS", JSON.stringify(packet, null, 2));
                PlayerInfoManager.getInstance().setResource({
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
                cc.director.getRunningScene().updateMove(packet.x, packet.y);
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
            case gv.CMD.CANCEL_BUILD:
                cc.log("CANCEL_BUILD", packet);
                this.onReceivedCancelBuild(packet);
                break;
            case gv.CMD.CANCEL_UPGRADE:
                cc.log("CANCEL_UPGRADE", packet);
                this.onReceivedCancelUpgrade(packet);
                break;
            case gv.CMD.QUICK_FINISH:
                cc.log("QUICK_FINISH", packet);
                this.onReceivedQuickFinish(packet);
                break;
            case gv.CMD.BUY_RESOURCE_BY_GEM:
                cc.log("BUY_RESOURCE_BY_GEM", JSON.stringify(packet, null, 2));
                this.onReceivedBuyResourceByGem(packet);
                break;
            case gv.CMD.GET_TIME_SERVER:
                cc.log("GET_TIME_SERVER", JSON.stringify(packet, null, 2));
                if (packet.error === 0)
                    cc.director.getRunningScene().onReceiveTimeServer(packet.time);
                else
                    cc.log("GET_TIME_SERVER ERROR");
                break;
            case gv.CMD.FIND_MATCH:
                // cc.log("FIND MATCH", JSON.stringify(packet, null, 2));
                if (packet.error === ErrorCode.SUCCESS)
                    cc.director.getRunningScene().onFindMatchSuccess(packet);
                else
                    cc.director.getRunningScene().onFindMatchFail(packet.error);
                break;

        }
    },
    onReceiveTrainTroopSuccess: function (packet) {
        if (packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("TRAIN TROOP REQUEST ERROR with code ::::::::: ", packet.getError());
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();

            trainingPopup.getPage({barackId: packet.barrackId}).updateUI(1);
        } else {
            cc.log("TRAIN TROOP DONE REQUEST SUCCESS ::::::::: " + JSON.stringify(packet));
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();
            let trainingPage = trainingPopup.getPage({barackId: packet.barrackId});
            if (packet.isDoneNow) {
                trainingPage.onDoneNowSuccess(packet);
            } else {
                trainingPage.onTrainSuccess(packet);
            }
        }
    },

    onReceiveTrainTroopCreate: function (packet) {
        if (packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("TRAIN TROOP REQUEST ERROR with code ::::::::: ", packet.getError());
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();
            let buildings = ArmyManager.getInstance().getBarrackList();
            cc.log("LIST BUILDING ::: " + JSON.stringify(buildings))
            cc.log(packet.barrackId)
            trainingPopup.getPage({barackId: packet.barrackId}).updateUI(1);
        } else {
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
            // if not long press
            if (packet.count === 1) {
                trainingPopup.getPage({barackId: packet.barrackId}).onCanCreateTrain([event]);
            } else {
                trainingPopup.getPage({barackId: packet.barrackId}).updateUI(1, false)
            }

            PlayerInfoManager.getInstance().setResource({elixir: packet.newElixir})

        }
    },

    onReceiveGetTrainingList: function (packet) {
        if (packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("GET TRAINING LIST ERROR :::::::::::", packet.getError());
            ArmyManager.getInstance();
        } else {
            cc.log("GET TRAINING LIST SUCCESS ::::::::::: " + JSON.stringify(packet) + " CURRENT TIME :" + TimeManager.getInstance().getCurrentTimeInSecond());
            let barracks = ArmyManager.getInstance().getBarrackList();
            ArmyManager.getInstance().updateArmyAmount(packet.doneList, this._curPage)
            for (let i = 0; i < barracks.length; i++) {
                if (barracks[i].getId() === packet.barrackId) {
                    cc.log("BARRACK ID :: " + packet.barrackId + " TRAIN LIST::: " + JSON.stringify(packet.trainingList))
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
        if (packet.getError() !== ErrorCode.SUCCESS) {
            cc.log("TRAIN TROOP REQUEST ERROR with code ::::::::: ", packet.getError());
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();

            trainingPopup.getPage({barackId: packet.barrackId}).updateUI(1);
        } else {
            cc.log("TRAIN TROOP CANCLE REQUEST SUCCESS ::::::::: ");
            let event = {}
            event.data = {
                barrackId: packet.barrackId,
                cfgId: packet.cfgId,
                lastTrainingTime: packet.lastTrainingTime,
            }
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            let trainingPopup = popUpLayer.getTrainingPopup();
            PlayerInfoManager.getInstance().changeResource({elixir: packet.additionElixir});
            trainingPopup.getPage({barackId: packet.barrackId}).onCancelTrainTroopSuccess(event);

        }
    },

    onReceivedCheckBuyBuilding: function (packet) {
        if (packet.error !== 0) {
            cc.log("BUY BUILDING ERROR with code ::::::::: ", packet.error);
        } else {
            this.sendGetUserInfo();
            cc.log("BUY BUILDING SUCCESS ::::::::: ");
            //log all packet
            cc.log("packet: ", JSON.stringify(packet, null, 2));
            let mapLayer = cc.director.getRunningScene().mapLayer;
            let building = getBuildingFromType(packet.type, 1, packet.id, packet.posX, packet.posY, packet.status, packet.startTime, packet.endTime);
            MapManager.getInstance().addBuilding(building, true);
            mapLayer.addBuildingToLayer(building);
            mapLayer.exitModeBuyBuilding();
            mapLayer.selectBuilding(building);
            if (packet.type == "WAL_1") {
                mapLayer.enterModeBuyBuilding("WAL_1", packet.posX, packet.posY - 1);
            }
            // cc.log("++++++++++++++++++++++++++++++++++++++++");

            if (packet.status === 0) return;
            building.startBuild(packet.startTime, packet.endTime);
            //bat lai info

        }
    },

    onReceivedRemoveObstacle: function (packet) {
        if (packet.error !== 0) {
            cc.log("REMOVE OBSTACLE ERROR with code ::::::::: ", packet.error);
        } else {
            cc.log("REMOVE OBSTACLE SUCCESS ::::::::: ");
            let obstacle = MapManager.getInstance().getBuildingById(packet.id);
            obstacle.startRemove(packet.startTime, packet.endTime);
        }
    },

    onReceivedRemoveObstacleSuccess: function (packet) {
        if (packet.error !== 0) {
            cc.log("REMOVE OBSTACLE SUCCESS ERROR with code ::::::::: ", packet.error);
        } else {
            cc.log("REMOVE OBSTACLE SUCCESS SUCCESS ::::::::: ");
            let obstacle = MapManager.getInstance().getBuildingById(packet.id);
            obstacle.completeRemove();
        }
    },

    onReceivedUpgradeBuilding: function (packet) {
        if (packet.error !== 0) {
            cc.log("UPGRADE BUILDING ERROR with code ::::::::: ", packet.error);
        } else {
            cc.log(JSON.stringify(packet, null, 2));
            cc.log("UPGRADE BUILDING SUCCESS ::::::::: ");
            let building = MapManager.getInstance().getBuildingById(packet.id);
            building.startUpgrade(packet.startTime, packet.endTime);
            if (packet.status === 0) building.completeUpgrade();
        }
    },

    onReceivedUpgradeBuildingSuccess: function (packet) {
        if (packet.error !== 0) {
            cc.log("UPGRADE BUILDING SUCCESS ERROR with code ::::::::: ", packet.error);
        }
        if (packet.error === 26) {
            //get chosenbuilding
            let building = cc.director.getRunningScene().getMapLayer().chosenBuilding;
            if (!building) {
                //log bug
                cc.log("UPGRADE BUILDING SUCCESS ERROR::::::::: ", packet.error);
            }
            building.completeUpgrade();

        } else {
            cc.log("UPGRADE BUILDING SUCCESS SUCCESS ::::::::: ");
            let building = MapManager.getInstance().getBuildingById(packet.id);
            building.completeUpgrade();
            cc.eventManager.dispatchCustomEvent(EVENT_NAMES.BUILDING_UPDATED, {id: packet.id})
        }
    },

    onReceivedBuildBuildingSuccess: function (packet) {
        if (packet.error !== 0) {
            cc.log("BUILD BUILDING SUCCESS ERROR with code ::::::::: ", packet.error);
        } else {
            cc.log("BUILD BUILDING SUCCESS SUCCESS ::::::::: ");
            let building = MapManager.getInstance().getBuildingById(packet.id);
            building.completeBuild();
        }
    },
    //+ api collect resource: 2007
    //   input: id
    //   output: error, id, gold, elixir, lastCollectTime
    onReceivedHarvest: function (packet) {
        if (packet.error !== 0) {
            cc.log("HARVEST ERROR with code ::::::::: ", packet.error);
        } else {
            cc.log("HARVEST SUCCESS ::::::::: ");
            let building = MapManager.getInstance().getBuildingById(packet.id);
            building.harvest(packet.lastCollectTime, packet.gold, packet.elixir);
        }

    },

    onReceivedCancelBuild: function (packet) {
        if (packet.error !== 0) {
            cc.log("CANCEL BUILD ERROR with code ::::::::: ", packet.error);
        } else {
            cc.log("CANCEL BUILD SUCCESS ::::::::: ");
            let building = MapManager.getInstance().getBuildingById(packet.id);
            building.cancelBuild();
        }
    },
    onReceivedCancelUpgrade: function (packet) {
        if (packet.error !== 0) {
            cc.log("CANCEL UPGRADE ERROR with code ::::::::: ", packet.error);
        } else {
            cc.log("CANCEL UPGRADE SUCCESS ::::::::: ");
            let building = MapManager.getInstance().getBuildingById(packet.id);
            building.cancelUpgrade();
        }
    },

    onReceivedQuickFinish: function (packet) {
        if (packet.error !== 0) {
            cc.log("QUICK FINISH ERROR with code ::::::::: ", packet.error);
        } else {
            cc.log("QUICK FINISH SUCCESS ::::::::: ");

            let id = packet.id;
            let gem = packet.gem;
            let building = MapManager.getInstance().getBuildingById(id);
            //set resource gem to gem
            PlayerInfoManager.getInstance().setResource({gem: gem});
            building.quickFinish();
            //if chosenbuilding right now != building, call onReceivedQuickFinish of chosenbuilding
            let chosenBuilding = cc.director.getRunningScene().getMapLayer().chosenBuilding;
            if (chosenBuilding && chosenBuilding._id !== id) {
                chosenBuilding.onReceivedQuickFinishOfAnother();
            }
            cc.eventManager.dispatchCustomEvent(EVENT_NAMES.BUILDING_UPDATED, {id: packet.id})
        }
    },
    onReceivedBuyResourceByGem: function (packet) {
        if (packet.error !== 0) {
            cc.log("BUY RESOURCE BY GEM ERROR with code ::::::::: ", packet.error);
        } else {
            cc.log("BUY RESOURCE BY GEM SUCCESS ::::::::: ");
            let gem = packet.gem;
            let gold = packet.gold;
            let elixir = packet.elixir;
            PlayerInfoManager.getInstance().setResource({gem: gem, gold: gold, elixir: elixir});
            // this.sendGetUserInfo();
            //get chosen building
            let building = cc.director.getRunningScene().getMapLayer().chosenBuilding;
            if (!building) return;
            cc.log("building: ", building._type)
            building.onReceivedBuyResourceByGemSuccess();
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
    sendGetArmyInfo: function () {
        cc.log("sendGet army Info");
        var pk = this.gameClient.getOutPacket(CmdSendArmyInfo);
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
        cc.log("SEND REQUEST TRAIN SUCCESS \n" + JSON.stringify(data))
        var pk = this.gameClient.getOutPacket(CmdSendTrainTroopSuccess);
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },

    sendGetTrainingList: function (data) {
        var pk = this.gameClient.getOutPacket(CmdSendGetTrainingList);
        pk.pack(data);
        this.gameClient.sendPacket(pk);
    },

    //quyet-------------------------------------------------------------------
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
        cc.log("SEND harvest ");
        var pk = this.gameClient.getOutPacket(CmdSendHarvest);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    },
    sendCancelBuild: function (id) {
        cc.log("SEND cancel building ");
        var pk = this.gameClient.getOutPacket(CmdSendCancelBuild);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    },
    sendCancelUpgrade: function (id) {
        cc.log("SEND cancel upgrade ");
        var pk = this.gameClient.getOutPacket(CmdSendCancelUpgrade);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    },
    sendQuickFinish: function (id) {
        cc.log("SEND quick finish");
        var pk = this.gameClient.getOutPacket(CmdSendQuickFinish);
        pk.pack({id});
        this.gameClient.sendPacket(pk);
    },
    sendBuyResourceByGem: function (gold, elixir) {
        cc.log("SEND get resource");
        var pk = this.gameClient.getOutPacket(CmdSendBuyResourceByGem);
        pk.pack({gold, elixir});
        this.gameClient.sendPacket(pk);
    },
    sendGetTimeServer: function () {
        cc.log("SEND get time server");
        var pk = this.gameClient.getOutPacket(CmdSendGetTimeServer);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendFindMatch: function () {
        cc.log("SEND find match");
        var pk = this.gameClient.getOutPacket(CmdSendFindMatch);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

});



