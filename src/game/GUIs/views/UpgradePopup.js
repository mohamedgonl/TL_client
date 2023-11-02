var UpgradePopup = cc.Node.extend({

    // upgrade_container
    //     close_btn
    //     text
    //     white_container
    //     node_text
    //     node_building
    //     node_infor
    //     btn_upgrade
    //     text_time
    ctor: function (building) {
        this._super();

        this.upgrade_container= {
                close_btn: null,
                text: null,
                white_container: null,
                node_building: null,
                node_infor: null,
                node_text: null,
                btn_upgrade: null,
        }
        this.building = building;
        this.building = cc.director.getRunningScene().getMapLayer().chosenBuilding;

        var node = CCSUlties.parseUIFile(res_ui.UPGRADE_POPUP);
        //for all child in node, add to layer
        let children = node.getChildren();
        //add to attribute
        children.map(i => {
            this[i.getName()] = i;
            let childrenOfChildren = i.getChildren();
            childrenOfChildren.map(j => {
                this[i.getName()] [j.getName()] = j;
            })
        })
        this.addChild(node);

        this.turnOn();
    },
    //init UI, add to layer, init attributes, load resources
    turnOn: function () {
        let container = this.upgrade_container;

        //turn off infolayer
        cc.director.getRunningScene().infoLayer.setVisible(false);

        //set text : Nâng nhà chính cấp 7
        let level = this.building._level+1;
        container.text.setString("Nâng lên cấp " + level);

        //create a building and set to node_building
        let newBuilding = getBuildingFromType(this.building._type, this.building._level+1);
        newBuilding.setScale(1.5)
        container.node_building.addChild(newBuilding);


        let goldIcon = container.btn_upgrade.getChildByName("gold_icon");
        let elixirIcon = container.btn_upgrade.getChildByName("elixir_icon");
        let resourceText = container.btn_upgrade.getChildByName("text");
        //add event for close button
        container.close_btn.addClickEventListener(this.onClose.bind(this));
        container.close_btn.setPressedActionEnabled(true);
        //add event for upgrade button
        container.btn_upgrade.addClickEventListener(this.onClickUpgrade.bind(this));
        container.btn_upgrade.setPressedActionEnabled(true);

        let building = this.building;
        let priceGold = LoadManager.getInstance().getConfig(building._type, building._level + 1).gold;
        let priceElixir = LoadManager.getInstance().getConfig(building._type, building._level + 1).elixir;
        if(priceGold)
        {
            goldIcon.setVisible(true);
            elixirIcon.setVisible(false);
            resourceText.setString(priceGold);
            //nếu không đủ tiền, hiện tiền màu đỏ
            if(priceGold > PlayerInfoManager.getInstance().getResource().gold)
            {
                resourceText.setColor(cc.color.RED);
            }
        }
        else
        {
            goldIcon.setVisible(false);
            elixirIcon.setVisible(true);
            resourceText.setString(priceElixir);
            //nếu không đủ tiền, hiện tiền màu đỏ
            if(priceElixir > PlayerInfoManager.getInstance().getResource().elixir)
            {
                resourceText.setColor(cc.color.RED);
            }
        }

        //nếu level nhà chính không đủ thì disable button
        let levelTownHall = MapManager.getInstance().getTownHall().getLevel();
        let levelRequire = LoadManager.getInstance().getConfig(building._type, building._level + 1,"townHallLevelRequired")||1;
        if(levelTownHall < levelRequire)
        {
            //label "Yêu cầu nhà chính cấp 2" and add to node_text at middle
            let label = new cc.LabelBMFont("Yêu cầu nhà chính cấp " + levelRequire, res.FONT.SOJI[20]);
            container.node_text.addChild(label);
            //set anchor point
            label.setAnchorPoint(0.5,1);
            //turn red
            label.setColor(cc.color.RED);
            //set visible false for buttn upgrade
            container.btn_upgrade.setVisible(false);
        }

        //set text time
        let time = LoadManager.getInstance().getConfig(building._type, building._level + 1,"buildTime");
        let stringTime = Utils.getTimeString(time);
        container.text_time.setString(stringTime);
    },
    onClose: function () {
        this.removeFromParent(true);
        //turn on infolayer
        cc.director.getRunningScene().infoLayer.setVisible(true);
        cc.director.getRunningScene().popUpLayer.setVisible(false);
    },
    onClickUpgrade: function () {
        this.onClose();
        this.building.onClickUpgrade();

    }

});
