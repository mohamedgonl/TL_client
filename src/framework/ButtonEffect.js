

var ButtonEffect = {
    scaleOnClick : function (sender, type) {
        cc.log("TYPE :::: ", type)
        sender.setSwallowTouches(true);
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN: {
                sender.setScale( BUTTON_TOUCH_SCALE );
                break;
            }
            case ccui.Widget.TOUCH_ENDED: {
                sender.setScale(1);
                break;
            }
            default: {
                break;
            }
        }
    },
}