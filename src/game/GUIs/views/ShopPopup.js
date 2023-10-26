
var ShopPopup = cc.Layer.extend({
    _title: null,
    _routeLevel : 0,
    _categoryWrapper: null,
    _itemsWrapper: null,
    ctor: function () {
        this._super();
        var shopPopup  = this;

        // load ui-json
        let node = CCSUlties.parseUIFile(res_ui.SHOP_POPUP);

        // get child-nodes
        let backButton = node.getChildByName("button_back");
        let closeButton = node.getChildByName("button_close");
        this._categoryWrapper = node.getChildByName("shop_category_wrapper");
        this._itemsWrapper = node.getChildByName("shop_items_wrapper");
        this._title = node.getChildByName("shop_label");


        // add handle when touch category
        let categories = this._categoryWrapper.getChildren();
        categories.map(e => {
            let categoryNameString= e.getChildByName(e.getName()).getChildByName("category_name_string").getString();
            cc.eventManager.addListener(clickEventListener(()=>{this.handleClickCategory(e.getName(), categoryNameString)}).clone(), e);
        })

        backButton.addClickEventListener(this.handleClickBack.bind(this))
        closeButton.addClickEventListener(this.handleClickClose.bind(this))

        node.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        this.addChild(node);
    },

    changePopUpTitle: function (title) {
        this._title.setString(title);
    },

    handleClickBack : function (sender, type) {
        cc.log("Handle click back ::::")
        if(this._categoryWrapper.isVisible() === true) {
            this.handleClickClose(sender, type);
        }
        else {
           this.resetInitState();
        }
        return true;
    },

    resetInitState : function () {
        this.changePopUpTitle("CỬA HÀNG");
        this._itemsWrapper.setVisible(false);
        this._categoryWrapper.setVisible(true);
        if(this._itemScrollView) {
            this._itemScrollView.removeAllChildren();
        }
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

    handleClickCategory: function ( category, categoryNameString) {
        cc.log("Click category:::: ", category);
        this.updateResourceInfo();
        this._categoryWrapper.setVisible(false);
        this._itemsWrapper.setVisible(true);

        this.changePopUpTitle(categoryNameString)
        let itemsScrollView = this._itemsWrapper.getChildByName("shop_items_scrollview");
        itemsScrollView.setScrollBarEnabled(false);
        let itemsData = ShopItemsData[category];
        let scrollViewSize = itemsScrollView.getContentSize();
        let prevItemPosX;
        let itemWidth;

        // adding items to list
        for (let i = 0; i < itemsData.length; i++) {
            let item = new ShopItem(itemsData[i],category);
            itemsScrollView.addChild(item);
            item.setPositionY(scrollViewSize.height/2);
            if(i === 0) {
                itemWidth = item.getItemWidth()
                item.setPositionX(itemWidth/2);
            }
            else {
                item.setPositionX(prevItemPosX+ ITEM_MARGIN + itemWidth);
            }
            prevItemPosX = item.getPosition().x;

        }
        itemsScrollView.setInnerContainerSize(cc.size(itemWidth*(itemsData.length) + ITEM_MARGIN *(itemsData.length-1),scrollViewSize.height))
        this._itemScrollView = itemsScrollView;

        return true;
    },

    updateResourceInfo: function () {

        let res_bar_gold = this._itemsWrapper.getChildByName("resource_bar_gold");
        res_bar_gold = res_bar_gold.getChildByName("res_bar_string");
        res_bar_gold.setString(PlayerInfoManager.getInstance().getResource().gold);

        let res_bar_elixir = this._itemsWrapper.getChildByName("resource_bar_elixir");
        res_bar_elixir = res_bar_elixir.getChildByName("res_bar_string");
        res_bar_elixir.setString(PlayerInfoManager.getInstance().getResource().elixir);

        let res_bar_g = this._itemsWrapper.getChildByName("resource_bar_g");
        res_bar_g = res_bar_g.getChildByName("res_bar_string");
        res_bar_g.setString(PlayerInfoManager.getInstance().getResource().gem);

    }
    }

)


