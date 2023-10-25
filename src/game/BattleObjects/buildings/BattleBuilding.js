var BattleBuilding = BattleGameObject.extend({
    ctor: function (level = 1, id, posX, posY, hp) {
        this._super();

        this._level = level;
        this._posX = posX;
        this._posY = posY;
        this._id = id;
        this._hp = hp;

        // shadow, grass, body, upper is new cc sprite with nothing
        this._shadow = new cc.Sprite();
        this._grass = new cc.Sprite();
        this._body = new cc.Sprite();
        this._upper = new cc.Sprite();

        this.addChild(this._grass, ZORDER_BUILDING_GRASS);
        this.addChild(this._body, ZORDER_BUILDING_BODY);
        this.addChild(this._shadow, ZORDER_BUILDING_SHADOW);
        this.addChild(this._upper, ZORDER_BUILDING_UPPER);

        let config = LoadManager.Instance().getConfig(this._type, level);
        this._width = config.width;
        this._height = config.height;
        this._hitpoints = config.hitpoints;

        this.setAnchorPoint(0.5, 0.5);

        this.loadSpriteByLevel(level);

        this.loadSubSprite();

        // this._grass.setGlobalZOrder(10);
        // this._shadow.setGlobalZOrder(20);
        // this._body.setGlobalZOrder(30);
        // this._upper.setGlobalZOrder(40);
    },

    //load sprite with size,
    //shadow_type = 1 for quare, 2 for circle, 0 for no shadow
    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation) {

        var size = this._width;
        //body
        this._body.setTexture(bodySprite);
        this._body.setAnchorPoint(0.5, 0.5);
        this._body.setScale(SCALE_BUILDING_BODY);


        //grass
        this._grass.setTexture(res_map.SPRITE.GRASS.BUILDING[size]);
        this._grass.setAnchorPoint(0.5, 0.5);

        //shadow
        if (shadow_type === 1) {
            //this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW[size]);
            this._shadow.setTexture(res_map.SPRITE.SHADOW[size])

            this._shadow.setAnchorPoint(0.5, 0.5);
        } else if (shadow_type === 2) {
            //this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW.CIRCLE);
            this._shadow.setTexture(res_map.SPRITE.SHADOW.CIRCLE)
            this._shadow.setAnchorPoint(0.5, 0.5);
        }

        //upper
        if (upperSprite != null) {
            if (isUpperAnimation) {

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

            } else {

                // this._upper = new cc.Sprite(upperSprite);
                this._upper.setTexture(upperSprite)
                this._upper.setAnchorPoint(0.5, 0.5);
                this._upper.setScale(SCALE_BUILDING_BODY);
            }
        }


    },

    loadSubSprite: function () {
        //arrow move
        this._arrow_move = new cc.Sprite(res_map.SPRITE.ARROW_MOVE[this._width]);
        this._arrow_move.setAnchorPoint(0.5, 0.5);
        this._arrow_move.setScale(SCALE_BUILDING_BODY);
        this._arrow_move.setVisible(false);
        // this._arrow_move.setGlobalZOrder(MAP_ZORDER_BUILDING+1)
        this.addChild(this._arrow_move, ZORDER_BUILDING_EFFECT);

        //green square
        this._green_square = new cc.Sprite(res_map.SPRITE.GREEN_SQUARE[this._width]);
        this._green_square.setAnchorPoint(0.5, 0.5);
        this.addChild(this._green_square, ZORDER_BUILDING_SQUARE);
        this._green_square.setVisible(false);

        //red square
        this._red_square = new cc.Sprite(res_map.SPRITE.RED_SQUARE[this._width]);
        this._red_square.setAnchorPoint(0.5, 0.5);
        this.addChild(this._red_square, ZORDER_BUILDING_SQUARE);
        this._red_square.setVisible(false);


        //name label
        this._nameLabel = new cc.LabelBMFont(BuildingInfo[this._type].name, res.FONT.SOJI[FONT_SIZE_NAME_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._nameLabel.setAnchorPoint(0.5, 0.5);
        this._nameLabel.setPosition(0, 80);
        this._nameLabel.setColor(new cc.Color(255, 255, 0));
        this._nameLabel.setVisible(false);
        this.addChild(this._nameLabel, ZORDER_BUILDING_EFFECT);


        //progress bar
        this._progressBar = new ccui.Slider();
        this._progressBar.setScale(SCALE_BUILDING_BODY);
        this._progressBar.loadBarTexture(res_map.SPRITE.PROGRESS_BAR_BG);
        this._progressBar.loadProgressBarTexture(res_map.SPRITE.PROGRESS_BAR);
        this._progressBar.setAnchorPoint(0.5, 1);
        this._progressBar.setPosition(0, 30);
        this._progressBar.setVisible(false);
        this.addChild(this._progressBar, ZORDER_BUILDING_EFFECT);

        //level label
        this._levelLabel = new cc.LabelBMFont("Cấp " + this._level, res.FONT.SOJI[FONT_SIZE_LEVEL_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._levelLabel.setAnchorPoint(0.5, 0.5);
        this._levelLabel.setPosition(0, 50);
        this._levelLabel.setVisible(false);
        this.addChild(this._levelLabel, ZORDER_BUILDING_EFFECT);

        //time label
        this._timeLabel = new cc.LabelBMFont("", res.FONT.SOJI[12], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._timeLabel.setAnchorPoint(0.5, 0);
        //x = progress bar witdh /2 , y = progress bar height + 10

        this._timeLabel.setPosition(
            this._progressBar.getBoundingBox().width,
            this._progressBar.getBoundingBox().height + 10);

        this._progressBar.addChild(this._timeLabel, ZORDER_BUILDING_EFFECT);

        //effect fence when build upgrade
        this._fence = new cc.Sprite(res_map.SPRITE.FENCE);
        this._fence.setAnchorPoint(0.5, 0);
        this.addChild(this._fence, ZORDER_BUILDING_EFFECT);
        //set pos below 0 0 of building = height grass/2 + offset
        this._fence.setPosition(0, -this._grass.getBoundingBox().height / 2 + 5);
        this._fence.setVisible(false);


        // this._arrow_move.setGlobalZOrder(45);
        // this._green_square.setGlobalZOrder(15);
        // this._red_square.setGlobalZOrder(15);
        // this._nameLabel.setGlobalZOrder(47);
        // this._levelLabel.setGlobalZOrder(47);
        // this._progressBar.setGlobalZOrder(48);
        // this._timeLabel.setGlobalZOrder(49);
        // this._fence.setGlobalZOrder(42);
        //
        //
        // this._grass.setGlobalZOrder(10);
        // this._shadow.setGlobalZOrder(20);
        // this._body.setGlobalZOrder(30);
        // this._upper.setGlobalZOrder(40);
    },
    initState: function () {

    },

    setType: function (type) {
        this._type = type;
    },

    getType: function () {
        return this._type;
    },
    getGridPosition: function () {
        return cc.p(this._posX, this._posY);
    },
    setGridPosition: function (posX, posY) {
        this._posX = posX;
        this._posY = posY;
    },

    update: function () {
        if (this._state === 1 || this._state === 2) {
            this.updateProgress();
        } else {
            this.unschedule(this.update);
        }
    },


    onAddIntoMapManager: function () {
        let mapManager = MapManager.Instance();
        if (!mapManager.buildingAmount[this._type]) {
            mapManager.buildingAmount[this._type] = 1;
        } else {
            mapManager.buildingAmount[this._type]++;
        }
        switch (this._state) {
            case 0:
                this._arrow_move.setVisible(false);
                this._nameLabel.setVisible(false);
                this._levelLabel.setVisible(false);
                break;
            case 1:
            case 2:
                this._progressBar.setVisible(true);
                this._fence.setVisible(true);
                // -1 builder
                PlayerInfoManager.Instance().changeBuilder("current", -1);
                this.update();
                this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
                break;
        }
    },

    getLevel: function () {
        return this._level;
    },

});
