var Barrack = Building.extend({
    _upper: null,
    _width: null,
    _height: null,
    _trainingQueue: [],
    lastTrainingTime: null,
    _type: "BAR_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        this._bodySprite = res_map.SPRITE.BODY.BARRACK[level];
        this._upperSprite = null;
        this._shadowType = 1;
        this._isUpperAnimate = false;

        this._trainingQueue = [];
        this.lastTrainingTime = 0;



    },
    loadMainSpriteByLevel: function (level) {
        this.loadMainSprite(res_map.SPRITE.BODY.BARRACK[level],null,1);
    },
    loadButton: function () {
        if(this._super() === -1) return;
        let infoLayer = cc.director.getRunningScene().infoLayer;
        if(this._state ===0) {
            infoLayer.addButtonToMenu("Huấn luyện",res.BUTTON.TRAIN_BUTTON,0,this.onClickTraining.bind(this));
        }
    },
    onClickTraining: function () {
        //get popup layer
        let popUpLayer = cc.director.getRunningScene().popUpLayer;
        //list barrack
        let barrackList = ArmyManager.getInstance().getBarrackList();
        //for building in barrack list, get number of this building
        for(let i = 0; i < barrackList.length; i++) {
            if(barrackList[i]._id === this._id) {
                cc.log("Barrack " + i + " is clicked")
                popUpLayer.appear(POPUP_IDS.TRAIN,{page: i});
                return;
            }
        }

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
        cc.log("ADD TO TRAINING QUEUE")
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
          if(this._trainingQueue.length === 0) return 0;
        return this._trainingQueue.reduce((sum,e) => {
            return sum+e.count * TROOP_BASE[e.cfgId]["housingSpace"];
        },0);
    },

    getMaxSpace: function () {
        return BAR["BAR_1"][this._level]["queueLength"];
    },
    completeBuild: function () {
        this._super();
        cc.eventManager.dispatchCustomEvent(EVENT_NAMES.NEW_BUILDING_ADDED, {type: "BAR"});
    }


    

});