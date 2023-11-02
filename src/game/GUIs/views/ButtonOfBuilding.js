var ButtonOfBuilding = cc.Sprite.extend({
   ctor: function (text,sprite,status,callback,amount,type) {
      this._super();
      let node = CCSUlties.parseUIFile(res_ui.BUTTON_OF_BUILDING);
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
      //set Sprite
      this.sprite.setTexture(sprite);
      //set text
      this.text.setString(text);

      //set amount
      if (amount != null)
         this.amount.setString(amount);
      else
         this.amount.setVisible(false);

      //set type
      if (type != null) {
         if (type === "elixir")
            this.type.setTexture(res.ICON.ELIXIR);
         else
            this.type.setTexture(res.ICON.GOLD);
      } else
         this.type.setVisible(false);

      //set status
      //normal
      if (status === 1)
      {     //set color to gray
            this.sprite.setColor(new cc.Color(128, 128, 128));

      }
      else if(status ===2)
      {
            //set amount to red
            this.amount.setColor(new cc.Color(255, 0, 0));
      }
      this.addChild(node);

   }


});