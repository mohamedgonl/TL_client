

var PopupEffect = {
    appear: function (popup) {
        let actions = cc.sequence([cc.scaleTo(0.15,1.05),cc.scaleTo(0.05,1)]);
        popup.runAction(actions);
    },
    disappear: function (popup, callBack) {
        let actions = cc.sequence([cc.scaleTo(0.25,1.05),cc.scaleTo(0.05,1),cc.scaleTo(0.05,0), cc.callFunc(callBack)]);
        popup.runAction(actions);
    }
}