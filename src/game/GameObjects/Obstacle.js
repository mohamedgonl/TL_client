var Obstacle = GameObject.extend({
    _type: null,
    _posX: null,
    _posY: null,
    _width: null,
    _height: null,
    _arrowMove: null,
    _buttons: {},
    //status = 0: normal, 1: removing
   ctor: function(type,id,posX,posY,status=0,startTime,endTime){
       this._super();
       this._type = type;
       this._posX = posX;
       this._posY = posY;
       this._id = id;
       this._status = status;
       this._startTime = startTime;
       this._endTime = endTime;
       //log all
         cc.log("type: " + this._type + " posX: " + this._posX + " posY: " + this._posY + " id: " + this._id + " status: " + this._status + " startTime: " + this._startTime + " endTime: " + this._endTime);
       this.init();
   },
    init: function (){

        //load config
        var configObstacle = LoadManager.Instance().getConfig(this._type,1);
        this._width = configObstacle.width;
        this._height = configObstacle.height;

        //load sprites
        this.loadMainSprite();
        this.loadSubSprite();
        //schedule update 1s 1 time
        this.update()
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0)
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
        this.addChild(this._arrowMove);

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
        this._nameLabel = new cc.LabelBMFont(this._type, res.FONT.SOJI[FONT_SIZE_NAME_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
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
        infoLayer.addButtonToMenu("Dọn dẹp",res.BUTTON.REMOVE_BUTTON,0,this.onClickRemove.bind(this));
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
    updateProgress: function (){
        //log start time, end time, current time
        cc.log("elasped time: " + (this._endTime - this._startTime));
        cc.log("current time: " + (new Date().getTime() - this._startTime));
        let currentTime = new Date().getTime();
        let percent = (currentTime - this._startTime)/(this._endTime - this._startTime)*100;
        this._progressBar.setPercent(percent);

        //set time label = end time - current time in 1d2h3m40s format, if 0d -> 2h3m40s, if 0d0h -> 3m40s
        let time = this._endTime - currentTime;
        let timeString = "";
        if(time >= 86400000){
            timeString += Math.floor(time/86400000) + "d";
            time = time%86400000;
        }
        if(time >= 3600000){
            timeString += Math.floor(time/3600000) + "h";
            time = time%3600000;
        }
        if(time >= 60000){
            timeString += Math.floor(time/60000) + "m";
            time = time%60000;
        }
        if(time >= 1000){
            timeString += Math.floor(time/1000) + "s";
        }
        else
            timeString += "0s";

        this._timeLabel.setString(timeString);

        if(currentTime >= this._endTime){
            this.doneRemove();
        }
    },
    update: function (dt) {
        if(this._status === 1){
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
        this._status = 1;
        this._startTime = startTime;
        this._endTime = endTime;

        //decrease buildtime 10 times
        //test
        this._endTime = this._startTime + (this._endTime - this._startTime)/10;


        let playerInfoManager = PlayerInfoManager.Instance();
        let priceGold = LoadManager.Instance().getConfig(this._type,this._level,"gold");
        let priceElixir = LoadManager.Instance().getConfig(this._type,this._level,"elixir");
        playerInfoManager.changeResource("gold",-priceGold);
        playerInfoManager.changeResource("elixir",-priceElixir);
        playerInfoManager.changeBuilder("current",-1);
    },
    doneRemove: function () {
        this._status = 0;
        this._startTime = null;
        this._endTime = null;
        MapManager.Instance().removeObstacle(this)
        //xoa obstacle khoi layer
        cc.director.getRunningScene().mapLayer.removeObstacle(this);

        let playerInfoManager = PlayerInfoManager.Instance();
        playerInfoManager.changeBuilder("current",1);

    },
    //check to client, if valid then send packet to server
    onClickRemove: function(){

        //check client
        let playerInfoManager = PlayerInfoManager.Instance();
        let priceGold = LoadManager.Instance().getConfig(this._type,this._level,"gold");
        let priceElixir = LoadManager.Instance().getConfig(this._type,this._level,"elixir");
        if(playerInfoManager.getResource("gold") < priceGold || playerInfoManager.getResource("elixir") < priceElixir)
        {
            cc.log("not enough resource");
            return;
        }

        if(playerInfoManager.getBuilder().current <= 0)
        {
            cc.log("not enough builder");
            return;
        }

        //gui goi tin xoa obstacle

        let packet = {
            error : 0,
            id : this._id,
            status: 1,
            type: this._type,
            startTime: Date.now(),
            endTime: Date.now() + LoadManager.Instance().getConfig(this._type,this._level,"buildTime")*1000
        }
        this.onReceiveClickRemove(packet);
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
    }
});