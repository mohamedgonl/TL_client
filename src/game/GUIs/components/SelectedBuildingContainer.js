var SelectedBuildingContainer = cc.Node.extend({
    _building: null,
    ctor: function (building) {
        this._super();
        this._building = building;
        this._textName = "Obstacle";
        this._menu = new cc.Menu();
        this.addChild(this._menu);
        this.init();
    },
    init: function () {
        this.loadText();
        this.loadButtons();
        this.loadMenu();
    },
    loadText: function () {
        //name label
        let text = "";
        if(this._building._type.substring(0,3) === "OBS")
        {
            text = "Obstacle";
        }
        else
        {
            text = this._building._type + " cấp "+ this._building._level;
        }
        this._textName = new cc.LabelBMFont(text, res.FONT.SOJI[20], null, cc.TEXT_ALIGNMENT_CENTER);
        this._textName.setPosition(0, 140);
        this._textName.setAnchorPoint(0.5, 0.5);
        this.addChild(this._textName);

    },
    loadMenu: function () {
      //menu button container hiển thị tại giữa dưới màn hình, từ y=0 đến y=180
        this._menu.setPosition(0,60);
        this._menu.alignItemsHorizontallyWithPadding(10);
        //make menu container fit with button


    },
    loadButtons: function () {
        let type = this._building._type;
        let building = this._building;
        if(type.substring(0,3) === "OBS")
        {
            this.addButtonToMenu("Xóa",res.BUTTON.REMOVE,this.onClickRemove);
        }
        else if(type === "TOW_1")
        {
            //2 button thong tin, nang cap
            this.addButtonToMenu("Thông tin",res.BUTTON.INFO,this.onClickInfo);
            this.addButtonToMenu("Nâng cấp",res.BUTTON.UPGRADE,this.onClickUpgrade);
            //if building is upgrading
            if(this._building._state === 2)
            {
                this.addButtonToMenu("Hủy",res.BUTTON.CANCEL,this.onClickCancel);
            }
        }
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