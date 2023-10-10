var TimeManager = cc.Class.extend({
    instance: null,
    deltaTimeClientServer: 0,
    ctor: function () {

    },

    getCurrentTimeInSecond: function () {
        let curTime = new Date().getTime();
        return Math.floor ((curTime + this.deltaTimeClientServer)/1000);
    },
    getCurrentTime: function () {
        let curTime = new Date().getTime();
        return curTime + this.deltaTimeClientServer;
    },
    setDeltaTimeClientServer: function (serverTime = new Date().getTime()) {
        let curTime = new Date().getTime();
        this.deltaTimeClientServer = serverTime - curTime;
    },


})


TimeManager.Instance = function () {
    if (TimeManager.instance == null) {
        TimeManager.instance = new TimeManager();
    }
    return TimeManager.instance;
}
