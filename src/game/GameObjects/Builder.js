var Builder = cc.Sprite.extend({

    ctor: function(state, target)
    {
        this._super();
        this._body = new cc.Sprite();
        this._body.setTexture(res_map.SPRITE.BUILDER.DOWN[0]);
        this._body.setScale(0.5,0.5)
        this._body.setAnchorPoint(0.5,0.5);
        this.addChild(this._body);

        this._shadow = new cc.Sprite(res_map.SPRITE.SHADOW.TROOP_SMALL);
        this._shadow.setAnchorPoint(0.5,0.5);
        this._shadow.setScale(0.3,0.3);
        this.addChild(this._shadow);

        this._animationDown = this.createAnimation(res_map.SPRITE.BUILDER.DOWN);
        this._animationUp = this.createAnimation(res_map.SPRITE.BUILDER.UP);
        this._animationLeft = this.createAnimation(res_map.SPRITE.BUILDER.LEFT);
        this._animationDownLeft = this.createAnimation(res_map.SPRITE.BUILDER.DOWN_LEFT);
        this._animationUpLeft = this.createAnimation(res_map.SPRITE.BUILDER.UP_LEFT);
        this._animationBuildUp = this.createAnimation(res_map.SPRITE.BUILDER.BUILD.UP);

        this._animationUp.retain();
        this._animationDown.retain();
        this._animationLeft.retain();
        this._animationDownLeft.retain();
        this._animationUpLeft.retain();
        this._animationBuildUp.retain();

        cc.eventManager.addCustomListener(EVENT_TROOP_NAME.MOVE_BUILDING, this.handleMapChange.bind(this))
        cc.eventManager.addCustomListener(EVENT_FINISH_BUILDING,this.onFinishBuild.bind(this));



        if(state === "init")
        {
            let mapLayer = cc.director.getRunningScene().getMapLayer();
            let listBDH = MapManager.Instance().getListBuilderHut();
            this._builderHut = listBDH[0];
            let posStartInMap = mapLayer.getMapPosFromGridPos(cc.pAdd(this._builderHut.getGridPosition(), cc.p(1,0)));
            this.setPosition(posStartInMap.x,posStartInMap.y);
            this._gridPosition = cc.pAdd(this._builderHut.getGridPosition(), cc.p(1,0));
            this._currentAnim = this._animationDown;
            this._target = target;
            this._indexMove = 0;
            this._path = AlgorithmImplement.Instance().searchPathByAStar([this._gridPosition.x,this._gridPosition.y],[target.getGridPosition().x,target.getGridPosition().y]);
            this.runToTarget();
        }
        else if(state === "isBuilding")
        {
            // let mapLayer = cc.director.getRunningScene().mapLayer;
            // let posStartInMap = mapLayer.getMapPosFromGridPos(target.getGridPosition(), true);
            // this.setPosition(posStartInMap.x,posStartInMap.y);
            this._gridPosition = target.getGridPosition();
            this._currentAnim = this._animationBuildUp;
            this._target = target;
            this.build();
        }
    },

    runToTarget: function () {

        let mapLayer = cc.director.getRunningScene().getMapLayer();
        let posInMapTarget = mapLayer.getMapPosFromGridPos(this._target.getGridPosition());


        //if targeted, start build
        if(this._gridPosition.x === this._target.getGridPosition().x && this._gridPosition.y === this._target.getGridPosition().y)
        {
            cc.log("DONE");
            let center = mapLayer.getMapPosFromGridPos(this._target.getGridPosition(), true);
            //if target is BDH, remove builder
            if(this._target === this._builderHut)
            {
                this.removeFromParent();
                return;
            }
            this.runAction(cc.sequence(cc.moveTo(0.2, center.x, center.y), cc.callFunc(this.build.bind(this), this)));
            // this.build();
            return;
        }

        if(this._indexMove === this._path.length -1)
        {
            let posInMap = cc.director.getRunningScene().getMapLayer().getMapPosFromGridPos(this._target.getGridPosition());
            this.runAction(cc.sequence(cc.moveTo(1, posInMap.x, posInMap.y), cc.callFunc(this.runToTarget.bind(this), this)));
            this._gridPosition = this._target.getGridPosition();
            return;
        }
        let path = this._path;
        let newPos = path[this._indexMove];
        //move to newPos in 0.5s
        let posInMap = mapLayer.getMapPosFromGridPos(newPos);
        this._indexMove++;
        let directX = newPos.x - this._gridPosition.x;
        let directY = newPos.y - this._gridPosition.y;
        if(directX === 1 && directY === 1)
        {
            if(this._currentAnim !== this._animationUp)
            {
                this._body.stopAllActions();
                this._body.runAction(cc.animate(this._animationUp).repeatForever());
            }
            this._currentAnim = this._animationUp;
        }
        else if(directX === 1 && directY === -1)
        {
            // this._body.setTexture(res_map.SPRITE.BUILDER.LEFT[0]);
            if(this._currentAnim !== this._animationLeft)
            {
                this._body.stopAllActions();
                this._body.runAction(cc.animate(this._animationLeft).repeatForever());
            }
            this._currentAnim = this._animationLeft;
            //flip X
            this._body.setScale(-0.5,0.5);

        }
        else if(directX === -1 && directY === 1)
        {
            // this._body.setTexture(res_map.SPRITE.BUILDER.LEFT[0]);
            if(this._currentAnim !== this._animationLeft)
            {
                this._body.stopAllActions();
                this._body.runAction(cc.animate(this._animationLeft).repeatForever());
            }
            this._currentAnim = this._animationLeft;
        }
        else if(directX === -1 && directY === -1)
        {
            // this._body.setTexture(res_map.SPRITE.BUILDER.DOWN[0]);
            if(this._currentAnim !== this._animationDown)
            {
                this._body.stopAllActions();
                this._body.runAction(cc.animate(this._animationDown).repeatForever());
            }
            this._currentAnim = this._animationDown;
        }
        else if(directX === -1 && directY === 0)
        {
            // this._body.setTexture(res_map.SPRITE.BUILDER.DOWN_LEFT[0]);
            if(this._currentAnim !== this._animationDownLeft)
            {
                this._body.stopAllActions();
                this._body.runAction(cc.animate(this._animationDownLeft).repeatForever());
            }
            this._currentAnim = this._animationDownLeft;
        }
        else if(directX === 0 && directY === 1)
        {
            // this._body.setTexture(res_map.SPRITE.BUILDER.UP_LEFT[0]);
            if(this._currentAnim !== this._animationUpLeft)
            {
                this._body.stopAllActions();
                this._body.runAction(cc.animate(this._animationUpLeft).repeatForever());
            }
            this._currentAnim = this._animationUpLeft;
        }
        else if(directX === 0 && directY === -1)
        {
            // this._body.setTexture(res_map.SPRITE.BUILDER.DOWN_LEFT[0]);
            if(this._currentAnim !== this._animationDownLeft)
            {
                this._body.stopAllActions();
                this._body.runAction(cc.animate(this._animationDownLeft).repeatForever());
            }
            this._currentAnim = this._animationDownLeft;
            this._body.setScale(-0.5,0.5)
        }
        else if(directX === 1 && directY === 0)
        {
            // this._body.setTexture(res_map.SPRITE.BUILDER.UP_LEFT[0]);
            if(this._currentAnim !== this._animationUpLeft)
            {
                this._body.stopAllActions();
                this._body.runAction(cc.animate(this._animationUpLeft).repeatForever());
            }
            this._currentAnim = this._animationUpLeft;
            this._body.setScale(-0.5,0.5)
        }
        this._gridPosition = newPos;
        this.runAction(cc.sequence(cc.moveTo(0.5, posInMap.x, posInMap.y), cc.callFunc(this.runToTarget.bind(this), this)));
    },
    getGridPosition: function () {
        return this._gridPosition;
    },

    createAnimation: function (texture) {
        // cc.log(JSON.stringify(texture,null,2));
        let animation = new cc.Animation();
        let length = Object.keys(texture).length;
        animation.addSpriteFrameWithFile(texture[0]);
        for(let i = 0; i < length; i++)
        {
            animation.addSpriteFrameWithFile(texture[i]);
        }
        animation.setDelayPerUnit(0.15);
        animation.setRestoreOriginalFrame(true);
        return animation;
        // return cc.animate(animation).repeatForever();
    },
    build: function () {
        // cc.log("BUILDING");
        this._body.stopAllActions();
        this._body.setTexture(res_map.SPRITE.BUILDER.BUILD.UP[0]);
        this._body.runAction(cc.animate(this._animationBuildUp).repeatForever());
    },
    handleMapChange: function (event) {
        cc.log("GRID MAP CHANGED!" + JSON.stringify(event));
        const Algorithm = AlgorithmImplement.Instance();
        Algorithm.setGridMapStar(MapManager.Instance().mapGrid);
        this._path = Algorithm.searchPathByAStar([this._gridPosition.x,this._gridPosition.y],[this._target.getGridPosition().x,this._target.getGridPosition().y]);
        this._indexMove = 0;
        this.runToTarget();
    },
    onFinishBuild: function (event) {
        cc.log(JSON.stringify(event))
        if(event.getUserData() !== this._target._id) return;
        this._body.stopAllActions();
        //runTo builder hut
        let buiderHut = MapManager.Instance().getListBuilderHut()[0];
        let mapLayer = cc.director.getRunningScene().getMapLayer();
        this._target = buiderHut;
        this._path = AlgorithmImplement.Instance().searchPathByAStar([this._gridPosition.x,this._gridPosition.y],[buiderHut.getGridPosition().x,buiderHut.getGridPosition().y]);
        this._indexMove = 0;
        this.runToTarget();
    }
});
/*
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
*/
