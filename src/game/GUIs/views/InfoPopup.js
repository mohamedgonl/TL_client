var InfoPopup = cc.Node.extend({

    /*
    Panel_1
    bg
    title
    white_sub-bg
    content
    item_image
    button_close
    progress1
            bar
            icon
            text
    progress2
            bar
            icon
            text
    progress3
            bar
            icon
            text
     */
    ctor: function (building) {
        this._super();

        this.building = building;
        this.building = cc.director.getRunningScene().getMapLayer().chosenBuilding;

        var node = CCSUlties.parseUIFile(res_ui.INFO_POPUP);
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

        //add event for button close
        this.button_close.addClickEventListener(this.onClose.bind(this));
        this.button_close.setPressedActionEnabled(true);

    },

    //init UI, add to layer, init attributes, load resources
    turnOn: function () {

        //add building image
        let buildingImage = getBuildingFromType(this.building._type, this.building._level);
        buildingImage.addSpriteIntoNode(this.item_image);
        // this.item_image.addChild(buildingImage);
        this.item_image.setScale(1.5);

        //set name : "Nhà chính cấp 7"
        let level = this.building._level;
        let name = BuildingInfo[this.building._type].name;
        this.title.setString(name + " cấp " + level);
        let description = BuildingInfo[this.building._type].description;
        //content is node to add description
        let content = this.content;
        let width = this["white_sub-bg"].getContentSize().width;
        let descriptionLabel = new cc.LabelBMFont(description, res.FONT.FISTA[16],width);

        // descriptionLabel.setBoundingWidth(content.getContentSize().width);
        descriptionLabel.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
        descriptionLabel.setPosition(content.getContentSize().width / 2, content.getContentSize().height / 2);

        //text color
        descriptionLabel.setColor(cc.color(204, 102, 0));
        content.addChild(descriptionLabel);

        //invisible 3 progress
        this.progress1.setVisible(false);
        this.progress2.setVisible(false);
        this.progress3.setVisible(false);

        //set progress
        let dataInfo = BuildingInfo[this.building._type].dataInfo;
        //for in dataInfo
        for (let i = 1; i <= dataInfo.length; i++) {
            let progress = this["progress" + i];
            let bar = progress.bar;
            let icon = progress.icon;
            let text = progress.text;
            this.setProgress(progress, bar, icon, text,dataInfo[i-1]);
        }
    },
    onClose: function () {
        this.removeFromParent(true);
        //turn on infolayer
        cc.director.getRunningScene().infoLayer.setVisible(true);
        var popupLayer = cc.director.getRunningScene().popUpLayer;
        popupLayer.setVisible(false);
    },
    onClickUpgrade: function () {
        this.building.onClickUpgrade();
        this.onClose();
    },
    setProgress: function (progress, bar, icon, text, typeRes) {
        //setVisible
        progress.setVisible(true);
        switch (typeRes)
        {
            case "capacityGold":
                icon.setTexture(res.ICON.GOLD_CAPACITY);
                let current = this.building.getCurrentAmount().gold;
                let capacity = this.building._capacityGold;
                text.setString("Sức chứa: " + Utils.numberToText(current) + "/" + Utils.numberToText(capacity));
                bar.setPercent(current/capacity*100)
                break;
            case "capacityElixir":
                icon.setTexture(res.ICON.ELIXIR_CAPACITY);
                let currentElixir = this.building.getCurrentAmount().elixir;
                let capacityElixir = this.building._capacityElixir;
                text.setString("Sức chứa: " + Utils.numberToText(currentElixir) + "/" + Utils.numberToText(capacityElixir));
                bar.setPercent(currentElixir/capacityElixir*100)
                break;
            case "hitpoints":
                bar.setPercent(100);
                icon.setTexture(res.ICON.HEART);
                text.setString("Máu: " + Utils.numberToText(this.building._hitpoints));
                break;
            case "productionGold":
                bar.setPercent(100);
                icon.setTexture(res.ICON.GOLD_PD_RATE);
                text.setString("Sản lượng: " + Utils.numberToText(this.building._productivityGold) + "/h");
                break;
            case "productionElixir":
                bar.setPercent(100);
                icon.setTexture(res.ICON.ELIXIR_PD_RATE);
                text.setString("Sản lượng: " + Utils.numberToText(this.building._productivityElixir) + "/h");
                break;
            case "damage":
                bar.setPercent(100);
                icon.setTexture(res.ICON.DAMAGE);
                text.setString("Sát thương: " + this.building._damage);
                break;
            case "army":
                bar.setPercent(100);
                icon.setTexture(res.ICON.ARMY);
                let armyTotal = ArmyManager.getInstance().getMaxSpace();
                let armyCurrent = ArmyManager.getInstance().getCurrentSpace();
                text.setString("Quân lính: " + armyCurrent + "/" + armyTotal);
                break;
        }
    }

});

InfoPopup.appear = function (building) {
    //show info popup and add child to popup layer
    let popup = new InfoPopup(building);
    var popupLayer = cc.director.getRunningScene().popUpLayer;
    popupLayer.setVisible(true);
    popupLayer.addChild(popup);
    popup.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    //turn off infolayer
    cc.director.getRunningScene().infoLayer.setVisible(false);
}
