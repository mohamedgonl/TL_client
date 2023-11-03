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
        let prevItemPosY;
        for (let i = 0; i < matches.length; i++) {
            let item = new MatchHistoryItem(matches[i]);
            this._scrollView.addChild(item);
            item.setPositionX(MATCH_HISTORY_SCROLL_POS.x);
            if (i === 0) {
                item.setPositionY(MATCH_HISTORY_ITEM_HEIGHT / 2);
            } else {
                item.setPositionY(prevItemPosY + ITEM_MARGIN + MATCH_HISTORY_ITEM_HEIGHT);
            }
            prevItemPosY = item.getPosition().y;

        }
        this._scrollView.setInnerContainerSize(cc.size(704, (matches.length) * (MATCH_HISTORY_ITEM_MARGIN + MATCH_HISTORY_ITEM_HEIGHT)))
    },

    handleClickClose: function () {
        let popUp = this;
        PopupEffect.disappear(this, () => {
            popUp.setVisible(false);
        });
        return true;
    },


})