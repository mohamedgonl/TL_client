var BuilderHut = Building.extend({

   ctor: function () {
       this._super();
       this.init();
   },

   init: function (){
         this._super();
         //this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
         this.setAnchorPoint(0.5,0.5);

         //building
         this.level = 1;
         this.state = "idle";
         this.timeStart = null;
         this.timeDone = null;

         //game object init

        this._body = new cc.Sprite(res.building.builderHut.body);
        this._grass = new cc.Sprite(res.building.builderHut.grass);
        this._shadow = new cc.Sprite(res.building.builderHut.shadow);

        this._body.setAnchorPoint(0.5,0.5);
        this._grass.setAnchorPoint(0.5,0.5);
        this._shadow.setAnchorPoint(0.5,0.5);

        this._body.setScale(0.5);

        this.addChild(this._body, 2);
        this.addChild(this._grass, 0);
        this.addChild(this._shadow, 1);


   }



});