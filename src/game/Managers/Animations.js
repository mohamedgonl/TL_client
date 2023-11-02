var Animations = cc.Layer.extend ({
    instance: null,
    _animations : {},
    ctor: function () {
        this._super();
        TROOP_ANIMS_LIST.map(e => this.initAnimation(e));
    },
    initAnimation: function (cfgId) {
        this._animations[cfgId] = {};

        ANIMAS.map(action => {
            this._animations[cfgId][action] = {};
            if (TroopConfig[cfgId][action]) {
                DIRECTIONS.map((direct, index) => {
                    if (TroopConfig[cfgId][action][direct]) {
                        let animation = new cc.Animation();
                        for (let i = TroopConfig[cfgId][action][direct][0]; i <= TroopConfig[cfgId][action][direct][1]; i++) {
                            let frameName = this._url + "/" + action + "/image" + NumberUltis.formatNumberTo4Digits(i) + ".png";
                            animation.addSpriteFrameWithFile(frameName);
                        }
                        animation.setDelayPerUnit(TroopConfig[cfgId][action].frame_time);
                        animation.setRestoreOriginalFrame(true);
                        this._animations[action][direct] = animation;
                    } else {
                    }

                })
            }
        });
    },

    getAnims: function (cfgId) {
        return this._animations[cfgId];
    }
})

Animations.getInstance = function () {
    if (Animations.instance == null) {
        Animations.instance = new Animations();
        Animations.instance.retain();
    }
    return Animations.instance;
}
