
var ShopPopup = cc.Layer.extend({
    _title: null,
    _routeLevel : 0,
    _categoryWrapper: null,
    _itemsWrapper: null,
    ctor: function () {
        this._super();
        var shopPopup  = this;

        // load ui-json
        let node = CCSUlties.parseUIFile(res_ui.SHOP_POPUP)

        // get child-nodes
        let backButton = node.getChildByName("button_back");
        let closeButton = node.getChildByName("button_close");
        this._categoryWrapper = node.getChildByName("shop_category_wrapper");
        this._itemsWrapper = node.getChildByName("shop_items_wrapper");
        this._title = node.getChildByName("shop_label");


        // add handle when touch category
        let categories = this._categoryWrapper.getChildren();

        categories.map(e => {
            let categoryNameString = e.getChildByName("category_name_string").string;
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                    var target = event.getCurrentTarget();
                    if (cc.rectContainsPoint(target.getBoundingBoxToWorld(), event.getLocation())
                        && shopPopup._routeLevel === 0) {
                            target.setScale(BUTTON_TOUCH_SCALE);
                    }
                },
                onMouseUp: function (event) {
                    var target = event.getCurrentTarget();
                    if (cc.rectContainsPoint(target.getBoundingBoxToWorld(), event.getLocation())
                        && shopPopup._routeLevel === 0) {
                            target.setScale(1);
                            shopPopup.handleClickCategory(e.getName(), categoryNameString);
                    }
                }
            }, e);

        })



        backButton.addTouchEventListener(this.handleClickBack, this)
        closeButton.addTouchEventListener(this.handleClickClose, this)

        node.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(node);
    },

    changePopUpTitle: function (title) {
        this._title.setString(title);
    },


    handleClickBack : function (sender, type) {
        ButtonEffect.scaleOnClick(sender, type);
        if(type === ccui.Widget.TOUCH_ENDED) {
            cc.log("Click back:::: ");
            this._routeLevel = this._routeLevel - 1 < 0 ? 0 : this._routeLevel - 1;
            switch (this._routeLevel) {
                case 1:  {
                    this._itemsWrapper.setVisible(true);
                    this._categoryWrapper.setVisible(false);
                    break;
                }
                case 0: {
                    this.changePopUpTitle("CỬA HÀNG");
                    this._itemsWrapper.setVisible(false);
                    this._categoryWrapper.setVisible(true);
                    this._itemScrollView.removeAllChildren();
                    break;
                }
                default: break;
            }

        }
        return true;
    },

    handleClickClose: function (sender, type) {
        ButtonEffect.scaleOnClick(sender, type);

        if(type === ccui.Widget.TOUCH_ENDED) {
            cc.log("Click close:::: ");
        }
        return true;
    },

    handleClickCategory: function ( category, categoryNameString) {
        cc.log("Click category:::: ", category);

        this._routeLevel = this._routeLevel + 1;

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
        res_bar_gold.setString(PlayerInfoManager.getResource().gold);

        let res_bar_elixir = this._itemsWrapper.getChildByName("resource_bar_elixir");
        res_bar_elixir = res_bar_elixir.getChildByName("res_bar_string");
        res_bar_elixir.setString(PlayerInfoManager.getResource().elixir);

        let res_bar_g = this._itemsWrapper.getChildByName("resource_bar_g");
        res_bar_g = res_bar_g.getChildByName("res_bar_string");
        res_bar_g.setString(PlayerInfoManager.getResource().gem);

    }
    }

)


