var UpgradePopup = cc.Node.extend({
    /*
    =====================================
    Panel_1
    upgrade_container
    .   close_btn
    .   text
    .   white_container
    .   node_text
    .   node_building
    .   btn_upgrade
    .   text_time
    progress1
    .   bar_yellow
    .   bar
    .   icon
    .   text
    progress2
    .   bar_yellow
    .   bar
    .   icon
    .   text
    progress3
    .   bar_yellow
    .   bar
    .   icon
    .   text
    =====================================
     */
    ctor: function (building) {
        this._super();

        this.upgrade_container = {
            close_btn: null,
            text: null,
            white_container: null,
            node_building: null,
            node_infor: null,
            node_text: null,
            btn_upgrade: null,
        }
        this.progress1 = {
            bar_yellow: null,
            bar: null,
            icon: null,
            text: null,
        }
        this.progress2 = {
            bar_yellow: null,
            bar: null,
            icon: null,
            text: null,
        }
        this.progress3 = {
            bar_yellow: null,
            bar: null,
            icon: null,
            text: null,
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
        let level = this.building._level + 1;
        container.text.setString("Nâng lên cấp " + level);

        //create a building and set to node_building
        let newBuilding = getBuildingFromType(this.building._type, this.building._level + 1);
        newBuilding.addSpriteIntoNode(container.node_building);
        container.node_building.addChild(newBuilding);
        container.node_building.setScale(1.5);


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
        if (priceGold) {
            goldIcon.setVisible(true);
            elixirIcon.setVisible(false);
            resourceText.setString(Utils.numberToText(priceGold));
            //nếu không đủ tiền, hiện tiền màu đỏ
            if (priceGold > PlayerInfoManager.getInstance().getResource().gold) {
                resourceText.setColor(cc.color.RED);
            }
        } else {
            goldIcon.setVisible(false);
            elixirIcon.setVisible(true);
            resourceText.setString(Utils.numberToText(priceElixir));
            //nếu không đủ tiền, hiện tiền màu đỏ
            if (priceElixir > PlayerInfoManager.getInstance().getResource().elixir) {
                resourceText.setColor(cc.color.RED);
            }
        }

        //nếu level nhà chính không đủ thì disable button
        let levelTownHall = MapManager.getInstance().getTownHall().getLevel();
        let levelRequire = LoadManager.getInstance().getConfig(building._type, building._level + 1, "townHallLevelRequired") || 1;
        if (levelTownHall < levelRequire) {
            //label "Yêu cầu nhà chính cấp 2" and add to node_text at middle
            let label = new cc.LabelBMFont("Yêu cầu nhà chính cấp " + levelRequire, res.FONT.SOJI[20]);
            container.node_text.addChild(label);
            //set anchor point
            label.setAnchorPoint(0.5, 1);
            //turn red
            label.setColor(cc.color.RED);
            //set visible false for buttn upgrade
            container.btn_upgrade.setVisible(false);
        }

        //set text time
        let time = LoadManager.getInstance().getConfig(building._type, building._level + 1, "buildTime");
        let stringTime = Utils.getTimeString(time);
        container.text_time.setString(stringTime);

        //invisible 3 progress
        this.progress1.setVisible(false);
        this.progress2.setVisible(false);
        this.progress3.setVisible(false);

        //set progress
        let dataInfo = BuildingInfo[this.building._type].dataInfo;
        //for in dataInfo
        for (let i = 1; i <= dataInfo.length; i++) {
            let progress = this["progress" + i];
            let barYellow = progress.bar_yellow;
            let bar = progress.bar;
            let icon = progress.icon;
            let text = progress.text;
            this.setProgress(progress, barYellow, bar, icon, text,dataInfo[i-1]);
        }
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

    },
    setProgress: function (progress, barYellow, bar, icon, text, typeRes) {
        //setVisible
        progress.setVisible(true);
        let maxLevel = BuildingInfo[this.building._type].max_level;
        let statNow;
        let statNextLevel;
        let statMaxLevel;
        let difference;
        switch (typeRes)
        {
            case "capacityGold":
                icon.setTexture(res.ICON.GOLD_CAPACITY);

                statNow = this.building._capacityGold;
                statNextLevel = this.building.getCapacityByLevel(this.building._level + 1).gold;
                statMaxLevel = this.building.getCapacityByLevel(maxLevel).gold;
                difference = statNextLevel - statNow;

                text.setString("Sức chứa: " + Utils.numberToText(statNow) + " + " + Utils.numberToText(difference) );
                break;
            case "capacityElixir":
                icon.setTexture(res.ICON.ELIXIR_CAPACITY);

                statNow = this.building._capacityElixir;
                statNextLevel = this.building.getCapacityByLevel(this.building._level + 1).elixir;
                statMaxLevel = this.building.getCapacityByLevel(maxLevel).elixir;
                difference = statNextLevel - statNow;

                text.setString("Sức chứa: " + Utils.numberToText(statNow) + " + " + Utils.numberToText(difference) );
                break;
            case "hitpoints":
                icon.setTexture(res.ICON.HEART);

                statNow = this.building._hitpoints;
                statNextLevel = LoadManager.getInstance().getConfig(this.building._type, this.building._level + 1, "hitpoints");
                statMaxLevel = LoadManager.getInstance().getConfig(this.building._type, maxLevel, "hitpoints");
                difference = statNextLevel - statNow;

                text.setString("Máu: " + Utils.numberToText(statNow) + " + " + Utils.numberToText(difference) );
                break;
            case "productionGold":
                icon.setTexture(res.ICON.GOLD_PD_RATE);

                statNow = this.building._productivityGold;
                statNextLevel = LoadManager.getInstance().getConfig(this.building._type, this.building._level + 1, "productivity");
                statMaxLevel = LoadManager.getInstance().getConfig(this.building._type, maxLevel, "productivity");
                difference = statNextLevel - statNow;

                text.setString("Sản lượng: " + Utils.numberToText(statNow) + " + " + Utils.numberToText(difference) + "/h");
                break;
            case "productionElixir":
                icon.setTexture(res.ICON.ELIXIR_PD_RATE);

                statNow = this.building._productivityElixir;
                statNextLevel = LoadManager.getInstance().getConfig(this.building._type, this.building._level + 1, "productivity");
                statMaxLevel = LoadManager.getInstance().getConfig(this.building._type, maxLevel, "productivity");
                difference = statNextLevel - statNow;

                text.setString("Sản lượng: " + Utils.numberToText(statNow) + " + " + Utils.numberToText(difference) + "/h");
                break;
            case "damage":
                icon.setTexture(res.ICON.DAMAGE);

                statNow = this.building._damage;
                statNextLevel = LoadManager.getInstance().getConfig(this.building._type, this.building._level + 1, "damagePerShot");
                statMaxLevel = LoadManager.getInstance().getConfig(this.building._type, maxLevel, "damagePerShot");
                difference = statNextLevel - statNow;

                text.setString("Sát thương: " + Utils.numberToText(statNow) + " + " + Utils.numberToText(difference) );
                break;
            case "army":
                icon.setTexture(res.ICON.ARMY);

                statNow = LoadManager.getInstance().getConfig(this.building._type, this.building._level, "capacity");
                statNextLevel = LoadManager.getInstance().getConfig(this.building._type, this.building._level + 1, "capacity");
                statMaxLevel = LoadManager.getInstance().getConfig(this.building._type, maxLevel, "capacity");
                difference = statNextLevel - statNow;

                text.setString("Sức chứa: " + Utils.numberToText(statNow) + " + " + Utils.numberToText(difference));
                break;
        }
        bar.setPercent(statNow/statMaxLevel*100)
        barYellow.setPercent(statNextLevel/statMaxLevel*100);
    }

});
