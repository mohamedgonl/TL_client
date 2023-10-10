var SelectedBuildingContainer = cc.Node.extend({
    _building: null,
    ctor: function (building) {
        this._super();
        this._building = building;
        this._textName = "Obstacle";
        this._menu = new cc.Menu();
        this.addChild(this._menu);
        this._menu.setPosition(0,60);
        this._menu.alignItemsHorizontallyWithPadding(10);
        this.addButtonToMenu("Xóa", res.BUTTON.REMOVE_BUTTON, this.onClickRemove);
        this.addButtonToMenu("Thông tin", res.BUTTON.INFO_BUTTON, this.onClickInfo);

    },

    addButtonToMenu: function (text, sprite, callback,textGold,textElixir) {

        //button

        // Tạo sprite cho trạng thái bình thường
        var normalSprite = new cc.Sprite(sprite);

        // selected = sprite cho nhỏ đi bằng 90% nhưng tâm vẫn ở vị trí cũ
        spriteWidth = normalSprite.getContentSize().width;
        spriteHeight = normalSprite.getContentSize().height;
        var selectedSprite = new cc.Sprite(sprite,
            cc.rect(-spriteWidth/20,-spriteHeight/20,spriteWidth+spriteWidth/10,spriteHeight+spriteHeight/10));
        selectedSprite.setScale(20/22)
        // Tạo sprite cho trạng thái khi bị vô hiệu hóa
        var disabledSprite = new cc.Sprite(sprite);
        //lam mo sprite di
        disabledSprite.setOpacity(100);

        let button = new cc.MenuItemSprite(normalSprite, selectedSprite, disabledSprite, callback, this);
        //test thu disable
        let label = new cc.LabelBMFont(text, res.FONT.SOJI[20],null,cc.TEXT_ALIGNMENT_CENTER);
        //label hien o giua duoi cua button
        label.setPosition(spriteWidth/2,spriteHeight/11);
        label.setAnchorPoint(0.5,0);
        button.addChild(label);
        button.setPosition(0,0);
        this._menu.addChild(button);
        this._menu.alignItemsHorizontallyWithPadding(10);
    },
    onClickRemove: function(){
        cc.log("onClickRemove")
        //gui goi tin xoa obstacle
        let packet = {
            error : 0,
            id : this._building._id,
            status: 1,
            type: this._building._type,
            startTime: Date.now(),
            //+20
            endTime: Date.now() + 5000,
        }
        this.onReceiveClickRemove(packet);
    },
    onReceiveClickRemove: function(packet){
        if(packet.error === 0)
        {
            //xoa obstacle khoi map
            var obstacle = MapManager.Instance().getBuildingById(packet.id);
            obstacle.startRemove(packet.startTime,packet.endTime);
            this.removeFromParent(true);
        }
    }



});