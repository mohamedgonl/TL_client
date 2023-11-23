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

        this.addChild(this._grass, BATTLE_ZORDER_BUILDING_GRASS);
        this.addChild(this._body, BATTLE_ZORDER_BUILDING_BODY);
        this.addChild(this._shadow, BATTLE_ZORDER_BUILDING_SHADOW);
        this.addChild(this._upper, BATTLE_ZORDER_BUILDING_UPPER);
        this.addChild(this._junk, BATTLE_ZORDER_BUILDING_BODY);

        let config = LoadManager.getInstance().getConfig(this._type, level);
        this._width = config.width * GRID_BATTLE_RATIO;
        this._height = config.height * GRID_BATTLE_RATIO;
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
        this.actionDestroy = fr.createActionByFrames(res_map.SPRITE.BUILDING_EXPLOSION, {
            delayPerUnit: 0.1,
            restoreOriginalFrame: false
        })
        this.actionDestroy.retain();
        this._nodeDestroyAction = new cc.Sprite();
        this._nodeDestroyAction.setPosition(this._nodeDestroyAction.x, this._nodeDestroyAction.y + 60);
        this.addChild(this._nodeDestroyAction);
    },

    //load sprite with size,
    //shadow_type = 1 for quare, 2 for circle, 0 for no shadow
    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation, junkSprite) {

        var size = this._width / GRID_BATTLE_RATIO;
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
        const size = this._width / GRID_BATTLE_RATIO;

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
        if (this._hp <= 0) {
            this.onDestroy();
        } else {//UI
            if (this._hp < this._maxHp) {
                this._hpBar.setVisible(true);
            }
            let percent = this._hp / this._maxHp * 100;
            this._hpBar.setPercent(percent);
        }

        let atkEffect = res_troop.EFFECT.ATK_HIT.ANIM.clone();
        let effect = new cc.Sprite();
        //set pos random in -10 10
        let randomX = Math.random() * 20 - 10;
        let randomY = Math.random() * 20 - 10;
        this.addChild(effect, ZORDER_BUILDING_EFFECT);
        effect.setPosition(randomX, randomY);
        effect.runAction(cc.animate(atkEffect));
        effect.setScale(0.5);

        //delete after 0.2
        this.scheduleOnce(function () {
            effect.removeFromParent(true);
        }, 0.2)



        LogUtils.writeLog('building ' + this._id + ' gain ' + damage + ' ~ ' + this._hp)
    },

    onDestroy: function () {
        BattleManager.getInstance().onDestroyBuilding(this);

        this._body.setVisible(false);
        this._shadow.setVisible(false);
        this._upper.setVisible(false);
        this._hpBar.setVisible(false);
        this._junk.setVisible(true);

        //run action destroy
        this._nodeDestroyAction.runAction(this.actionDestroy);

        LogUtils.writeLog('building ' + this._id + ' destroyed')
    },

    //get 4 corners
    getCorners: function () {
        let size = this._width;
        let x = this._posX;
        let y = this._posY;
        return [
            cc.p(x, y),
            cc.p(x + size, y),
            cc.p(x, y + size),
            cc.p(x + size, y + size)
        ];
    },

    toString: function (type) {
        return "BattleBuilding{" +
            "id=" + this._id +
            ", posX=" + this._posX +
            ", posY=" + this._posY +
            ", hp=" + this._hp +
            ", type='" + this._type + '\'' +
            ", level=" + this._level +
            ", width=" + this._width +
            ", height=" + this._height +
            ", maxHp=" + this._maxHp +
            '}';
    }
});
