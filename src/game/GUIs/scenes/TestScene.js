var TestScene = cc.Scene.extend({
    ctor: function () {
        let troop = new Troop("ARM_1", 1);

        troop.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        this.addChild(troop)
    },


})