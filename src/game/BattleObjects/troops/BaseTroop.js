var BaseTroop = cc.Node.extend({
    ctor: function (posX,posY) {
        this._super();
        this.setScale(0.5)
        this._posX = posX;
        this._posY = posY;
        this.init();
    },
    init: function () {
        this._bodySprite = new cc.Sprite(res_troop.RUN[this._type].LEFT[1]);
        this.addChild(this._bodySprite);
        //random position  -1 1
        // var randomX = Math.floor(Math.random() * 3) - 1;
        // var randomY = Math.floor(Math.random() * 3) - 1;
        // this.setRunDirection(randomX,randomY);
    },
    setRunDirection: function (directX,directY) {
        let moveAction;
        if (directX === 1 && directY === 1) {
            moveAction = res_troop.RUN[this._type].UP.ANIM;
        } else if (directX === 1 && directY === 0) {
            moveAction = res_troop.RUN[this._type].UP_RIGHT.ANIM;
        } else if (directX === 1 && directY === -1) {
            moveAction = res_troop.RUN[this._type].RIGHT.ANIM;
        } else if (directX === 0 && directY === 1) {
            moveAction = res_troop.RUN[this._type].UP_LEFT.ANIM;
        } else if (directX === 0 && directY === 0) {
            moveAction = res_troop.RUN[this._type].UP.ANIM;
        } else if (directX === 0 && directY === -1) {
            moveAction = res_troop.RUN[this._type].DOWN_RIGHT.ANIM;
        } else if (directX === -1 && directY === 1) {
            moveAction = res_troop.RUN[this._type].LEFT.ANIM;
        } else if (directX === -1 && directY === 0) {
            moveAction = res_troop.RUN[this._type].DOWN_LEFT.ANIM;
        } else if (directX === -1 && directY === -1) {
            moveAction = res_troop.RUN[this._type].DOWN.ANIM;
        } else {
            cc.log("Error");
        }
        this._bodySprite.runAction(cc.animate(moveAction).repeatForever());
    },
});