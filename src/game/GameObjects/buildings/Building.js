

var Building = GameObject.extend({
    level: null,
    state:null,
    timeStart: null,
    timeDone: null,
    yesButton: null,
    noButton: null,
    ctor: function (level,posX,posY) {
        this._super();
        this.level = level;
        this._posX = posX;
        this._posY = posY;

    },
});