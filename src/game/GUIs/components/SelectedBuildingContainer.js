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
            this.addButtonToMenu("Thông tin",res.BUTTON.INFO,this.onClickRemove);
            this.addButtonToMenu("Nâng cấp",res.BUTTON.UPGRADE,this.onClickRemove);
            //if building is upgrading
            if(this._building._state === 2)
            {
                this.addButtonToMenu("Hủy",res.BUTTON.CANCEL,this.onClickCancel);
            }
        }
    },



});