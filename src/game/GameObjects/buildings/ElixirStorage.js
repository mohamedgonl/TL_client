var ElixirStorage = Building.extend({
    _upper: null,

    ctor: function (type,level,id,posX,posY,status,startTime,endTime) {
        this._super(type,level,id,posX,posY,status,startTime,endTime);


        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_STORAGE[level],null,1);
        this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },






});