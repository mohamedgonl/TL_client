var Obstacle = GameObject.extend({

    //status = 0: normal, 1: removing
   ctor: function(type,id,posX,posY,status=0,startTime,endTime){
       this._super();
       this._type = type;
       this._posX = posX;
       this._posY = posY;
       this._id = id;
       this._state = status;
       this._startTime = startTime;
       this._endTime = endTime;
       this._level = 1;

       this.init();

   },
    init: function (){

        //load config
        var configObstacle = LoadManager.getInstance().getConfig(this._type,1);
        this._width = configObstacle.width;
        this._height = configObstacle.height;

        //load sprites
        this.loadMainSprite();
        this.loadSubSprite();
        this.initState();

        //schedule update 1s 1 time
        this.update()
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0)
    },

    initState: function(){
        if(this._state === 1){
            //-1 tho xay
            let playerInfoManager = PlayerInfoManager.getInstance();
            playerInfoManager.changeBuilder("current",-1);
            this._progressBar.setVisible(true);
        }
        else{
            this._progressBar.setVisible(false);
        }
    },
    //load main sprite
    loadMainSprite: function(){

        let typeIndex = this._type.substring(4);
        var body_link = res_map.SPRITE.BODY.OBS_LINK + typeIndex + "/idle/image0000.png";
        var grass_link = res_map.SPRITE.GRASS.OBSTACLE[this._width];
        this._body = new cc.Sprite(body_link);
        this._grass = new cc.Sprite(grass_link);

        this._body.setAnchorPoint(0.5,0.5);
        this._grass.setAnchorPoint(0.5,0.5);

        this._body.setScale(0.5);

        this.addChild(this._grass);
        this.addChild(this._body);
    },

    loadSubSprite: function(){
        //arrow move
        this._arrowMove = new cc.Sprite(res_map.SPRITE.ARROW_MOVE[this._width]);
        this._arrowMove.setScale(SCALE_BUILDING_BODY);
        this._arrowMove.setAnchorPoint(0.5,0.5);
        this._arrowMove.setVisible(false);
        this.addChild(this._arrowMove,ZORDER_BUILDING_EFFECT);

        //progress bar
        this._progressBar = new ccui.Slider();
        this._progressBar.setScale(SCALE_BUILDING_BODY);
        this._progressBar.loadBarTexture(res_map.SPRITE.PROGRESS_BAR_BG);
        this._progressBar.loadProgressBarTexture(res_map.SPRITE.PROGRESS_BAR);
        this._progressBar.setAnchorPoint(0.5, 0.5);
        this._progressBar.setPosition(0,30);
        this._progressBar.setVisible(false);
        this.addChild(this._progressBar);

        //name label
        //nameLabel Cay Coi size 20 dont arial cc.Text
        this._nameLabel = new cc.LabelBMFont("Vật cản", res.FONT.SOJI[FONT_SIZE_NAME_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._nameLabel.setAnchorPoint(0.5,0.5);
        this._nameLabel.setPosition(0,50);
        this._nameLabel.setColor(new cc.Color(255, 255, 0));
        this.addChild(this._nameLabel);
        this._nameLabel.setVisible(false);
        //time label
        this._timeLabel = new cc.LabelBMFont("timeLabel", res.FONT.SOJI[12], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._timeLabel.setAnchorPoint(0.5,0);
        this._timeLabel.setPosition(
            this._progressBar.getBoundingBox().width,
            this._progressBar.getBoundingBox().height + 10);

        this._progressBar.addChild(this._timeLabel,ZORDER_BUILDING_EFFECT);

    },

    loadButton: function(){
        let infoLayer = cc.director.getRunningScene().infoLayer;
        infoLayer.removeAllButtonInMenu();
        if(this._state ===0)
        {
            let priceGold = LoadManager.getInstance().getConfig(this._type,this._level,"gold");
            let priceElixir = LoadManager.getInstance().getConfig(this._type,this._level,"elixir");
            if(priceGold > 0)
            {
                infoLayer.addButtonToMenu("Dọn dẹp",res.BUTTON.REMOVE_BUTTON,0,this.onClickRemove.bind(this),priceGold,"gold");
            }
            else
            {
                infoLayer.addButtonToMenu("Dọn dẹp",res.BUTTON.REMOVE_BUTTON,0,this.onClickRemove.bind(this),priceElixir, "elixir");
            }
        }
        else
        {
            //priceGem = 1 gem per 4m, floor upper, count from now to end time
            let priceGem = Math.ceil((this._endTime - TimeManager.getInstance().getCurrentTimeInSecond())/240);
            infoLayer.addButtonToMenu("Xong ngay",res.BUTTON.QUICK_FINISH_BUTTON,0,this.onClickQuickFinish.bind(this),priceGem,"gem");
        }

    },
    onSelected: function(){
        this.loadButton();
        this._arrowMove.setVisible(true);
        this._nameLabel.setVisible(true);
        //dispatch event EVENT_SELECT_BUILDING with building._id
        cc.eventManager.dispatchCustomEvent(EVENT_SELECT_BUILDING, this._id);
    },
    onUnselected: function(){
        this._arrowMove.setVisible(false);
        this._nameLabel.setVisible(false);
        cc.eventManager.dispatchCustomEvent(EVENT_UNSELECT_BUILDING);
    },
    showButtonToInfoLayer: function(){
        let infoLayer = cc.director.getRunningScene().infoLayer;
    },
    setType: function (type) {
        this._type = type;
    },
    getType: function () {
        return this._type;
    },
    getState: function () {
       return this._state;
    },
    setState: function (state) {
        this._state = state;
    },
    updateProgress: function (){
        //log start time, end time, current time
        let currentTime = TimeManager.getInstance().getCurrentTimeInSecond();
        let percent = (currentTime - this._startTime)/(this._endTime - this._startTime)*100;
        this._progressBar.setPercent(percent);

        //update time left
        let time = this._endTime - currentTime;
        this._timeLabel.setString(Utils.getTimeString(time));
        if(currentTime >= this._endTime){
            //send to server to check
            testnetwork.connector.sendRemoveObstacleSuccess(this._id);
            // this.completeRemove();
        }
    },
    update: function (dt) {
        if(this._state === 1){
            if(this._progressBar.isVisible() === false)
                this._progressBar.setVisible(true);
            this.updateProgress();
        }
        else{
            this._progressBar.setVisible(false);
        }
    },
    startRemove: function (startTime,endTime) {
        //enable progress bar
        this._state = 1;
        this._startTime = startTime;
        this._endTime = endTime;
        this.loadButton();

        let playerInfoManager = PlayerInfoManager.getInstance();
        let priceGold = LoadManager.getInstance().getConfig(this._type,this._level,"gold");
        let priceElixir = LoadManager.getInstance().getConfig(this._type,this._level,"elixir");
        playerInfoManager.changeResource({gold:-priceGold,elixir:-priceElixir});
        playerInfoManager.changeBuilder("current",-1);
        MapManager.getInstance().callBuilderToBuilding(this);
    },
    completeRemove: function () {
        this._state = 0;
        this._startTime = null;
        this._endTime = null;
        this.loadButton();
        //xoa khoi map
        MapManager.getInstance().removeBuilding(this)
        //xoa obstacle khoi layer
        cc.director.getRunningScene().mapLayer.removeBuilding(this);

        //tra ve builder
        let playerInfoManager = PlayerInfoManager.getInstance();
        playerInfoManager.changeBuilder("current",1);
        cc.eventManager.dispatchCustomEvent(EVENT_FINISH_BUILDING, this._id);

        let infoLayer = cc.director.getRunningScene().infoLayer;
        infoLayer.removeAllButtonInMenu();
    },
    //check to client, if valid then send packet to server
    onClickRemove: function(){
        //check client
        let playerInfoManager = PlayerInfoManager.getInstance();
        let priceGold = LoadManager.getInstance().getConfig(this._type,this._level,"gold");
        let priceElixir = LoadManager.getInstance().getConfig(this._type,this._level,"elixir");
        if(playerInfoManager.getResource("gold") < priceGold || playerInfoManager.getResource("elixir") < priceElixir)
        {
            cc.log("not enough resource");
            //declare price, type is resource not enough
            let priceCount;
            let type;
            if(priceGold)
            {
                priceCount = priceGold- PlayerInfoManager.getInstance().getResource("gold");
                type = "gold";
            }
            else{
                priceCount = priceElixir - PlayerInfoManager.getInstance().getResource("elixir");
                type = "elixir";
            }
            NotEnoughResourcePopup.appear(priceCount,type);
            return;
        }

        if(playerInfoManager.getBuilder().current <= 0)
        {
            // create content in popup
            let label = new cc.LabelBMFont("Bạn có muốn giải phóng thợ xây", res.FONT.FISTA["16"], 350, cc.TEXT_ALIGNMENT_CENTER);
            label.setColor(new cc.Color(150, 78, 3));
            // let price = new cc.LabelBMFont(priceCount, res.FONT.SOJI["16"], 350, cc.TEXT_ALIGNMENT_CENTER);
            // price.setPositionY(-label.getContentSize().height);
            // //price mau xanh la
            // price.setColor(cc.color(0, 255, 0));
            let content = new cc.Node();
            content.addChild(label);
            // content.addChild(price);
            let buyResPopup = new NotiPopup({
                    title: "THỢ XÂY BẬN HẾT",
                    acceptCallBack: () => {
                        //remove popup
                        popUpLayer.setVisible(false);
                          PlayerInfoManager.getInstance().freeBuilderByGem();
                    buyResPopup.removeFromParent(true);
                },
                content: content,
                cancleCallBack: () => {
                    popUpLayer.setVisible(false);
                    buyResPopup.removeFromParent(true)
                }
            });
            var popUpLayer = cc.director.getRunningScene().popUpLayer;
            popUpLayer.addChild(buyResPopup)
            popUpLayer.setVisible(true);
            return;
        }

        //send packet to server
        testnetwork.connector.sendRemoveObstacle(this._id);
    },
    //if server response error = 0, then start remove obstacle
    onReceiveClickRemove: function(packet){
        if(packet.error === 0)
        {
            //xoa obstacle khoi map
            this.startRemove(packet.startTime,packet.endTime);
        }
        else
        {
            cc.log("error: " + packet.error);
        }
    },
    onAddIntoMapManager: function () {
    },
    onReceivedBuyResourceByGemSuccess: function (packet) {
      this.onClickRemove();
    },
    onClickQuickFinish: function () {
        let priceGem = Utils.calculateGBuyTime(this._endTime - TimeManager.getInstance().getCurrentTimeInSecond());
        let currentGem = PlayerInfoManager.getInstance().getResource("gem");
        if(currentGem < priceGem)
        {
            BasicPopup.appear("THIẾU TÀI NGUYÊN", "Bạn không đủ G")
            return;
        }
        testnetwork.connector.sendQuickFinish(this._id);
    },
    quickFinish: function (){
        this.completeRemove();
    },
    getState: function () {
        return this._state;
    },
    getTimeLeft: function () {
        if(this._state!= null)
        {
            return this._endTime - TimeManager.getInstance().getCurrentTimeInSecond();
        }
        return null;
    },
    onReceivedQuickFinishOfAnother: function (packet) {
        this.onClickRemove();
    },
    getGridPosition: function () {
        return cc.p(this._posX,this._posY);
    }
});