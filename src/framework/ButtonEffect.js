

var ButtonEffect = {
    scaleOnClick : function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN: {
                sender.setScale(BUTTON_TOUCH_SCALE);
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