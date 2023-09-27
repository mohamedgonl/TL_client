

var Building = GameObject.extend({
    level: null,
    state:null,
    timeStart: null,
    timeDone: null,
    yesButton: null,
    noButton: null,
    ctor: function () {
        this._super();
        this.init();
        this.setScale(GRID_SCALE*2);
    },

});