
// Constructor Building
//  level: level of building
//  posX: position x of building
//  posY: position y of building
var Building = GameObject.extend({
    _hitpoints: null,
    _level: null,
    _state:null,
    _yesButton: null,
    _noButton: null,
    _width: null,
    _height: null,
    _arrow_move: null,

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
        // shadow, grass, body, upper is new cc sprite with nothing
        this._shadow = new cc.Sprite();
        this._grass = new cc.Sprite();
        this._body = new cc.Sprite();
        this._upper = new cc.Sprite();

        this.addChild(this._grass,ZORDER_BUILDING_GRASS);
        this.addChild(this._body,ZORDER_BUILDING_BODY);
        this.addChild(this._shadow,ZORDER_BUILDING_SHADOW);
        this.addChild(this._upper,ZORDER_BUILDING_UPPER);

        let config = LoadManager.Instance().getConfig(this._type,level);
        this._width = config.width;
        this._height = config.height;
        this._hitpoints = config.hitpoints;

        this.setAnchorPoint(0.5,0.5);

        this.loadSpriteByLevel(level);

        this.loadSubSprite();
        this.initState();
    },

    //load sprite with size,
    //shadow_type = 1 for quare, 2 for circle, 0 for no shadow
    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation) {

        var size = this._width;
        //body
        this._body.setTexture(bodySprite)
        this._body.setAnchorPoint(0.5,0.5);
        this._body.setScale(SCALE_BUILDING_BODY);


        //grass
        this._grass.setTexture(res_map.SPRITE.GRASS.BUILDING[size]);
        this._grass.setAnchorPoint(0.5,0.5);

        //shadow
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

        //upper
        if(upperSprite != null){
            if(isUpperAnimation){

                //this._upper = new cc.Sprite(upperSprite[0]);
                //set texture for first frame and remove old action
                this._upper.setTexture(upperSprite[0]);
                this._upper.stopAllActions();


                var animation = new cc.Animation();
                var countFrame = Object.keys(upperSprite).length;


                for (var i = 0; i < countFrame; i++) {
                    animation.addSpriteFrameWithFile(upperSprite[i]);
                }
                cc.log(animation.getFrames().length);
                animation.setDelayPerUnit(0.3);
                animation.setRestoreOriginalFrame(true);
                var action = cc.animate(animation);

                this._upper.runAction(cc.repeatForever(action))

                this._upper.setAnchorPoint(0.5, 0.5);
                this._upper.setScale(SCALE_BUILDING_BODY);

            }
            else {

                // this._upper = new cc.Sprite(upperSprite);
                this._upper.setTexture(upperSprite)
                this._upper.setAnchorPoint(0.5, 0.5);
                this._upper.setScale(SCALE_BUILDING_BODY);
            }
        }




    },
    loadSubSprite: function(){
        //arrow move
        this._arrow_move = new cc.Sprite(res_map.SPRITE.ARROW_MOVE[this._width]);
        this._arrow_move.setAnchorPoint(0.5,0.5);
        this._arrow_move.setScale(SCALE_BUILDING_BODY);
        this._arrow_move.setVisible(false);
        this.addChild(this._arrow_move);

        //green square
        this._green_square = new cc.Sprite(res_map.SPRITE.GREEN_SQUARE[this._width]);
        this._green_square.setAnchorPoint(0.5,0.5);
        this.addChild(this._green_square,ZORDER_BUILDING_SQUARE);
        this._green_square.setVisible(false);

        //red square
        this._red_square = new cc.Sprite(res_map.SPRITE.RED_SQUARE[this._width]);
        this._red_square.setAnchorPoint(0.5,0.5);
        this.addChild(this._red_square,ZORDER_BUILDING_SQUARE);
        this._red_square.setVisible(false);


        //name label
        this._nameLabel = new cc.LabelBMFont(this._type, res.FONT.SOJI[FONT_SIZE_NAME_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._nameLabel.setAnchorPoint(0.5,0.5);
        this._nameLabel.setPosition(0,80);
        this._nameLabel.setColor(new cc.Color(255, 255, 0));
        this._nameLabel.setVisible(false);
        this.addChild(this._nameLabel,ZORDER_BUILDING_EFFECT);


        //progress bar
        this._progressBar = new ccui.Slider();
        this._progressBar.setScale(SCALE_BUILDING_BODY);
        this._progressBar.loadBarTexture(res_map.SPRITE.PROGRESS_BAR_BG);
        this._progressBar.loadProgressBarTexture(res_map.SPRITE.PROGRESS_BAR);
        this._progressBar.setAnchorPoint(0.5, 1);
        this._progressBar.setPosition(0,30);
        this._progressBar.setVisible(false);
        this.addChild(this._progressBar,ZORDER_BUILDING_EFFECT);

        //level label
        this._levelLabel = new cc.LabelBMFont("Cấp " + this._level, res.FONT.SOJI[FONT_SIZE_LEVEL_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._levelLabel.setAnchorPoint(0.5,0.5);
        this._levelLabel.setPosition(0,50);
        this._levelLabel.setVisible(false);
        this.addChild(this._levelLabel,ZORDER_BUILDING_EFFECT);

        //time label
        this._timeLabel = new cc.LabelBMFont("", res.FONT.SOJI[12], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._timeLabel.setAnchorPoint(0.5,0);
        //x = progress bar witdh /2 , y = progress bar height + 10

        this._timeLabel.setPosition(
            this._progressBar.getBoundingBox().width,
            this._progressBar.getBoundingBox().height + 10);

        this._progressBar.addChild(this._timeLabel,ZORDER_BUILDING_EFFECT);
    },
    initState: function () {
        switch (this._state){
            case 0:
                this._arrow_move.setVisible(false);
                this._nameLabel.setVisible(false);
                this._levelLabel.setVisible(false);
                break;
            case 1:
            case 2:
                this._progressBar.setVisible(true);
                // this.update();
                this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
                break;
        }
    },

    //load button for building, reload when select building, upgrade, build, cancel
    loadButton: function(){
        cc.log("load button")
        let infoLayer = cc.director.getRunningScene().infoLayer;
        //xoa het button cu
        infoLayer.removeAllButtonInMenu();
        infoLayer.addButtonToMenu("Thông tin",res.BUTTON.INFO_BUTTON,0,this.onClickInfo.bind(this),this);
        if(this._state !==0) {
            infoLayer.addButtonToMenu("Hủy",res.BUTTON.CANCEL_BUTTON,0,this.onClickStop.bind(this),this);
            infoLayer.addButtonToMenu("Xong ngay",res.BUTTON.QUICK_FINISH_BUTTON,0,this.onClickQuickFinish.bind(this),this);
        }
    },

    onSelected: function(){
        this.loadButton();
        this._arrow_move.setVisible(true);
        this._nameLabel.setVisible(true);
        this._levelLabel.setVisible(true);
        cc.eventManager.dispatchCustomEvent(EVENT_SELECT_BUILDING, this._id);
    },
    onUnselected: function(){
        this._arrow_move.setVisible(false);
        this._nameLabel.setVisible(false);
        this._levelLabel.setVisible(false);
        cc.eventManager.dispatchCustomEvent(EVENT_UNSELECT_BUILDING);
    },

    setType: function (type) {
        this._type = type;
    },

    getType: function () {
        return this._type;
    },
    setLastCollectTime: function (lastCollectTime) {
        this._lastCollectTime = lastCollectTime;
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
        this._timeLabel.setString(getTimeString(time));

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
        this.loadButton();
        //if state = 1, get price
        let priceGold = LoadManager.Instance().getConfig(this._type, this._level, "gold") || 0;
        let priceElixir = LoadManager.Instance().getConfig(this._type, this._level, "elixir") || 0;
        let priceGem = LoadManager.Instance().getConfig(this._type, this._level, "coin") || 0;
        if(this._state === 2){
            priceGold = LoadManager.Instance().getConfig(this._type, this._level+1, "gold") || 0;
            priceElixir = LoadManager.Instance().getConfig(this._type, this._level+1, "elixir") || 0;
            priceGem = LoadManager.Instance().getConfig(this._type, this._level+1, "coin") || 0;
        }
        PlayerInfoManager.Instance().addResource({gold:-priceGold,elixir:-priceElixir,gem:-priceGem})
        PlayerInfoManager.Instance().changeBuilder("current", -1);
        //enable progress bar
        this._progressBar.setVisible(true);

        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
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
    },

    completeProcess: function () {
        this._state = 0;
        this._startTime = null;
        this._endTime = null;
        this._progressBar.setVisible(false);
        PlayerInfoManager.Instance().changeBuilder("current", 1);
        //unschedule update
        this.unschedule(this.update);
    },
    completeBuild: function () {
        this.completeProcess();
        cc.log("level: " + this._level);
    },
    completeUpgrade: function () {
        this.completeProcess();
        this._level += 1;
        //set sprite for new level and update level label
        this._levelLabel.setString("Cấp " + this._level);
        this.loadSpriteByLevel(this._level)
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
        PlayerInfoManager.Instance().changeResource("gold", returnGold);
        PlayerInfoManager.Instance().changeResource("elixir", returnElixir);
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
        MapManager.Instance().removeBuilding(this._id);

    },

    cancelUpgrade: function () {
        this.cancelProcess();
    },

    onAddIntoMapManager: function () {

    },

    onClickInfo: function () {
        cc.log("onClickInfo " + this._id);
    },
    //if valid, send to server
    onClickUpgrade: function () {
        let priceGold = LoadManager.Instance().getConfig(this._type, this._level+1, "gold") || 0;
        let priceElixir = LoadManager.Instance().getConfig(this._type, this._level+1, "elixir") || 0;
        if(!PlayerInfoManager.Instance().checkEnoughResource(priceGold, priceElixir)){
            cc.log("not enough resource");
            return;
        }
        if(!PlayerInfoManager.Instance().getBuilder().current){
            cc.log("not enough builder");
            return;
        }
        //send to server
        cc.log("send to server");
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

        if(PlayerInfoManager.Instance().getResource().gold + returnGold > maxResource.gold){
            cc.log("kho đã đầy, không thể hủy");
            return
        }
        if(PlayerInfoManager.Instance().getResource().elixir + returnElixir > maxResource.elixir){
            cc.log("kho đã đầy, không thể hủy");
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
        cc.log("onClickQuickFinish");
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
    }
});