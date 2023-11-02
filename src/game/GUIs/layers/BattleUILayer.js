var BattleUILayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        this.chosenSlot = null;

        var node = CCSUlties.parseUIFile(res_ui.BATTLE_GUI);
        node.setContentSize(cc.winSize);
        ccui.helper.doLayout(node);
        this.node = node;
        this.addChild(node);

        //log all children of children of children of children of node
        // let children = node.getChildren();
        // children.map(i => {
        //     console.log(i.getName());
        //     let childrenOfChildren = i.getChildren();
        //     childrenOfChildren.map(j => {
        //         console.log("   "+j.getName());
        //         let childrenOfChildrenOfChildren = j.getChildren();
        //         childrenOfChildrenOfChildren.map(k => {
        //             console.log("      "+k.getName());
        //             let childrenOfChildrenOfChildrenOfChildren = k.getChildren();
        //             childrenOfChildrenOfChildrenOfChildren.map(l => {
        //                 console.log("         "+l.getName());
        //             })
        //         })
        //     })
        // })

        this.enemyInfo = node.getChildByName("enemy_info");
        this.userName = this.enemyInfo.getChildByName("username");
        this.goldText = this.enemyInfo.getChildByName("goldText");
        this.elixirText = this.enemyInfo.getChildByName("elixirText");
        this.eloTextWin = this.enemyInfo.getChildByName("goldTextWin");
        this.eloTextLose = this.enemyInfo.getChildByName("goldTextLose");
        this.textTime = node.getChildByName("time").getChildByName("text");
        this.timeLabel = node.getChildByName("time").getChildByName("BitmapFontLabel_5");

        //resource of player
        this.goldCurrent = node.getChildByName("gold_container").getChildByName("text");
        this.elixirCurrent = node.getChildByName("elixir_container").getChildByName("text");
        this.gemCurrent = node.getChildByName("g_container").getChildByName("text");
        this.goldMax = node.getChildByName("gold_container").getChildByName("text_max");
        this.elixirMax = node.getChildByName("elixir_container").getChildByName("text_max");

        //star result
        this.starContainer = node.getChildByName("star_container");
        this.star1 = this.starContainer.getChildByName("star1");
        this.star2 = this.starContainer.getChildByName("star2");
        this.star3 = this.starContainer.getChildByName("star3");
        this.destroyPercentText = this.starContainer.getChildByName("percent_text");
        this.starContainer.setVisible(false);

        //button
        this.btnFind = node.getChildByName("btn_find");
        this.btnFind.getChildByName("price").setString("250")
        this.btnEnd = node.getChildByName("btn_end");

        //add button event
        this.btnFind.addClickEventListener(this.onFindClick.bind(this));
        this.btnFind.setPressedActionEnabled(true);
        this.btnEnd.addClickEventListener(this.onEndClick.bind(this));
        this.btnEnd.setPressedActionEnabled(true);

        //for all troop slot, add button event
        this.troopContainer = node.getChildByName("troop_container");
        this.troopSlots = this.troopContainer.getChildren();
        for (var i = 0; i < this.troopSlots.length; i++) {
            var slot = this.troopSlots[i];
            var button = slot.getChildByName("button");
            this.setStateSlot(i);
            //add event with name of slot
            button.addClickEventListener(this.onTroopSlotClick.bind(this, i));
            button.setPressedActionEnabled(true);
        }
    },

    updatePlayerResources: function () {
        const {gold, elixir, gem} = BattleManager.getInstance().playerResources;

        this.goldCurrent.setString(gold);
        this.elixirCurrent.setString(elixir);
        this.gemCurrent.setString(gem);
    },

    setResourceLeft: function (resource, type) {
        if (type === RESOURCE_TYPE.GOLD)
            this.goldText.setString(resource);
        else if (type === RESOURCE_TYPE.GOLD)
            this.elixirText.setString(resource);
    },

    onLoadDataSuccess: function () {
        cc.log("onLoadDataSuccess::::::::::::::::::::::::::::")
        this.userName.setString(BattleManager.getInstance().enemyName);
        this.goldText.setString(BattleManager.getInstance().availableGold);
        this.elixirText.setString(BattleManager.getInstance().availableElixir);
        this.eloTextWin.setString(" + " + BattleManager.getInstance().winPoint);
        this.eloTextLose.setString(" - " + BattleManager.getInstance().losePoint);

        this.goldCurrent.setString(BattleManager.getInstance().getPlayerResource(RESOURCE_TYPE.GOLD));
        this.elixirCurrent.setString(BattleManager.getInstance().getPlayerResource(RESOURCE_TYPE.ELIXIR));
        this.goldMax.setString(BattleManager.getInstance().getPlayerMaxResource(RESOURCE_TYPE.GOLD));
        this.elixirMax.setString(BattleManager.getInstance().getPlayerMaxResource(RESOURCE_TYPE.ELIXIR));

        //set bar percent
        let goldPercent = BattleManager.getInstance()
            .getPlayerResource(RESOURCE_TYPE.GOLD) / BattleManager.getInstance().getPlayerMaxResource(RESOURCE_TYPE.GOLD);
        let elixirPercent = BattleManager.getInstance()
            .getPlayerResource(RESOURCE_TYPE.ELIXIR) / BattleManager.getInstance().getPlayerMaxResource(RESOURCE_TYPE.ELIXIR);

        this.goldBar = this.node.getChildByName("gold_container").getChildByName("bar_bg").getChildByName("bar");
        this.elixirBar = this.node.getChildByName("elixir_container").getChildByName("bar_bg").getChildByName("bar");

        this.goldBar.setPercent(goldPercent * 100);
        this.elixirBar.setPercent(elixirPercent * 100);

        this.timeLabel.setString("Bắt đầu sau:");

        this.btnFind.enabled = true;
        //load state of troop
        this.loadTroopSlots();
    },
    loadTroopSlots: function () {

        let listTroops = BattleManager.getInstance().listTroops;


        //reset all to empty
        for (let i = 0; i < this.troopSlots.length; i++) {
            this.setStateSlot(i);
        }

        let index = 0;
        for (let [key, value] of listTroops) {
            let slot = this.troopSlots[index];
            this.setStateSlot(index, key, value);
            index++;
        }

    },
    onTroopSlotClick: function (slotIndex) {
        //show troop list
        cc.log("onTroopSlotClick " + slotIndex);
        if (this.chosenSlot == null) {
            this.chosenSlot = slotIndex;
            //turn on selected sprite
            this.troopSlots[slotIndex].getChildByName("button").getChildByName("selected_sprite").setVisible(true);
            return;
        }

        if (this.chosenSlot != slotIndex) {
            //turn off selected sprite old
            this.troopSlots[this.chosenSlot].getChildByName("button").getChildByName("selected_sprite").setVisible(false);
            //turn on selected sprite
            this.troopSlots[slotIndex].getChildByName("button").getChildByName("selected_sprite").setVisible(true);

            this.chosenSlot = slotIndex;

        }
    },
    onFindClick: function () {
        this.btnFind.enabled = false;
        cc.director.getRunningScene().onFindMatch();
    },
    onEndClick: function () {
        this.btnEnd.setVisible(false);
        cc.director.getRunningScene().onEndBattle();
    },
    setStateSlot: function (slotIndex, troopType = null, troopAmount = null) {
        cc.log("setStateSlot " + slotIndex + " " + troopType + " " + troopAmount)
        //empty case
        if (troopType == null) {
            this.troopSlots[slotIndex].getChildByName("button").setVisible(false);
            this.troopSlots[slotIndex].getChildByName("empty_slot").setVisible(true);
            return;
        }

        //not empty case
        let button = this.troopSlots[slotIndex].getChildByName("button");
        let troopSprite = button.getChildByName("troop_sprite");
        let selectedSprite = button.getChildByName("selected_sprite");
        let count = button.getChildByName("count");
        let emptySlot = this.troopSlots[slotIndex].getChildByName("empty_slot");


        button.setVisible(true);
        troopSprite.setTexture(res.TROOPS_BATTLE[troopType]);
        selectedSprite.setVisible(false);
        count.setString("x" + troopAmount);
        emptySlot.setVisible(false);

        button.type = troopType;

    },
    getTypeOfChosenSlot: function () {
        if (this.chosenSlot == null) return null;
        return this.troopSlots[this.chosenSlot].getChildByName("button").type;
    },
    setTimeLeft: function (secondsLeft) {
        this.textTime.setString(NumberUltis.formatSecondToString(secondsLeft));
    },

    updateStarUI: function () {
        const starAmount = BattleManager.getInstance().starAmount;
        this.star1.setVisible(starAmount > 0);
        this.star2.setVisible(starAmount > 1);
        this.star3.setVisible(starAmount > 2);
    },

    updateDestroyPercentage: function (percentage) {
        this.destroyPercentText.setString(percentage.toString() + "%");
    },

    onStartBattle: function () {
        this.timeLabel.setString("Kết thúc sau:");
        this.btnFind.setVisible(false);
        this.starContainer.setVisible(true);
        this.star1.setVisible(false);
        this.star2.setVisible(false);
        this.star3.setVisible(false);
    },
    onEndBattle: function () {
        this.btnEnd.setVisible(false);
        this.enemyInfo.setVisible(false);
        this.troopContainer.setVisible(false);
        this.starContainer.setVisible(false);
    },
    onInitTroop: function () {
        let button = this.troopSlots[this.chosenSlot].getChildByName("button");
        let count = button.getChildByName("count");
        //count defined as "x20" so we need to get the number after "x"
        let troopAmount = Number(count.getString().substring(1));
        troopAmount--;
        count.setString("x" + troopAmount);
    }
});

/*
enemy_info
   username
   textRes
   elixir_icon_1
   gold_icon_2
   goldText
   elixirText
   gold_icon_2_0
   goldTextWin
   textLose
   gold_icon_2_0_0
   goldTextLose
time
   BitmapFontLabel_5
   text
gold_container
   bar_bg
      bar
   icon
   text_max
   text
elixir_container
   bar_bg
      bar
   icon
   text_max
   text
g_container
   bar_bg
   icon
   text
btn_find
   BitmapFontLabel_14
   price
   gold_icon_11
star-container
    result-text
    star1
    star2
    star3
    percent-text
btn_end
   BitmapFontLabel_13
troop_container
   slot
      button
         troop_sprite
         selected_sprite
         star_icon
         level
         count
      empty_slot
   slot1
      button
         troop_sprite
         selected_sprite
         star_icon
         level
         count
      empty_slot
   slot2
      button
         troop_sprite
         selected_sprite
         star_icon
         level
         count
      empty_slot
   slot3
      button
         troop_sprite
         selected_sprite
         star_icon
         level
         count
      empty_slot
   slot4
      button
         troop_sprite
         selected_sprite
         star_icon
         level
         count
      empty_slot
   slot5
      button
         troop_sprite
         selected_sprite
         star_icon
         level
         count
      empty_slot
   slot6
      button
         troop_sprite
         selected_sprite
         star_icon
         level
         count
      empty_slot
   slot7
      button
         troop_sprite
         selected_sprite
         star_icon
         level
         count
      empty_slot
   slot8
      button
         troop_sprite
         selected_sprite
         star_icon
         level
         count
      empty_slot
 */