var Barrack = Building.extend({
    _upper: null,
    _width: null,
    _height: null,
    _trainingList: [],
    lastTrainingTime: null,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigBarrack(this.level));

        this.loadSprite(res_map.SPRITE.BODY.BARRACK[level],null,1);
    },

    getLastTrainingTime: function () {
        return this.lastTrainingTime;
    },

    getTrainingList: function () {
        return this._trainingList;
    },
    
    getTrainingCount: function () {
        cc.log(this._trainingList.reduce((sum,e) => sum+e.count,0));
       // return this._trainingList.reduce((sum,e) => sum+e.count,0);
        return 0;
    }

    

});