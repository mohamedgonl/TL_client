
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

        //progress bar
        this.progressBar = new ccui.Slider();
        this.progressBar.setScale(SCALE_BUILDING_BODY);
        this.progressBar.loadBarTexture(res_map.SPRITE.PROGRESS_BAR_BG);
        this.progressBar.loadProgressBarTexture(res_map.SPRITE.PROGRESS_BAR);
        this.progressBar.setAnchorPoint(0.5, 0.5);
        this.progressBar.setPosition(0,30);
        // this.progressBar.setVisible(false);
        this.addChild(this.progressBar,ZORDER_BUILDING_EFFECT);

        //name label
        this._nameLabel = new cc.LabelBMFont(this._type, res.FONT.SOJI[FONT_SIZE_NAME_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._nameLabel.setAnchorPoint(0.5,0.5);
        this._nameLabel.setPosition(0,50);
        this._nameLabel.setColor(new cc.Color(255, 255, 0));
        this.addChild(this._nameLabel,ZORDER_BUILDING_EFFECT);
        // this._nameLabel.setVisible(false);
    },

    setState: function (state) {
        this.state = state;
    },
    onSelected: function(){
        this._arrow_move.setVisible(true);
        this._nameLabel.setVisible(true);
    },
    onUnselected: function(){
        this._arrow_move.setVisible(false);
        this._nameLabel.setVisible(false);
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
        this.progressBar.setPercent(percent);

        if(currentTime >= this._endTime){
            switch (this._state){
                case 1:
                    this.doneBuild();
                case 2:
                    this.doneUpgrade();
            }
        }
    },
    update: function () {

        if(this._state === 1){

            if(this.progressBar.isVisible() === false)
                this.progressBar.setVisible(true);
            this.updateProgress();
        }
        else{
            if(this.progressBar.isVisible() === true)
                this.progressBar.setVisible(false);
        }
    },
    startRemove: function (startTime,endTime) {
        //enable progress bar
        this._state = 1;
        this._startTime = startTime;
        this._endTime = endTime;
    },
    doneBuild: function () {
        this._state = 0;
        this._startTime = null;
        this._endTime = null;
    }



});