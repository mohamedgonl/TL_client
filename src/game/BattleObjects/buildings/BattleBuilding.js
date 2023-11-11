var BattleBuilding = BattleGameObject.extend({
    ctor: function (level = 1, id, posX, posY, hp) {
        this._super();

        this._level = level;
        this._posX = posX;
        this._posY = posY;
        this._id = id;

        // shadow, grass, body, upper is new cc sprite with nothing
        this._shadow = new cc.Sprite();
        this._grass = new cc.Sprite();
        this._body = new cc.Sprite();
        this._upper = new cc.Sprite();
        this._junk = new cc.Sprite();

        this._junk.setVisible(false);

        this.addChild(this._grass, ZORDER_BUILDING_GRASS);
        this.addChild(this._body, ZORDER_BUILDING_BODY);
        this.addChild(this._shadow, ZORDER_BUILDING_SHADOW);
        this.addChild(this._upper, ZORDER_BUILDING_UPPER);
        this.addChild(this._junk, ZORDER_BUILDING_BODY);

        let config = LoadManager.getInstance().getConfig(this._type, level);
        this._width = config.width * 3;
        this._height = config.height * 3;
        this._maxHp = config.hitpoints;
        this._hp = this._maxHp;

        this.setAnchorPoint(0.5, 0.5);

        this.loadSpriteByLevel(level);

        this.loadSubSprite();

        // this._grass.setGlobalZOrder(10);
        // this._shadow.setGlobalZOrder(20);
        // this._body.setGlobalZOrder(30);
        // this._upper.setGlobalZOrder(40);

        //init action destroy
        this.actionDestroy = fr.createActionByFrames(res_map.SPRITE.BUILDING_EXPLOSION, {delayPerUnit: 0.1, restoreOriginalFrame: true})
        this.actionDestroy.retain();
        this._nodeDestroyAction = new cc.Sprite();
        this._nodeDestroyAction.setPosition(this._nodeDestroyAction.x, this._nodeDestroyAction.y + 60);
        this.addChild(this._nodeDestroyAction);
    },

    //load sprite with size,
    //shadow_type = 1 for quare, 2 for circle, 0 for no shadow
    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation, junkSprite) {

        var size = this._width / 3;
        //body
        this._body.setTexture(bodySprite);
        this._body.setAnchorPoint(0.5, 0.5);
        //if have .offsetMainSpriteY, set position
        if (BuildingInfo[this._type].offsetMainSpriteY) {
            this._body.setPosition(0, BuildingInfo[this._type].offsetMainSpriteY);
        }
        this._body.setScale(SCALE_BUILDING_BODY);

        //body explose
        this._junk.setTexture(junkSprite);
        this._junk.setAnchorPoint(0.5, 0.5);
        this._junk.setScale(SCALE_BUILDING_BODY);

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
        if (upperSprite) {
            // this._upper.setPosition(this._body.getBoundingBox().width,this._body.getBoundingBox().height);

            this._upper.setAnchorPoint(0.5, 0.5);
            this._upper.setScale(SCALE_BUILDING_BODY);
            if (isUpperAnimation) {

                //this._upper = new cc.Sprite(upperSprite[0]);
                //set texture for first frame and remove old action
                this._upper.setTexture(upperSprite[0]);
                this._upper.stopAllActions();


                let animation = new cc.Animation();
                let countFrame = Object.keys(upperSprite).length;


                for (let i = 0; i < countFrame; i++) {
                    animation.addSpriteFrameWithFile(upperSprite[i]);
                }
                animation.setDelayPerUnit(0.1);
                animation.setRestoreOriginalFrame(true);
                let action = cc.animate(animation);
                this._upper.runAction(cc.repeatForever(action))

            } else {
                this._upper.setTexture(upperSprite[0])
            }
        }
    },

    loadSubSprite: function () {
        const size = this._width / 3;

        //progress bar
        this._hpBar = new ccui.Slider();
        this._hpBar.setScale(SCALE_BUILDING_BODY);
        this._hpBar.loadBarTexture(res_map.SPRITE.HEALTH_BAR_BG);
        this._hpBar.loadProgressBarTexture(res_map.SPRITE.BUILDING_HEALTH_BAR);
        this._hpBar.setAnchorPoint(0.5, 1);
        this._hpBar.setPosition(0, 30);
        this._hpBar.setVisible(false);
        this.addChild(this._hpBar, ZORDER_BUILDING_EFFECT);

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

    getLevel: function () {
        return this._level;
    },

    isDestroy: function () {
        return this._hp <= 0;
    },

    onGainDamage: function (damage) {
        if (damage <= 0 || this._hp <= 0)
            return;
        this._hp = Math.max(this._hp - damage, 0);

        //UI
        if (this._hp < this._maxHp) {
            this._hpBar.setVisible(true);
        }
        if (this._hp > 0) {
            let percent = this._hp / this._maxHp * 100;
            this._hpBar.setPercent(percent);
        } else {
            this.onDestroy();
        }
    },

    onDestroy: function () {
        BattleManager.getInstance().onDestroyBuilding(this);

        this._body.setVisible(false);
        this._shadow.setVisible(false);
        this._hpBar.setVisible(false);
        this._junk.setVisible(true);

        //run action destroy
        this._nodeDestroyAction.runAction(this.actionDestroy);
    },

});
