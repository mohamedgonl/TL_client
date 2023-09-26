

var ItemInfoPopup = cc.Layer.extend({
    ctor: function (data) {
        this._super();
        let node = CCSUlties.parseUIFile(res_ui.ITEM_INFO);
        this._node = node;
        this.setInfo(data);
        node.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        let buttonClose = node.getChildByName("button_close");
        buttonClose.addTouchEventListener(this.handleClose,this);
        this.addChild(node);
    },

    handleClose : function (sender, type) {
        ButtonEffect.scaleOnClick(sender,  type);
        this.removeFromParent();
    }
    ,

    setInfo : function (data) {
        let title = this._node.getChildByName("title");
        title.setString(data.name + " cấp 1");

        let progressBarList = this._node.getChildByName("process_bar_list");
        let processBarListPosY = progressBarList.getPosition().y;
        let processBarInfo = CCSUlties.parseUIFile(res_ui.INFO_PROCESS_BAR);
        let processBarHeight = (processBarInfo.getChildByName("bg")).getContentSize().height;

        if(data.detail) {
            let _infoList = data.detail.infoList;
            if(_infoList) {
                // find first item y pos
                let firstProcessBarYPos;
                if(_infoList.length%2 === 0) {
                    firstProcessBarYPos = processBarListPosY + ITEM_INFO_PROCESS_BAR_SPACING/2
                        + ( (_infoList.length -1) /2) * processBarHeight
                        + ( (_infoList.length -1) /2 - 0.5) * ITEM_INFO_PROCESS_BAR_SPACING;
                }
                else {
                    firstProcessBarYPos = ((_infoList.length - 1)/2)
                        * (ITEM_INFO_PROCESS_BAR_SPACING + processBarHeight);
                }

                for (let i = 0; i < _infoList.length; i++) {
                    let newProcessBar = CCSUlties.parseUIFile(res_ui.INFO_PROCESS_BAR);
                    progressBarList.addChild(newProcessBar);

                    newProcessBar.setPositionY(firstProcessBarYPos
                        - i*(processBarHeight + ITEM_INFO_PROCESS_BAR_SPACING));

                    let processTitle =  newProcessBar.getChildByName("title");
                    processTitle.setString(_infoList[i].title);

                    let processIcon = newProcessBar.getChildByName("icon");
                    processIcon.loadTexture(_infoList[i].icon);

                    if(_infoList[i].bar_percent !== undefined){
                        let processBar = newProcessBar.getChildByName("process");
                        processBar.setPercent(_infoList[i].bar_percent);
                    }

                }
            }
        }
    }
})