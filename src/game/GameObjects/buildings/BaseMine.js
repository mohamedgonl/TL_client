const OFFSET_HARVEST = 1;
var BaseMine = Building.extend({
    ctor: function (level, id, posX, posY, status, startTime, endTime) {
        this._super(level, id, posX, posY, status, startTime, endTime);
        this._lastCollectTime = null;
        this._showIconHarvest = false;
        this._canHarvest = true;
        this._capacityGold = 0;
        this._capacityElixir = 0;
        this._currentGold = 0;
        this._currentElixir = 0;
    },
    addIntoMapLayer: function () {
        this._super();

        //add icon harvest
        let node = CCSUlties.parseUIFile(res_ui.ICON_MINE);
        let icon = node.getChildByName("bg").getChildByName("icon");
        icon.loadTexture(res_ui[this._type + "_COLLECT"]);
        icon.setScale(0.9)
        this._iconHarvest = node;
        this._effect.addChild(this._iconHarvest, ZORDER_BUILDING_EFFECT);
        this._iconHarvest.setVisible(false);

        //schedule check show harvest icon
        this.checkShowHarvestIcon();
        this.schedule(this.checkShowHarvestIcon, 5, cc.REPEAT_FOREVER, 0);
    },
    setLastCollectTime: function (lastCollectTime) {
        this._lastCollectTime = lastCollectTime;
    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.getInstance();
        mapManager.addToListMine(this);
    },
    loadSprite: function () {
        this._super();


    },

    //send to server
    onClickHarvest: function () {
        testnetwork.connector.sendHarvest(this._id);
    },

    getHarvestAmountClient: function () {
        let timeNow = TimeManager.getInstance().getCurrentTimeInSecond();
        let time = timeNow - this._lastCollectTime;
        let productivity = LoadManager.getInstance().getConfig(this._type, this._level, "productivity");
        let harvestAmount = Math.floor(time * productivity / 3600);
        return harvestAmount;
    },

    checkShowHarvestIcon: function () {
        if (this._state !== BUILDING_STATE.IDLE) {
            this._iconHarvest.setVisible(false);
            return;
        }
        let harvestAmount = this.getHarvestAmountClient();
        let capacity = LoadManager.getInstance().getConfig(this._type, this._level, "capacity");

        //if can harvest >= 1% of capacity , show icon
        if (harvestAmount >= capacity / 3) {
            this._showIconHarvest = true;
            this._iconHarvest.setVisible(true);
        } else {
            this._showIconHarvest = false;
            this._iconHarvest.setVisible(false);
        }
    },
    harvest: function (lastCollectTime, gold, elixir) {
        this._lastCollectTime = lastCollectTime;
        let oldElixir = PlayerInfoManager.getInstance().getResource().elixir;
        PlayerInfoManager.getInstance().setResource({elixir: elixir});
        let changesElixir = elixir - oldElixir;

        let oldGold = PlayerInfoManager.getInstance().getResource().gold;
        PlayerInfoManager.getInstance().setResource({gold: gold});
        let changesGold = gold - oldGold;


        let color;
        let changes = 0;
        if (this._type === "RES_1") {
            color = cc.color(255, 255, 0);
            changes = changesGold;
        } else {
            color = cc.color(255, 0, 255);
            changes = changesElixir;
        }

        //init a TMP label to show changes in pos 0 0 of this building and hide after 1s
        let label = new cc.LabelBMFont("+" + Utils.numberToText(changes), res.FONT.SOJI[20]);
        label.setColor(color);
        this._effect.addChild(label, ZORDER_BUILDING_EFFECT);
        label.runAction(cc.sequence(cc.moveBy(1, 0, 50), cc.callFunc(function () {
                label.removeFromParent(true);
            }
        )));

        //if storage is full, harvest a part and show full icon harvest
        let capacity = LoadManager.getInstance().getConfig(this._type, this._level, "capacity");
        let bg = this._iconHarvest.getChildByName("bg");
        if(changes < this.getHarvestAmountClient()){
            this._showIconHarvest = true;
            this._canHarvest = true;
            this._iconHarvest.setVisible(true);
            bg.loadTexture(res_ui.RES_BG_COLLECT_FULL);
        }
        else{
            this._showIconHarvest = false;
            this._canHarvest = false;
            this._iconHarvest.setVisible(false);
            bg.loadTexture(res_ui.RES_BG_COLLECT);
            this.scheduleOnce(function () {
                this._canHarvest = true;
                this.loadButton();
            }.bind(this), 5);
        }

        this.loadButton();


    },
    onSelected: function () {
        this._super();
        cc.log("harvestAmount", this.getHarvestAmountClient());
    },
});