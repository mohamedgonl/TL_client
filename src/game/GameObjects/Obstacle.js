var Obstacle = GameObject.extend({
    type: null,
    _posX: null,
    _posY: null,
    _width: null,
    _height: null,
    subSprite:{
        arrow_move: null,
    },
   ctor: function(type,id,posX,posY){
       this._super();
       this.type = type;
       this._posX = posX;
       this._posY = posY;
       this._id = id;
       var configObstacle = LoadManager.Instance().getConfig(this.type,1);
       this._width = configObstacle.width;
       this._height = configObstacle.height;
      this.loadImage();
      this.loadSubSprite();
   },
    //load main sprite
    loadImage: function(){

        let typeIndex = this.type.substring(4);
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
        let subSprite= {};
        subSprite.arrow_move = new cc.Sprite(res_map.SPRITE.ARROW_MOVE[this._width]);
        subSprite.arrow_move.setAnchorPoint(0.5,0.5);
        subSprite.arrow_move.setScale(SCALE_BUILDING_BODY);

        subSprite.arrow_move.setVisible(false);
        this.subSprite = subSprite;
        this.addChild(subSprite.arrow_move);

    },

    onSelected: function(){

        this.subSprite.arrow_move.setVisible(true);
    },
    onUnselected: function(){
        this.subSprite.arrow_move.setVisible(false);
    },
    setType: function (type) {
        this._type = type;
    },

    getType: function () {
        return this._type;
    }
});