var Obstacle = GameObject.extend({
    type: null,
    posX: null,
    posY: null,
    _width: null,
    _height: null,
   ctor: function(type,id,posX,posY){
       this._super();
       this.type = type;
       this.posX = posX;
       this.posY = posY;
       this._id = id;


       var configObstacle = ConfigManager.Instance().getObstacle(type);
       this._width = configObstacle.width;
       this._height = configObstacle.height;
      this.loadImage();
   },

    loadImage: function(){
        // res/Buildings/obstacle/ OBS_1/idle/image0000.png

        var body_link = res_map.SPRITE.BODY.OBS_LINK + this.type + "/idle/image0000.png";
        var grass_link = res_map.SPRITE.GRASS.OBSTACLE[this._width];
        this._body = new cc.Sprite(body_link);
        this._grass = new cc.Sprite(grass_link);

        this._body.setAnchorPoint(0.5,0.5);
        this._grass.setAnchorPoint(0.5,0.5);

        this._body.setScale(0.5);

        this.addChild(this._grass);
        this.addChild(this._body);
    }

    //get width, height bt type

});