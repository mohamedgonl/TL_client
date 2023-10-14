var Barrack = Building.extend({
    _upper: null,
    _width: null,
    _height: null,
    _trainingQueue: [],
    lastTrainingTime: null,
    _type: "BAR_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        this._trainingQueue = [];
        this.lastTrainingTime = 0;

    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.BARRACK[level],null,1);
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
        for (let i = 0; i < this._trainingQueue.length; i++) {
            if(this._trainingQueue[i].cfgId === cfgId) {
                this._trainingQueue[i].count += count;
                return true;
            }
        }
        this._trainingQueue.push({cfgId: cfgId,count: count});
        return false;
    },

    removeFromTrainingList: function ({cfgId, count, currentTime}) {
        cc.log("REMOVE : "+  JSON.stringify({cfgId, count, currentTime}))
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
        return this._trainingQueue.reduce((sum,e) => {
            return sum+e.count * TROOP_BASE[e.cfgId]["housingSpace"];
        },0);
    },

    getMaxSpace: function () {
        return BAR["BAR_1"][this._level]["queueLength"];
    },


    

});