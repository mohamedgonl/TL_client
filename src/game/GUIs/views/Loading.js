var Loading = cc.Node.extend({
    duration: 1,
    ctor: function (type) {
        this._super();

        this.type = type;

        var node = CCSUlties.parseUIFile(res_ui.LOADING_GUI);

        // get child-nodes
        this.cloudLeft = node.getChildByName("cloud_left");
        this.cloudRight = node.getChildByName("cloud_right");
        this.loading = node.getChildByName("loading");
        this.panel = node.getChildByName("panel");

        this.panel.setVisible(false);
        this.loading.setAnchorPoint(0.5, 0.5);
        this.loading.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.cloudLeft.setAnchorPoint(0, 0);
        this.cloudRight.setAnchorPoint(1, 0);

        if (type === Loading.START) {
            this.cloudLeft.setPosition(-this.cloudLeft.width * this.cloudLeft.scaleX, 0);
            this.cloudRight.setPosition(cc.winSize.width + this.cloudRight.width * this.cloudRight.scaleX, 0);
            this.loading.setVisible(false);
        } else if (type === Loading.STOP) {
            this.cloudLeft.setPosition(0, 0);
            this.cloudRight.setPosition(cc.winSize.width, 0);
            this.loading.setVisible(true);
            this.showLoadingSpin();
        }

        this.addChild(node);
    },

    startLoading: function (callback) {
        if (this.type === Loading.START) {
            const actionLoadCloudLeft = cc.moveTo(this.duration, cc.p(0, 0));
            const actionLoadCloudRight = cc.moveTo(this.duration, cc.p(cc.winSize.width, 0));

            this.cloudLeft.runAction(actionLoadCloudLeft);
            this.cloudRight.runAction(actionLoadCloudRight);

            const self = this;
            this.scheduleOnce(function () {
                self.stopAllActions();
                callback();
            }, this.duration);
        }
    },

    stopLoading: function () {
        if (this.type === Loading.STOP) {
            const actionLoadCloudLeft = cc.moveTo(this.duration, cc.p(-this.cloudLeft.width * this.cloudLeft.scaleX, 0));
            const actionLoadCloudRight = cc.moveTo(this.duration, cc.p(cc.winSize.width + this.cloudRight.width * this.cloudRight.scaleX, 0));

            this.cloudLeft.runAction(actionLoadCloudLeft);
            this.cloudRight.runAction(actionLoadCloudRight);
            this.loading.setVisible(false);

            const self = this;
            this.scheduleOnce(function () {
                self.stopAllActions();
                self.removeFromParent(true);
            }, this.duration);
        }
    },

    showLoadingSpin: function (){
        let animate = new cc.Animation();
        const frames = res_map.SPRITE.LOADING;
        for (let idx in frames) {
            animate.addSpriteFrameWithFile(frames[idx]);
        }
        animate.setDelayPerUnit(0.02);
        animate.setRestoreOriginalFrame(true);

        let action = cc.animate(animate);
        action.repeatForever();
        this.loading.runAction(action);
    }

});

Loading.START = "start";
Loading.STOP = "stop";


