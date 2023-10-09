var Troop = cc.Node.extend({
    _moveSpeed: 0,
    _cfgId: null,
    _level: null,
    ctor: function (cfgId, level) {
        this._super();
        this._cfgId = cfgId;
        this._level = level


        let animFrames = [];
        let url = TROOP_ANI_BASE_URL + cfgId + "_" + level + "/" + cfgId + "_" + level + "/run/image000";

        for (let i = 0; i < 12; i++) {
            let str = url + i + ".png";
            let frame = cc.spriteFrameCache.addSpriteFrame(str,str);
            animFrames.push(frame);
        }

        let sprite1 = new cc.Sprite(animFrames[0]); // Tạo sprite với frame đầu tiên
        sprite1.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        let animation = new cc.Animation(animFrames, 0.3);
        sprite1.runAction(cc.repeatForever(cc.animate(animation)));

        this.addChild(sprite1);



    },

    init: function (cfgId) {
        this._moveSpeed = TROOP_BASE[cfgId]["moveSpeed"];

    },




    findPath : function () {

    },

    runTo: function(){
        
    },
    
    stay: function () {
        
    }

})