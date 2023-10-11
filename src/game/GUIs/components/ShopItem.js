var ShopItem = cc.Node.extend({
    _available: true,
    ctor: function (data, category) {
        this._super()
        let node = CCSUlties.parseUIFile(res_ui.SHOP_ITEM);
        // find shop_item_node
        let item = node.getChildByName("shop_item_node");
        this._itemNode = item;

        let buttonBuy = item.getChildByName("button_buy");
        cc.eventManager.addListener(clickEventListener(this.handleTouchBuyButton.bind(this)), item);

        this._data = data;
        this._category = category;
        this.setItemInfo(data, category);
        this.checkValid();

        this.addChild(node);

    },

    checkValid: function () {
        if (!this._available) {
            let objs = this.getElements(["item_bg", "shop_bg", "price_type", "item_image"])
            ColorUlties.setGrayObjects(objs)
        }
    },

    getElements: function (names) {
        let elements = []
        names.map(e => {
            let child = this._itemNode.getChildByName(e);
            elements.push(child);
        })
        return elements
    },


    getItemWidth: function () {
        let itemWidth = this._itemNode.getChildByName("shop_bg");
        return itemWidth.getContentSize().width;
    },

    setItemInfo: function (data, category) {
        if (category !== "category_ngankho") {
            let name = this._itemNode.getChildByName("item_name_string");
            name.setString(data.name);
        } else {
            let name = this._itemNode.getChildByName("ngankho_item_name");
            name.setString(data.name);
            let value = this._itemNode.getChildByName("ngankho_item_value");
            let maxValue = data.value_type === RESOURCE_TYPE.GOLD
                ? PlayerInfoManager.Instance().getMaxResource().gold
                : PlayerInfoManager.Instance().getMaxResource().elixir;
            value.setString(fr.toMoneyString(maxValue * (data.nganhko_percent)));


            let value_icon = this._itemNode.getChildByName("ngankho_item_value_type");
            let icon_image = data.value_type === RESOURCE_TYPE.GOLD ? res.ICON.GOLD :
                (data.value_type === RESOURCE_TYPE.ELIXIR ? res.ICON.ELIXIR : res.ICON.D_ELIXIR_BAR);
            value_icon.loadTexture(icon_image);

        }

        let price_string = this._itemNode.getChildByName("item_price");
        price_string.setString(data.price === 0 ? "Miễn phí" : data.price);


        let item_img = this._itemNode.getChildByName("item_image");
        item_img.setTexture(data.img);

        let price_type = this._itemNode.getChildByName("price_type");

        switch (data.price_type) {
            case RESOURCE_TYPE.ELIXIR : {
                price_type.setTexture(res.ICON.ELIXIR);
                if (data.price > PlayerInfoManager.Instance().getResource().elixir) {
                    price_string.setColor(COLOR_SHOP_RED);
                    this._available = false;
                }
                break;
            }
            case RESOURCE_TYPE.GOLD : {
                price_type.setTexture(res.ICON.GOLD);
                if (data.price > PlayerInfoManager.Instance().getResource().gold) {
                    price_string.setColor(COLOR_SHOP_RED);
                    this._available = false;
                }
                break;
            }
            case RESOURCE_TYPE.G : {
                price_type.setTexture(res.ICON.GEM);
                if (data.price > PlayerInfoManager.Instance().getResource().gem) {
                    price_string.setColor(COLOR_SHOP_RED);
                    this._available = false;
                }
                break;
            }
            default: {
                break;
            }
        }
        // set specific info
        switch (category) {
            case "category_baove" : {
                this.setVisibleFields(["wait_time_title", "wait_time_string"]);
                let waitTimeString = this._itemNode.getChildByName("wait_time_string");
                waitTimeString.setString(fr.toGameTimeString(data.wait_time))
                break;
            }
            case "category_ngankho" : {
                this.setVisibleFields(["km_banner", "ngankho_item_name", "ngankho_item_value", "ngankho_item_value_type"]);
                break;
            }
            case "category_tainguyen":
            case "category_phongthu":
            case "category_quandoi": {
                let maxBuilt = this.getBuildMaxCount();
                if (this.getBuiltCount >= maxBuilt) {
                    this._available = false;
                }
                this.setVisibleFields(["button_info"])
                if (maxBuilt < 0) {
                    let thRequireString = this._itemNode.getChildByName("th_require_string");
                    thRequireString.setString("Yêu cầu nhà chính cấp " + (-maxBuilt));
                    thRequireString.setVisible(true);
                } else {
                    let space = this._itemNode.getChildByName("space_string");
                    if (this.getBuiltCount() >= maxBuilt) {
                        space.setColor(COLOR_SHOP_RED);
                        this._available = false;
                    }
                    space.setString(this.getBuiltCount() + "/" + maxBuilt);
                    let timeDone = this._itemNode.getChildByName("time_string");
                    timeDone.setString(fr.toGameTimeString(data.time));
                    this.setVisibleFields(["time_icon", "time_string", "space_string"]);
                }
                let buttonInfo = this._itemNode.getChildByName("button_info");
                buttonInfo.addClickEventListener(this.handleTouchInfoButton.bind(this));
                break;
            }
        }
    },

    setVisibleFields: function (fields, visible = true) {
        for (let i = 0; i < fields.length; i++) {
            let field = this._itemNode.getChildByName(fields[i]);
            field.setVisible(visible);
        }
    },

    getBuildMaxCount: function () {
        let townHallLevel = MapManager.Instance().getTownHall()._level;
        cc.log(townHallLevel)

        let maxCount = TOW["TOW_1"][townHallLevel][this._data.cfgId];

        if (maxCount === undefined && this._data.cfgId === "BDH_1") {
            return 5;
        } else {

            if (maxCount === 0) {
                while (TOW["TOW_1"][townHallLevel][this._data.cfgId] === 0) {
                    townHallLevel++;
                    //catch infinity loop error
                    if (townHallLevel === 1000) break;
                }
                return -townHallLevel
            } else {
                return maxCount;
            }
        }
    },

    getBuiltCount: function () {
        return 0;
    },

    handleTouchInfoButton: function () {
        let itemInfoLayer = new ItemInfoPopup(this._data);
        let gameScene = cc.director.getRunningScene();
        let popUpLayer = gameScene.getPopUpLayer();
        popUpLayer.addChild(itemInfoLayer);
    },

    handleTouchBuyButton: function (sender, type) {
        cc.log("CLICK BUY :::: ");
        this._itemNode.setScale(1);
        if (this._available === true) {
            let gameScene = cc.director.getRunningScene();
            let popUpLayer = gameScene.getPopUpLayer();
            if (this._category === "category_ngankho") {
                popUpLayer.disappear("shop", {closePopupLayer: true});

                // create content in popup
                let label = new cc.LabelBMFont("Bạn có muốn mua số tài nguyên còn thiếu?", res.FONT.FISTA["16"], 350, cc.TEXT_ALIGNMENT_CENTER);
                label.setColor(new cc.Color(150, 78, 3));
                let price = new cc.LabelBMFont(this._data.price, res.FONT.SOJI["16"], 350, cc.TEXT_ALIGNMENT_CENTER);
                price.setPositionY(-label.getContentSize().height);
                let content = new cc.Node();
                content.addChild(label);
                content.addChild(price);

                let buyResPopup = new NotiPopup({
                    title: "MUA TÀI NGUYÊN", acceptCallBack: () => {
                        testnetwork.connector.sendBuyResourceRequest(this._data);
                        popUpLayer.setVisible(false);
                    }, content: content, cancleCallBack: () => {
                        popUpLayer.setVisible(false);
                        buyResPopup.removeFromParent(true)
                    }
                })
                popUpLayer.addChild(buyResPopup)
            } else {
                var mapLayer = cc.director.getRunningScene().mapLayer;
                popUpLayer.disappear("shop");
                mapLayer.enterModeBuyBuilding(this._data.cfgId);

            }
        } else {
            cc.log("CANT BUY :::: ");
        }

    },

    handleBuild: function () {

    }

})