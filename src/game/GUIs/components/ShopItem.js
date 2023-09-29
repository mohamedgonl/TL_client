var ShopItem = cc.Node.extend({
    _available: true,
    ctor: function (data, category) {
        this._super()
        let node = CCSUlties.parseUIFile(res_ui.SHOP_ITEM);
        // find shop_item_node
        let item = node.getChildByName("shop_item_node");
        this._itemNode = item;
        let button_buy = item.getChildByName("button_buy");
        button_buy.addClickEventListener(this.handleTouchBuyButton.bind(this));

        this._data = data;
        this._category = category;
        this.setItemInfo(data, category);

        this.addChild(node);

    },


    getItemWidth: function () {
        let itemWidth = this._itemNode.getChildByName("shop_bg");
        return itemWidth.getContentSize().width;
    },

    setItemInfo: function (data, category) {
        if (category !== "category_ngankho") {
            let name = this._itemNode.getChildByName("item_name_string");
            name.setString(data.name);
        }
        else
        {
            let name = this._itemNode.getChildByName("ngankho_item_name");
            name.setString(data.name);
            let value = this._itemNode.getChildByName("ngankho_item_value");
            let maxValue = data.value_type === RESOURCE_TYPE.GOLD
                ? PlayerInfoManager.getMaxResource().gold
                : PlayerInfoManager.getMaxResource().elixir;
            value.setString(fr.toMoneyString(maxValue * (data.nganhko_percent)));

            let value_icon = this._itemNode.getChildByName("ngankho_item_value_type");
            let icon_image = data.value_type === RESOURCE_TYPE.GOLD ? res.ICON.GOLD :
                (data.value_type === RESOURCE_TYPE.ELIXIR ? res.ICON.ELIXIR : res.ICON.D_ELIXIR_BAR);
            value_icon.loadTexture(icon_image);

        }

        let price_string = this._itemNode.getChildByName("item_price");
        price_string.setString(data.price === 0 ? "Miễn phí" : data.price);


        let item_img = this._itemNode.getChildByName("item_image");
        item_img.loadTexture(data.img);
        item_img.color = new cc.Color(255,255,255);
        item_img.ignoreContentAdaptWithSize(true);

        let price_type = this._itemNode.getChildByName("price_type");

        switch (data.price_type) {
            case RESOURCE_TYPE.ELIXIR : {
                price_type.loadTexture(res.ICON.ELIXIR);
                if (data.price > PlayerInfoManager.getResource().elixir) {
                    price_string.setColor(cc.color(255, 0, 0));
                    this._available = false;
                }
                break;
            }
            case RESOURCE_TYPE.GOLD : {
                price_type.loadTexture(res.ICON.GOLD);
                if (data.price > PlayerInfoManager.getResource().gold) price_string.setColor(cc.color(255, 0, 0));
                break;
            }
            case RESOURCE_TYPE.G : {
                price_type.loadTexture(res.ICON.GEM);
                if (data.price > PlayerInfoManager.getResource().gem) price_string.setColor(cc.color(255, 0, 0));
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
                this.setVisibleFields([ "button_info"]);
                let maxBuilt = this.getBuildMaxCount();
                if (this.getBuiltCount >= maxBuilt) this._available = false;

                if(maxBuilt < 0) {
                    let thRequireString = this._itemNode.getChildByName("th_require_string");
                    thRequireString.setString("Yêu cầu nhà chính cấp "+ (-maxBuilt));
                    thRequireString.setVisible(true);
                }
                else {
                    let space = this._itemNode.getChildByName("space_string");
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
        let townHallLevel = GameManager.getTownHall().level;
        let maxCount = TOW["TOW_1"][townHallLevel][this._data.cfgId];

        if(maxCount === undefined && this._data.cfgId === "BDH_1"){
            return 5;
        }else {

            if(maxCount === 0) {
                while(TOW["TOW_1"][townHallLevel][this._data.cfgId]===0)  {
                    townHallLevel++;
                    //catch infinity loop error
                    if(townHallLevel===1000) break;
                }
                return -townHallLevel
            }
            else {
                return maxCount;
            }
        }
    },

    getBuiltCount: function () {
        return 3;
    },

    handleTouchInfoButton: function () {
        let itemInfoLayer = new ItemInfoPopup(this._data);
        let gameScene = cc.director.getRunningScene();
        let popUpLayer = gameScene.getPopUpLayer();
        popUpLayer.addChild(itemInfoLayer);

    },

    handleTouchBuyButton: function (sender, type) {
        ButtonEffect.scaleOnClick(sender, type);
        cc.log("CLICK BUY :::: ");
        if (this._available === true) {
            let gameScene = cc.director.getRunningScene();
            let popUpLayer = gameScene.getPopUpLayer();
            if(this._category === "category_ngankho"){
                popUpLayer.disappear("shop");
                popUpLayer.setVisible(true);
                let label = new cc.LabelBMFont("Bạn có muốn mua số tài nguyên còn thiếu?", res.FONT.FISTA["16"], 350, cc.TEXT_ALIGNMENT_CENTER);
                let
                let buyResPopup= new NotiPopup({title: "MUA TÀI NGUYÊN"})
                popUpLayer.addChild(buyResPopup)
            }
            else {

            }
        } else {
            cc.log("CANT BUY :::: ");
        }
    },

    handleBuild: function () {

    }

})