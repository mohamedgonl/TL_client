var Obstacle = GameObject.extend({
    _type: null,
    _posX: null,
    _posY: null,
    _width: null,
    _height: null,
    _arrowMove: null,
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

        if(this._status === 1){

        }
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
        this.progressBar = new ccui.Slider();
        this.progressBar.setScale(SCALE_BUILDING_BODY);
        this.progressBar.loadBarTexture(res_map.SPRITE.PROGRESS_BAR_BG);
        this.progressBar.loadProgressBarTexture(res_map.SPRITE.PROGRESS_BAR);
        this.progressBar.setAnchorPoint(0.5, 0.5);
        this.progressBar.setPosition(0,30);
        this.progressBar.setVisible(false);
        this.addChild(this.progressBar);

        //name label
        //nameLabel Cay Coi size 20 dont arial cc.Text
        this._nameLabel = new cc.LabelBMFont(this._type, res.FONT.SOJI[FONT_SIZE_NAME_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._nameLabel.setAnchorPoint(0.5,0.5);
        this._nameLabel.setPosition(0,50);
        this._nameLabel.setColor(new cc.Color(255, 255, 0));
        this.addChild(this._nameLabel);

    },

    onSelected: function(){
        this._arrowMove.setVisible(true);
        //dispatch event EVENT_SELECT_BUILDING with building._id
        cc.eventManager.dispatchCustomEvent(EVENT_SELECT_BUILDING, this._id);
    },
    onUnselected: function(){
        this._arrowMove.setVisible(false);
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
        this.progressBar.setPercent(percent);

        if(currentTime >= this._endTime){
            this.doneRemove();
        }
    },
    update: function (dt) {
        if(this._status === 1){
            if(this.progressBar.isVisible() === false)
                this.progressBar.setVisible(true);
            this.updateProgress();
        }
        else{
            this.progressBar.setVisible(false);
        }
    },
    startRemove: function (startTime,endTime) {
        //enable progress bar
        this._status = 1;
        this._startTime = startTime;
        this._endTime = endTime;
    },
    doneRemove: function () {
        this._status = 0;
        this._startTime = null;
        this._endTime = null;
        MapManager.Instance().removeObstacle(this)
        //xoa obstacle khoi layer
        cc.director.getRunningScene().mapLayer.removeObstacle(this);

    }
});