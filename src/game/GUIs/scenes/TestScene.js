var TestScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.log("INIT SCENE")
        let troop = new Troop("ARM_1", 1);
        this.addChild(troop)


    },


})