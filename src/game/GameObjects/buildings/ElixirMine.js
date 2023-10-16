var ElixirMine = Building.extend({
    _upper: null,
    _lastCollectTime: null,
    _type: "RES_2",

    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        let config = LoadManager.Instance().getConfig(this._type,this._level);
        this._currentElixir = 0;
        this._capacityElixir = config.capacity;
        this._productionElixir = config.productivity;
        this._canHarvest = true;

    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.Instance();
        mapManager.addToListMine(this);
    },

    loadSpriteByLevel: function (level) {
        // var upper_sprite = res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level] + "/image0000.png";
        // this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],upper_sprite,1);
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],
            res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level],1,1);
    },
    loadButton: function () {
        if(this._super() === -1) return;
        let infoLayer = cc.director.getRunningScene().infoLayer;
        if(this._state ===0) {
            if(this._canHarvest)
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,0,this.onClickHarvest.bind(this));
            else
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,3,this.onClickHarvest.bind(this));
        }
    },

    //send to server
    onClickHarvest: function () {
        testnetwork.connector.sendHarvest(this._id);
    },
    harvest: function (lastCollectTime,gold,elixir) {
        this._lastCollectTime = lastCollectTime;
        let oldElixir = PlayerInfoManager.Instance().getResource().elixir;
        PlayerInfoManager.Instance().setResource({elixir:elixir});

        let changes = elixir - oldElixir;

        //init a TMP label to show changes in pos 0 0 of this building and hide after 1s
        let label = new cc.LabelBMFont("+" + changes,res.FONT.SOJI[20]);
        label.setPosition(0,0);
        //color pink
        label.setColor(cc.color(255,0,255));
        this.addChild(label,ZORDER_BUILDING_EFFECT);
        label.runAction(cc.sequence(cc.moveBy(1,0,50),cc.callFunc(function () {
                label.removeFromParent(true);
            }
        )));

        //sau 5s moi duoc nhan 1 lan
        this._canHarvest = false;
        this._showIconHarvest = false;

        this.loadButton();

        this.scheduleOnce(function () {
            this._canHarvest = true;
            this.loadButton();
        }.bind(this),5);
    },


});
