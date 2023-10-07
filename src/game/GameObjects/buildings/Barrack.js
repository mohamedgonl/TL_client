var Barrack = Building.extend({
    _upper: null,
    _width: null,
    _height: null,
    _trainingQueue: null,
    _lastTrainingTime: null,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);
        this._trainingQueue = [];
        this.loadConfig(ConfigManager.Instance().getConfigBarrack(this.level));
        this.loadSprite(res_map.SPRITE.BODY.BARRACK[level],null,1);
        cc.log("KHỞI TẠO  ::::::::::::::::::   ", this._trainingQueue.length);
    },

    getLastTrainingTime: function () {
        return this._lastTrainingTime;
    },

    setLastTrainingTime: function (time) {
        this._lastTrainingTime = time;
    },

    getTrainingList: function () {
        return this._trainingQueue;
    },

    setTrainingList: function (list) {
        this._trainingQueue = list;
    },


    //return true when this type of troop already exist
    addToTrainingQueue: function ({cfgId, count}) {
        cc.log("KHỞI TẠO 1 ::::::::::::::::::   ", this._trainingQueue.length);
        for (let i = 0; i < this._trainingQueue.length; i++) {
            if(this._trainingQueue[i].cfgId === cfgId) {
                this._trainingQueue[i].count += count;
                return true;
            }
        }
        this._trainingQueue.push({cfgId: cfgId,count: count});
        cc.log("KHỞI TẠO  2 ::::::::::::::::::   ",JSON.stringify(this._trainingQueue));
        return false;
    },

    removeFromTrainingQueue: function ({cfgId, count, currentTime}) {
        cc.log("REMOVE nhận params:::::::::::::", cfgId, count, currentTime);
        this._lastTrainingTime = currentTime;
        for (let i = 0; i < this._trainingQueue.length; i++) {
            if(this._trainingQueue[i].cfgId === cfgId) {
                this._trainingQueue[i].count -= count;
                if(this._trainingQueue[i].count === 0) {
                    this._trainingQueue.splice(i,1);
                }
                return;
            }
        }
    },
    
    getTrainingSpace: function () {
        cc.log(" TAO R A ĐÂY :::::::" + JSON.stringify(this._trainingQueue))
        return this._trainingQueue.reduce((sum,e) => {
            return sum+e.count * TROOP_BASE[e.cfgId]["housingSpace"];
        },0);
    },

    getMaxSpace: function () {
        return BAR["BAR_1"][this.level]["queueLength"];
    },

    test: function () {
        this._test++;
        cc.log("TEST CHANGE ::::", this._test);
    }



    

});