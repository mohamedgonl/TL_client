var MatchHistoryPopup = cc.Layer.extend({

    ctor: function () {
        this._super();
        let node = CCSUlties.parseUIFile(res_ui.MATCH_HISTORY_POPUP);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this._scrollView = node.getChildByName("ScrollView_1");
        this._scrollView.setScrollBarEnabled(false);
        let closeButton = node.getChildByName("button_close");
        closeButton.addClickEventListener(this.handleClickClose.bind(this));
        this.addChild(node);
        testnetwork.connector.sendGetHistoryAttack();

    },

    initMatches: function (matches) {
        let scrollInnerHeight = MATCH_HISTORY_ITEM_HEIGHT * (matches.length) + (matches.length - 1) * ITEM_MARGIN;
        let deltaHeight = scrollInnerHeight - this._scrollView.getContentSize().height;
        let prevItemPosY;
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL)
        let scrollViewSize = this._scrollView.getContentSize();
        for (let i = 0; i < matches.length; i++) {
            let item = new MatchHistoryItem(matches[i]);
            item.setPositionX(scrollViewSize.width / 2);
            if (i === 0) {
                item.setPositionY(MATCH_HISTORY_SCROLL_POS.y + deltaHeight);
            } else {
                item.setPositionY(prevItemPosY - ITEM_MARGIN - MATCH_HISTORY_ITEM_HEIGHT);
            }
            this._scrollView.addChild(item);
            prevItemPosY = item.getPosition().y;
        }
        this._scrollView.setInnerContainerSize(cc.size(this._scrollView.getInnerContainerSize().width, scrollInnerHeight))
    },

    handleClickClose: function () {
        let popUp = this;
        PopupEffect.disappear(this, () => {
            popUp.setVisible(false);
        });
        return true;
    },
})