var Barrack = Building.extend({
    _upper: null,
    _width: null,
    _height: null,
    _trainingQueue: [],
    lastTrainingTime: null,
    ctor: function (type,level,id,posX,posY) {
        this._super(type,level,id,posX,posY);

        this.loadSprite(res_map.SPRITE.BODY.BARRACK[level],null,1);
        this.loadSubSprite();
    },

    getLastTrainingTime: function () {
        return this.lastTrainingTime;
    },

    getTrainingList: function () {
        return this._trainingQueue;
    },



    addToTrainingQueue: function ({cfgId, count}) {
        for (let i = 0; i < this._trainingQueue.length; i++) {
            if(this._trainingQueue[i].cfgId === cfgId) {
                this._trainingQueue[i].count += count;
                return
            }
        }
        this._trainingQueue.push({cfgId, count});
    },

    removeFromTrainingQueue: function ({cfgId, count, currentTime}) {
        for (let i = 0; i < this._trainingQueue.length; i++) {
            if(this._trainingQueue[i].cfgId === cfgId) {
                this._trainingQueue[i].count -= count;
                if(this._trainingQueue[i].count === 0) {
                    this._trainingQueue.splice(i,1);
                }
                this.lastTrainingTime = currentTime;
                cc.log("removeFromTrainingQueue success");
                return
            }
        }
    },
    
    getTrainingSpace: function () {
        return this._trainingQueue.reduce((sum,e) => sum+e.count * TROOP_BASE[e.cfgId]["housingSpace"],0);
    },

    getMaxSpace: function () {
        return BAR["BAR_1"][this.level]["queueLength"];
    }



    

});