var TimeManager = cc.Node.extend({
    instance: null,
    deltaTimeClientServer: 0,
    ctor: function () {
        this._super();
    },

    getCurrentTimeInSecond: function () {
        let curTime = new Date().getTime() / 1000;
        return Math.floor(curTime + this.deltaTimeClientServer);
    },
    getCurrentTime: function () {
        let curTime = new Date().getTime();
        return curTime + this.deltaTimeClientServer;
    },
    setDeltaTimeClientServer: function (serverTime = new Date().getTime()) {
        let curTime = new Date().getTime() / 1000;
        this.deltaTimeClientServer = serverTime - curTime;
        cc.log("this.deltaTimeClientServer: " + this.deltaTimeClientServer)
    },

});


TimeManager.Instance = function () {
    if (TimeManager.instance == null) {
        TimeManager.instance = new TimeManager();
        TimeManager.instance.retain();
    }
    return TimeManager.instance;
}
