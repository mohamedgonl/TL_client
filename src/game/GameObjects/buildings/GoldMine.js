var GoldMine = Building.extend({
    _upper: null,
    _lastCollectTime: null,
    _type: "RES_1",
    _showIconHarvest: false,
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);


        this._canHarvest = true;
        let config = LoadManager.Instance().getConfig(this._type,this._level);
        this._currentGold = 0;
        this._capacityGold = config.capacity;
        this._productionGold = config.productivity;
        // this.checkShowHarvestIcon();
        // this.schedule(this.checkShowHarvestIcon,10,cc.REPEAT_FOREVER,0);
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
        let icon = node.getChildByName("icon");
        icon.setTexture(res.ICON.GOLD);
        this._iconHarvest = node;
        this.addChild(this._iconHarvest,ZORDER_BUILDING_EFFECT);
        this._iconHarvest.setVisible(false);

    },
    loadSpriteByLevel: function (level) {
        var upper_sprite = res_map.SPRITE.BODY.GOLD_MINE.UPPER[level];
        this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],
            upper_sprite,1,1);
    },
    loadButton: function () {
        if(this._super() === -1) return;
        let infoLayer = cc.director.getRunningScene().infoLayer;
        if(this._state ===0) {
            if(this._canHarvest)
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,0,this.onClickHarvest.bind(this));
            else
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,1,this.onClickHarvest.bind(this));
        }
    },

    //send to server
    onClickHarvest: function () {
        testnetwork.connector.sendHarvest(this._id);
        //disable button for 5s
        let infoLayer = cc.director.getRunningScene().infoLayer;
    },

    harvest: function (lastCollectTime,gold,elixir) {
        this._lastCollectTime = lastCollectTime;
        PlayerInfoManager.Instance().setResource({gold:gold});

        //sau 5s moi duoc nhan 1 lan
        this._canHarvest = false;
        this._iconHarvest.setVisible(false);
        this._showIconHarvest = false;

        this.loadButton();

        this.scheduleOnce(function () {
            this._canHarvest = true;
            this.loadButton();
        }.bind(this),5);
    },
    completeUpgrade: function () {
        this._super();
        let playerInfoManager = PlayerInfoManager.Instance();
        let capacity = LoadManager.Instance().getConfig(this._type,this._level)
        this._capacityGold = capacity.capacity;
        this._productionGold = capacity.productivity;
    },

    checkShowHarvestIcon: function () {
        //if can harvest >= 1% of capacity , show icon
        let timeNow = TimeManager.Instance().getCurrentTimeInSecond();
        cc.log("timeNow::::::::::::::::::::::::::: " + timeNow)
        cc.log("this._lastCollectTime::::::::::::::::::::::::::: " + this._lastCollectTime)
        let time = timeNow - this._lastCollectTime;
        cc.log("time::::::::::::::::::::::::::: " + time);
        let capacity = LoadManager.Instance().getConfig(this._type,this._level,"capacity");

        let harvestAmount = Math.floor(time*this._productionGold/3600);

        cc.log("harvestAmount: " + harvestAmount)
        if(harvestAmount >= capacity/100) {
            this._showIconHarvest = true;
            this._iconHarvest.setVisible(true);
            }
        else
        {
            this._showIconHarvest = false;
            this._iconHarvest.setVisible(false);
        }
    }
});