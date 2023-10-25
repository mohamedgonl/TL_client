var FightPopup = cc.Layer.extend({
    instance: null,

    button_container: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        var node = CCSUlties.parseUIFile(res_ui.FIGHT_POPUP);

        // get child-nodes
        const findMatchButton = node.getChildByName("button-find-match");
        const closeButton = node.getChildByName("button-close");
        const fameAmount = node.getChildByName("fame-amount");

        fameAmount.setString(PlayerInfoManager.Instance().getInfo().rank)

        findMatchButton.addClickEventListener(this.handleClickFindMatch.bind(this))
        closeButton.addClickEventListener(this.handleClickClose.bind(this))

        node.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        node.setAnchorPoint(0.5, 0.5);
        this.addChild(node);
    },

    resetInitState : function () {
        // fameAmount.setString(PlayerInfoManager.Instance().getInfo().rank)
    },

    handleClickFindMatch: function (){
        cc.director.runScene(new BattleScene());
    },

    handleClickClose: function (closePopupLayer) {
        let popUp = this;
        PopupEffect.disappear(this, ()=>{
            popUp.setVisible(false);
            popUp.resetInitState();
            if(closePopupLayer) popUp.getParent().setVisible(false);
        });
        return true;
    },
});