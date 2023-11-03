var MatchHistoryPopup = cc.Layer.extend({

    ctor: function () {
        this._super();
        let node = CCSUlties.parseUIFile(res_ui.MATCH_HISTORY_POPUP);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this._scrollView = node.getChildByName("ScrollView_1");
        let closeButton = node.getChildByName("button_close");
        closeButton.addClickEventListener(this.handleClickClose.bind(this));

        this.addChild(node);
        testnetwork.connector.sendGetHistoryAttack();

    },

    initMatches : function (matches) {
            let scrollHeight = (MATCH_HISTORY_ITEM_MARGIN+ MATCH_HISTORY_ITEM_HEIGHT) * matches.length * 3;
            this._scrollView.setScrollBarEnabled(false);
            this._scrollView.setInnerContainerSize(cc.size(706,1500));

        matches.map((match, index) => {
            let matchItem = new MatchHistoryItem(match);
            matchItem.setPosition(MATCH_HISTORY_SCROLL_POS.x,  MATCH_HISTORY_SCROLL_POS.y - index* (MATCH_HISTORY_ITEM_MARGIN+ MATCH_HISTORY_ITEM_HEIGHT) );
            this._scrollView.addChild(matchItem)
        });

    },

    handleClickClose: function () {
        let popUp = this;
        PopupEffect.disappear(this, ()=>{
            popUp.setVisible(false);
        });
        return true;
    },



})