var Mine = Building.extend({
    _upper: null,
    _lastCollectTime: null,
    _showIconHarvest: false,
    _canHarvest: true,
    _capacity: null,
    ctor: function (level, id, posX, posY, status, startTime, endTime) {
        this._super(level, id, posX, posY, status, startTime, endTime);

    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.Instance();
        mapManager.addToListMine(this);
    },
    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation) {
        this._super(bodySprite, upperSprite, shadow_type, isUpperAnimation);

        // this._iconHarvest have bg, and bg.icon is sprite of harvest icon
        let node = CCSUlties.parseUIFile(res_ui.ICON_HARVEST);

        this._iconHarvest = node;
        this.addChild(this._iconHarvest, ZORDER_BUILDING_EFFECT);
        this._iconHarvest.setVisible(false);
    },

    setLastCollectTimeAndIconHarvest: function (lastCollectTime) {
        this._lastCollectTime = lastCollectTime;
        this.checkShowHarvestIcon();
        this.schedule(this.checkShowHarvestIcon, 10, cc.REPEAT_FOREVER, 0);
    },

    //send to server
    onClickHarvest: function () {
        testnetwork.connector.sendHarvest(this._id);
    },



    checkShowHarvestIcon: function () {

        if(this._state !== 0)
        {
            this._iconHarvest.setVisible(false);
            return;
        }

        //if can harvest >= 1% of capacity , show icon
        let timeNow = TimeManager.Instance().getCurrentTimeInSecond();

        let time = timeNow - this._lastCollectTime;

        let productivity = LoadManager.Instance().getConfig(this._type, this._level, "productivity");

        let harvestAmount = Math.floor(time * productivity / 3600);

        let capacity = LoadManager.Instance().getConfig(this._type, this._level, "capacity");
        if (harvestAmount >= capacity / 50) {
            this._showIconHarvest = true;
            this._iconHarvest.setVisible(true);
        } else {
            this._showIconHarvest = false;
            this._iconHarvest.setVisible(false);
        }
    },
    harvest: function (lastCollectTime,gold,elixir) {

        this._lastCollectTime = lastCollectTime;
        let oldElixir = PlayerInfoManager.Instance().getResource().elixir;
        PlayerInfoManager.Instance().setResource({elixir:elixir});
        let changesElixir = elixir - oldElixir;

        let oldGold = PlayerInfoManager.Instance().getResource().gold;
        PlayerInfoManager.Instance().setResource({gold:gold});
        let changesGold = gold - oldGold;


        
        let color;
        let changes = 0;
        if(this._type == "RES_1")
        {
            color = cc.color(255,255,0);
            changes = changesGold;
        }
        else
        {
            color = cc.color(255,0,255);
            changes = changesElixir;
        }

        //init a TMP label to show changes in pos 0 0 of this building and hide after 1s
        let label = new cc.LabelBMFont("+" + changes,res.FONT.SOJI[20]);
        label.setColor(color);
        this.addChild(label,ZORDER_BUILDING_EFFECT);
        label.runAction(cc.sequence(cc.moveBy(1,0,50),cc.callFunc(function () {
                label.removeFromParent(true);
            }
        )));

        //sau 5s moi duoc nhan 1 lan
        this._canHarvest = false;
        this._iconHarvest.setVisible(false);
        this._showIconHarvest = false;

        this.loadButton();

        this.scheduleOnce(function () {
            this._canHarvest = true;
            this.loadButton();
        }.bind(this),5);
    }
});