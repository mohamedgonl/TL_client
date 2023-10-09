
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
    _buttons: [],

    //  example: building = new Townhall(type, level,id, posX, posY);
    ctor: function (type,level =1 ,id,posX,posY,status,startTime,endTime) {

        this._super();
        this._level = level;
        this._posX = posX;
        this._posY = posY;
        this._id = id;
        this._type = type ;
        this._state = status;
        this._startTime = startTime;
        this._endTime = endTime;
        //log all properties, 1 line 1 property
        cc.log("type: " + this._type + " level: " + this._level +
            " posX: " + this._posX + " posY: " + this._posY + " id: " + this._id +
            " status: " + this._state + " startTime: " + this._startTime + " endTime: " + this._endTime);



        let config = LoadManager.Instance().getConfig(this._type,level);
        this._width = config.width;
        this._height = config.height;
        this._hitpoints = config.hitpoints;

        this.setAnchorPoint(0.5,0.5);

    },

    //load sprite with size,
    //shadow_type = 1 for quare, 2 for circle, 0 for no shadow
    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation) {

        var size = this._width;
        //body and grass
        this._body = new cc.Sprite(bodySprite);
        this._grass = new cc.Sprite(res_map.SPRITE.GRASS.BUILDING[size]);
        this._body.setAnchorPoint(0.5,0.5);
        this._grass.setAnchorPoint(0.5,0.5);

        this._body.setScale(SCALE_BUILDING_BODY);

        //shadow
        if(shadow_type === 1){
            this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW[size]);
            this._shadow.setAnchorPoint(0.5,0.5);
        }
        else if(shadow_type === 2){
            this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW.CIRCLE);
           this._shadow.setAnchorPoint(0.5,0.5);
        }


        //upper
        if(upperSprite != null){
            if(isUpperAnimation){

                this._upper = new cc.Sprite(upperSprite[0]);


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
                this._upper = new cc.Sprite(upperSprite);
                this._upper.setAnchorPoint(0.5, 0.5);
                this._upper.setScale(SCALE_BUILDING_BODY);
            }
        }

        //add child
        this.addChild(this._grass,ZORDER_BUILDING_GRASS);
        this.addChild(this._body,ZORDER_BUILDING_BODY);
        if(shadow_type !== 0)
            this.addChild(this._shadow,ZORDER_BUILDING_SHADOW);

        if(upperSprite != null)
            this.addChild(this._upper,ZORDER_BUILDING_UPPER);


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
        this._levelLabel = new cc.LabelBMFont("Level " + this._level, res.FONT.SOJI[FONT_SIZE_LEVEL_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._levelLabel.setAnchorPoint(0.5,0.5);
        this._levelLabel.setPosition(0,50);
        this._levelLabel.setVisible(false);
        this.addChild(this._levelLabel,ZORDER_BUILDING_EFFECT);

        //time label
        this._timeLabel = new cc.LabelBMFont("timeLabel", res.FONT.SOJI[12], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._timeLabel.setAnchorPoint(0.5,0);
        //x = progress bar witdh /2 , y = progress bar height + 10

        this._timeLabel.setPosition(
            this._progressBar.getBoundingBox().width,
            this._progressBar.getBoundingBox().height + 10);

        this._progressBar.addChild(this._timeLabel,ZORDER_BUILDING_EFFECT);
    },

    //init button for building in middle bottom of screen
    setState: function (state) {
        this.state = state;
    },

    onSelected: function(){
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

    getGridPosition: function (){
        return cc.p(this._posX, this._posY);
    },
    setGridPosition: function (posX, posY) {
        this._posX = posX;
        this._posY = posY;
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
            switch (this._state){
                case 1:
                    this.doneBuild();
                    break;
                case 2:
                    this.doneUpgrade();
                    break;
            }
        }
    },
    update: function () {

        if(this._state === 1){

            if(this._progressBar.isVisible() === false)
                this._progressBar.setVisible(true);
            this.updateProgress();
        }
        else{
            if(this._progressBar.isVisible() === true)
                this._progressBar.setVisible(false);
        }
    },
    doneBuild: function () {
        cc.log("done build")
        this._state = 0;
        this._startTime = null;
        this._endTime = null;
    },
    doneUpgrade: function () {
        cc.log("done upgrade")
        this._state = 0;
        this._startTime = null;
        this._endTime = null;
    }

});