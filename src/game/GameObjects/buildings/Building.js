
// Constructor Building
//  level: level of building
//  posX: position x of building
//  posY: position y of building
var Building = GameObject.extend({
    //  example: building = new Townhall(type, level,id, posX, posY);
    ctor: function (level =1 ,id,posX,posY,status,startTime,endTime) {

        this._super();

        this._level = level;
        this._posX = posX;
        this._posY = posY;
        this._id = id;
        this._state = status;
        this._startTime = startTime;
        this._endTime = endTime;

        let config = LoadManager.Instance().getConfig(this._type,level);
        this._width = config.width;
        this._height = config.height;
        this._hitpoints = config.hitpoints;

        this.setAnchorPoint(0.5,0.5);
    },

    onAddIntoMapLayer: function () {
        this.loadBottomSprite();
        this.loadEffectSprite();
        this.loadMainSprite();
        this.addChild(this._bottom);
        this.addChild(this._mainSprite);
        this.addChild(this._effect);
    },
    onAddWithGrass: function () {
        this.loadBottomSprite();
        this.loadEffectSprite();
        this.loadMainSprite();
        this.addChild(this._bottom);
        this.addChild(this._mainSprite);
        this.addChild(this._effect);
    },
    onMoveInLayer: function () {


    },
    loadBottomSprite: function () {
        let size = this._width;

        //green square
        this._green_square = new cc.Sprite(res_map.SPRITE.GREEN_SQUARE[this._width]);
        this._green_square.setAnchorPoint(0.5,0.5);
        this._green_square.setVisible(false);

        //red square
        this._red_square = new cc.Sprite(res_map.SPRITE.RED_SQUARE[this._width]);
        this._red_square.setAnchorPoint(0.5,0.5);
        this._red_square.setVisible(false);

        //grass
        this._grass = new cc.Sprite();
        this._grass.setTexture(res_map.SPRITE.GRASS.BUILDING[size]);
        this._grass.setAnchorPoint(0.5,0.5);

        //shadow
        let shadow_type = this._shadowType;
        this._shadow = new cc.Sprite();
        if(shadow_type === 1){
            //this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW[size]);
            this._shadow.setTexture(res_map.SPRITE.SHADOW[size])

            this._shadow.setAnchorPoint(0.5,0.5);
        }
        else if(shadow_type === 2){
            //this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW.CIRCLE);
            this._shadow.setTexture(res_map.SPRITE.SHADOW.CIRCLE)
            this._shadow.setAnchorPoint(0.5,0.5);
        }

        this._bottom = new cc.Node();
        this._bottom.addChild(this._grass);
        this._bottom.addChild(this._shadow);
        this._bottom.addChild(this._green_square);
        this._bottom.addChild(this._red_square);
    },

    loadEffectSprite: function () {
        //arrow
        this._arrow = new cc.Sprite(res_map.SPRITE.ARROW_MOVE[this._width]);
        this._arrow.setAnchorPoint(0.5,0.5);
        this._arrow.setScale(SCALE_BUILDING_BODY);
        this._arrow.setVisible(false);

        //name label
        this._nameLabel = new cc.LabelBMFont(BuildingInfo[this._type].name, res.FONT.SOJI[FONT_SIZE_NAME_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._nameLabel.setAnchorPoint(0.5,0.5);
        this._nameLabel.setPosition(0,80);
        this._nameLabel.setColor(new cc.Color(255, 255, 0));
        this._nameLabel.setVisible(false);

        //progress bar
        this._progressBar = new ccui.Slider();
        this._progressBar.setScale(SCALE_BUILDING_BODY);
        this._progressBar.loadBarTexture(res_map.SPRITE.PROGRESS_BAR_BG);
        this._progressBar.loadProgressBarTexture(res_map.SPRITE.PROGRESS_BAR);
        this._progressBar.setAnchorPoint(0.5, 1);
        this._progressBar.setPosition(0,30);
        this._progressBar.setVisible(false);

        //level label
        this._levelLabel = new cc.LabelBMFont("Cấp " + this._level, res.FONT.SOJI[FONT_SIZE_LEVEL_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._levelLabel.setAnchorPoint(0.5,0.5);
        this._levelLabel.setPosition(0,50);
        this._levelLabel.setVisible(false);

        //time label
        this._timeLabel = new cc.LabelBMFont("", res.FONT.SOJI[12], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._timeLabel.setAnchorPoint(0.5,0);
        this._timeLabel.setPosition(
            this._progressBar.getBoundingBox().width,
            this._progressBar.getBoundingBox().height + 10);

        this._progressBar.addChild(this._timeLabel,ZORDER_BUILDING_EFFECT);

        //effect fence when build upgrade
        this._fence = new cc.Sprite(res_map.SPRITE.FENCE);
        this._fence.setAnchorPoint(0.5,0);

        //set pos below 0 0 of building = height grass/2 + offset
        this._fence.setPosition(0,-this._grass.getBoundingBox().height/2 +5);
        this._fence.setVisible(false);

        this._effect = new cc.Node();
        this._effect.addChild(this._arrow);
        this._effect.addChild(this._nameLabel);
        this._effect.addChild(this._progressBar);
        this._effect.addChild(this._levelLabel);
        this._effect.addChild(this._fence);
    },


    //load sprite with size,
    loadMainSprite: function () {
        let bodySprite = this._bodySprite;
        let upperSprite = this._upperSprite;
        let isUpperAnimation = this._isUpperAnimate;
        let size = this._width;
        //body
        this._body = new cc.Sprite();
        this._body.setTexture(bodySprite);
        this._body.setAnchorPoint(0.5,0.5);
        this._body.setScale(SCALE_BUILDING_BODY);


        //upper
        this._upper = new cc.Sprite();
        if(upperSprite != null){
            // this._upper.setPosition(this._body.getBoundingBox().width,this._body.getBoundingBox().height);

            this._upper.setAnchorPoint(0.5,0.5);
            this._upper.setScale(SCALE_BUILDING_BODY);
            if(isUpperAnimation){

                //this._upper = new cc.Sprite(upperSprite[0]);
                //set texture for first frame and remove old action
                this._upper.setTexture(upperSprite[0]);
                this._upper.stopAllActions();


                let animation = new cc.Animation();
                let countFrame = Object.keys(upperSprite).length;


                for (let i = 0; i < countFrame; i++) {
                    animation.addSpriteFrameWithFile(upperSprite[i]);
                }
                animation.setDelayPerUnit(0.3);
                animation.setRestoreOriginalFrame(true);
                let action = cc.animate(animation);
                this._upper.runAction(cc.repeatForever(action))

            }
            else {
                this._upper.setTexture(upperSprite)
            }
        }
        this._mainSprite = new cc.Node();
        this._mainSprite.addChild(this._body);
        this._mainSprite.addChild(this._upper);
    },

    //load button for building, reload when select building, upgrade, build, cancel
    loadButton: function(){

        let chosenBuilding = cc.director.getRunningScene().getMapLayer().getChosenBuilding();
        let infoLayer = cc.director.getRunningScene().infoLayer;

        infoLayer.removeAllButtonInMenu();

        if(chosenBuilding !== this) return -1;

        infoLayer.addButtonToMenu("Thông tin",res.BUTTON.INFO_BUTTON,0,this.onClickInfo.bind(this));
        if(this._state === 0){
            //upgrade button
            let status = this.getStateUpgradeButton();
            //2 is state max level, not show upgrade button  ; 1 is not enough resource, show upgrade button but red text, 0 is normal
            if(status !== 2 )
            {
                let priceGold = LoadManager.Instance().getConfig(this._type, this._level+1, "gold") || 0;
                let priceElixir = LoadManager.Instance().getConfig(this._type, this._level+1, "elixir") || 0;
                if(priceGold)
                {
                    infoLayer.addButtonToMenu("Nâng cấp",res.BUTTON.UPGRADE_BUTTON,status,this.showPopupUpgrade.bind(this),priceGold,"gold");
                }
                else{
                    infoLayer.addButtonToMenu("Nâng cấp",res.BUTTON.UPGRADE_BUTTON,status,this.showPopupUpgrade.bind(this),priceElixir,"elixir");
                }
            }


        }
        if(this._state !==0) {
            infoLayer.addButtonToMenu("Hủy",res.BUTTON.CANCEL_BUTTON,0,this.onClickStop.bind(this));
            //priceGem = 1 gem per 4m, floor upper, count from now to end time
            let priceGem = Math.ceil((this._endTime - TimeManager.Instance().getCurrentTimeInSecond())/240);
            infoLayer.addButtonToMenu("Xong ngay",res.BUTTON.QUICK_FINISH_BUTTON,0,this.onClickQuickFinish.bind(this),priceGem,"gem");
        }
    },

    onSelected: function(){
        this.loadButton();
        cc.eventManager.dispatchCustomEvent(EVENT_SELECT_BUILDING, this._id);
        // opacity to 80 to 100 to 80 repeat forever
        var action = cc.sequence(cc.fadeTo(0.8, 150), cc.fadeTo(0.8, 255));
        this._body.runAction(cc.repeatForever(action));
        if(this._upper != null)
        {
            this._upper.runAction(cc.repeatForever(action.clone()));
        }
    },
    onUnselected: function(){
        let infoLayer = cc.director.getRunningScene().infoLayer;
        //xoa het button cu
        infoLayer.removeAllButtonInMenu();
        // this._arrow_move.setVisible(false);
        this._nameLabel.setVisible(false);
        this._levelLabel.setVisible(false);
        cc.eventManager.dispatchCustomEvent(EVENT_UNSELECT_BUILDING);
        //stop nhấp nháy
        this._body.stopAllActions();
        if(this._upper != null)
        {
            this._upper.stopAllActions();
        }
        //opacity to 255
        this._body.setOpacity(255);
        if(this._upper != null)
        {
            this._upper.setOpacity(255);
        }
    },

    setType: function (type) {
        this._type = type;
    },

    getType: function () {
        return this._type;
    },
    getGridPosition: function (){
        return cc.p(this._posX, this._posY);
    },
    setGridPosition: function (posX, posY) {
        this._posX = posX;
        this._posY = posY;
    },
    getState: function () {
        return this._state;
    },
    setState: function (state) {
        this._state = state;
    },
    //3 state of Square: 0: no square, 1: green square, 2: red square
    setSquare: function (square) {
        if(square === 0){
            this._green_square.setVisible(false);
            this._red_square.setVisible(false);
        }
        else if(square === 1){
            this._green_square.setVisible(true);
            this._red_square.setVisible(false);
        }
        else if(square === 2){
            this._green_square.setVisible(false);
            this._red_square.setVisible(true);
        }
    },
    updateProgress: function (){
        //log start time, end time, current time
        let currentTime = TimeManager.Instance().getCurrentTimeInSecond();
        let percent = (currentTime - this._startTime)/(this._endTime - this._startTime)*100;
        this._progressBar.setPercent(percent);
        //set time label = end time - current time in 1d2h3m40s format, if 0d -> 2h3m40s, if 0d0h -> 3m40s
        let time = this._endTime - currentTime;
        this._timeLabel.setString(Utils.getTimeString(time));

        //send to server tp check
        if(currentTime >= this._endTime){
            switch (this._state){
                case 1:
                    testnetwork.connector.sendBuildBuildingSuccess(this._id);
                    break;
                case 2:
                    testnetwork.connector.sendUpgradeBuildingSuccess(this._id);
                    break;
            }
        }
    },
    update: function () {
        if(this._state === 1 || this._state === 2){
            this.updateProgress();
        }
        else{
            this.unschedule(this.update);
        }
    },

    startProcess: function () {
        //if state = 1, get price
        let priceGold = LoadManager.Instance().getConfig(this._type, this._level, "gold") || 0;
        let priceElixir = LoadManager.Instance().getConfig(this._type, this._level, "elixir") || 0;
        let priceGem = LoadManager.Instance().getConfig(this._type, this._level, "coin") || 0;
        if(this._state === 2){
            priceGold = LoadManager.Instance().getConfig(this._type, this._level+1, "gold") || 0;
            priceElixir = LoadManager.Instance().getConfig(this._type, this._level+1, "elixir") || 0;
            priceGem = LoadManager.Instance().getConfig(this._type, this._level+1, "coin") || 0;
        }
        PlayerInfoManager.Instance().changeResource({gold:-priceGold,elixir:-priceElixir,gem:-priceGem})
        //enable progress bar
        this._progressBar.setVisible(true);
        //show fence
        this._fence.setVisible(true);

        this.loadButton();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
        MapManager.Instance().callBuilderToBuilding(this);
    },
    startBuild: function (startTime,endTime) {

        this._state = 1;
        this._startTime = startTime;
        this._endTime = endTime;
        this.startProcess();
        },
    startUpgrade: function (startTime,endTime) {

        this._state = 2;
        this._startTime = startTime;
        this._endTime = endTime;
        this.startProcess();
        PlayerInfoManager.Instance().changeBuilder("current", -1);
    },

    completeProcess: function () {
        this._state = 0;
        this._startTime = null;
        this._endTime = null;
        // this._progressBar.setVisible(false);
        // this._fence.setVisible(false);
        PlayerInfoManager.Instance().changeBuilder("current", 1);
        //unschedule update
        let chosenBuilding = cc.director.getRunningScene().getMapLayer().getChosenBuilding();
        if(chosenBuilding === this)
                this.loadButton();
        this.unschedule(this.update);
        cc.eventManager.dispatchCustomEvent(EVENT_FINISH_BUILDING, this._id);
    },
    completeBuild: function () {
        this.completeProcess();
    },
    completeUpgrade: function () {
        this._level += 1;
        //set sprite for new level and update level label
        this._levelLabel.setString("Cấp " + this._level);
        // this.loadSpriteByLevel(this._level)
        this.completeProcess();
    },

    cancelProcess: function () {

        //return 50% resource
        let priceGold = LoadManager.Instance().getConfig(this._type, this._level, "gold") || 0;
        let priceElixir = LoadManager.Instance().getConfig(this._type, this._level, "elixir") || 0;
        if(this._state === 2){
            priceGold = LoadManager.Instance().getConfig(this._type, this._level+1, "gold") || 0;
            priceElixir = LoadManager.Instance().getConfig(this._type, this._level+1, "elixir") || 0;
        }

        let returnGold = Math.floor(priceGold/2);
        let returnElixir = Math.floor(priceElixir/2);
        // PlayerInfoManager.Instance().changeResource("gold", returnGold);
        PlayerInfoManager.Instance().changeResource({gold: returnGold, elixir: returnElixir})
        PlayerInfoManager.Instance().changeBuilder("current", 1);
        //return state
        this._state = 0;
        this._startTime = null;
        this._endTime = null;
        this._progressBar.setVisible(false);
        //reload button
        this.loadButton();
        //unschedule update
        this.unschedule(this.update);
    },

    cancelBuild: function () {

        this.cancelProcess();

        //remove from layer
        let mapLayer = cc.director.getRunningScene().mapLayer;
        mapLayer.removeBuilding(this);

        //remove from mapManager
        MapManager.Instance().removeBuilding(this);

    },

    cancelUpgrade: function () {
        this.cancelProcess();
    },

    onAddIntoMapManager: function () {
        let mapManager = MapManager.Instance();
        if(!mapManager.buildingAmount[this._type]){
            mapManager.buildingAmount[this._type] = 1;
        }
        else {
            mapManager.buildingAmount[this._type] ++;
        }
        switch (this._state){
            case 0:
                break;
            case 1:
            case 2:
                // -1 builder
                PlayerInfoManager.Instance().changeBuilder("current", -1);
                break;
        }
    },

    onClickInfo: function () {
        InfoPopup.appear(this);
    },
    //if valid, send to server
    onClickUpgrade: function () {
        let priceGold = LoadManager.Instance().getConfig(this._type, this._level+1, "gold") || 0;
        let priceElixir = LoadManager.Instance().getConfig(this._type, this._level+1, "elixir") || 0;
        if(!PlayerInfoManager.Instance().checkEnoughResource(priceGold, priceElixir)){
            cc.log("not enough resource");

            //declare price, type is resource not enough
            let priceCount;
            let type;
            if(priceGold)
            {
                priceCount = priceGold- PlayerInfoManager.Instance().getResource("gold");
                type = "gold";
            }
            else{
                priceCount = priceElixir - PlayerInfoManager.Instance().getResource("elixir");
                type = "elixir";
            }
            NotEnoughResourcePopup.appear(priceCount, type);
            return;
        }
        if(!PlayerInfoManager.Instance().getBuilder().current){
            cc.log("not enough builder");
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
                    PlayerInfoManager.Instance().freeBuilderByGem();
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
            return;
        }
        //send to server

        testnetwork.connector.sendUpgradeBuilding(this._id);
    },

    //on cancel, request to server
    onClickStop: function () {


        //if cancel, return 50% resource, if current resource + return resource > max resource, cannot cancel
        let priceGold = LoadManager.Instance().getConfig(this._type, this._level+1, "gold") || 0;
        let priceElixir = LoadManager.Instance().getConfig(this._type, this._level+1, "elixir") || 0;
        let returnGold = Math.floor(priceGold/2);
        let returnElixir = Math.floor(priceElixir/2);
        let maxResource = PlayerInfoManager.Instance().getMaxResource();

        if(PlayerInfoManager.Instance().getResource().gold + returnGold > maxResource.gold ||
            PlayerInfoManager.Instance().getResource().elixir + returnElixir > maxResource.elixir)
        {
            BasicPopup.appear("HỦY XÂY NHÀ", "Kho đã đầy, không thể hủy")
            return
        }

        switch (this._state){
            case 1:
                testnetwork.connector.sendCancelBuild(this._id);
                break;
            case 2:
                testnetwork.connector.sendCancelUpgrade(this._id);
                break;
        }
    },
    onClickQuickFinish: function () {
        let priceGem = Utils.calculateGBuyTime(this._endTime - TimeManager.Instance().getCurrentTimeInSecond());
        let currentGem = PlayerInfoManager.Instance().getResource("gem");
        if(currentGem < priceGem)
        {
            BasicPopup.appear("THIẾU TÀI NGUYÊN", "Bạn không đủ G")
            return;
        }
        testnetwork.connector.sendQuickFinish(this._id);
    },
    quickFinish: function (){
        switch (this._state){
            case 1:
                this.completeBuild();
                break;
            case 2:
                this.completeUpgrade();
                break;
        }
    },

    showPopupUpgrade: function () {
        let popup = new UpgradePopup(this);
        var popupLayer = cc.director.getRunningScene().popUpLayer;
        popupLayer.setVisible(true);
        popupLayer.addChild(popup);
        popup.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    },


    //receive form server when free 1 builder
    onReceivedQuickFinishOfAnother: function (packet) {
        this.onClickUpgrade();
    },

    //receive from server when buy gem success
    onReceivedBuyResourceByGemSuccess: function (packet) {
        let mapLayer = cc.director.getRunningScene().mapLayer;
        let chosenBuilding = mapLayer.getChosenBuilding();
        let modeBuyBuilding = mapLayer.onModeBuyBuilding;

        if(chosenBuilding === this && modeBuyBuilding===true){
            mapLayer.acceptBuyBuilding();
            return;
        }

        this.onClickUpgrade();
    },
    getState: function () {
        return this._state;
    },
    getTimeLeft: function () {
        if(this._state!= null)
        {
            return this._endTime - TimeManager.Instance().getCurrentTimeInSecond();
        }
        return null;
    },
    getLevel: function () {
        return this._level;
    },
    //return 0 if can show upgrade button, 1 if not enough resource, 2 if max level
    getStateUpgradeButton:function(){
        let max_level = BuildingInfo[this._type].max_level;
        let townHall = MapManager.Instance().getTownHall();

        if(this._level === max_level || this._type == "BDH_1"){
            return 2;
        }
        let priceGold = LoadManager.Instance().getConfig(this._type, this._level+1, "gold") || 0;
        let priceElixir = LoadManager.Instance().getConfig(this._type, this._level+1, "elixir") || 0;
        if(!PlayerInfoManager.Instance().checkEnoughResource(priceGold, priceElixir)){
            return 1;
        }
        return 0;
    },
});
