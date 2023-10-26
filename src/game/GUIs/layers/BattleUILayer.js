var BattleUILayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        var node = CCSUlties.parseUIFile(res_ui.BATTLE_GUI);
        node.setContentSize(cc.winSize);
        ccui.helper.doLayout(node);
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

        this.userName = node.getChildByName("enemy_info").getChildByName("username");
        this.goldText = node.getChildByName("enemy_info").getChildByName("goldText");
        this.elixirText = node.getChildByName("enemy_info").getChildByName("elixirText");
        this.eloTextWin = node.getChildByName("enemy_info").getChildByName("goldTextWin");
        this.eloTextLose = node.getChildByName("enemy_info").getChildByName("goldTextLose");
        this.textTime = node.getChildByName("time").getChildByName("text");

        //resource of player
        this.goldCurrent = node.getChildByName("gold_container").getChildByName("text");
        this.elixirCurrent = node.getChildByName("elixir_container").getChildByName("text");
        this.goldMax = node.getChildByName("gold_container").getChildByName("text_max");
        this.elixirMax = node.getChildByName("elixir_container").getChildByName("text_max");

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
        this.troopSlots = node.getChildByName("troop_container").getChildren();
        for (var i = 0; i < this.troopSlots.length; i++) {
            var slot = this.troopSlots[i];
            var button = slot.getChildByName("button");
            this.setStateSlot(i);
            //add event with name of slot
            button.addClickEventListener(this.onTroopSlotClick.bind(this, i));
            button.setPressedActionEnabled(true);
        }
        this.test();
    },
    onLoadDataSuccess: function () {
        this.userName.setString(BattleManager.getInstance().enemyName);
        this.goldText.setString(BattleManager.getInstance().availableGold);
        this.elixirText.setString(BattleManager.getInstance().availableElixir);
        this.eloTextWin.setString(" + "+BattleManager.getInstance().winPoint);
        this.eloTextLose.setString(" - "+BattleManager.getInstance().losePoint);
        this.goldCurrent.setString(PlayerInfoManager.getInstance().getResource('gold'));
        this.elixirCurrent.setString(PlayerInfoManager.getInstance().getResource('elixir'));
        this.goldMax.setString(PlayerInfoManager.getInstance().getMaxResource().gold);
        this.elixirMax.setString(PlayerInfoManager.getInstance().getMaxResource().elixir);

        this.loadTroopSlots();
    },
    loadTroopSlots: function () {

      let listTroops = BattleManager.getInstance().listTroops;


      //reset all to empty
      for(let i = 0; i < this.troopSlots.length; i++){
          this.setStateSlot(i);
      }

      let index = 0;
      for (let [key, value] of listTroops) {
          let slot = this.troopSlots[index];
          this.setStateSlot(index, key, value);
      }

    },
    onTroopSlotClick: function (slotIndex) {
        //show troop list
        cc.log("onTroopSlotClick " + slotIndex);
    },
    onFindClick: function () {
        testnetwork.connector.sendFindMatch();
    },
    onEndClick: function () {
        cc.log("onEndClick");
        cc.director.runScene(new GameScene());
    },
    test: function () {
        this.userName.setString("Nguyen Van A");
        this.goldText.setString("1000");
        this.elixirText.setString("1000");
        this.eloTextWin.setString("100");
        this.eloTextLose.setString("100");
        this.textTime.setString("00:00:00");

        this.goldCurrent.setString("1000");
        this.elixirCurrent.setString("1000");
        this.goldMax.setString("1000");
        this.elixirMax.setString("1000");
    },
    setStateSlot: function (slotIndex, troopType = null, troopAmount= null) {
        cc.log("setStateSlot " + slotIndex + " " + troopType + " " + troopAmount)
        //empty case
        if(troopType == null)
        {
            this.troopSlots[slotIndex].getChildByName("button").setVisible(false);
            this.troopSlots[slotIndex].getChildByName("empty_slot").setVisible(true);
            return;
        }

        //not empty case
        let button = this.troopSlots[slotIndex].getChildByName("button");
        let troopSprite = button.getChildByName("troop_sprite");
        let selectedSprite = button.getChildByName("selected_sprite");
        let count = button.getChildByName("count");


        button.setVisible(true);
        troopSprite.setTexture(res.TROOPS_BATTLE[troopType]);
        selectedSprite.setVisible(false);
        count.setString("x"+troopAmount);

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