var Cannon = Building.extend({
    _upper: null,
    ctor: function (type,level,id,posX,posY,status,startTime,endTime) {
        this._super(type,level,id,posX,posY,status,startTime,endTime);

        // var upper_sprite =  res_map.SPRITE.BODY.CANNON.UPPER[level];
        // this.loadSprite(res_map.SPRITE.BODY.CANNON.BOTTOM[level],upper_sprite,2);
        // this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },
    loadSpriteByLevel: function (level) {
        var upper_sprite =  res_map.SPRITE.BODY.CANNON.UPPER[level];
        this.loadSprite(res_map.SPRITE.BODY.CANNON.BOTTOM[level],upper_sprite,2);
    },
    loadButton: function () {
        this._super();
        let infoLayer = cc.director.getRunningScene().infoLayer;
        infoLayer.addButtonToMenu("Nâng cấp",res.BUTTON.UPGRADE_BUTTON,0,this.onClickUpgrade.bind(this),this);
    },

});