


var ButtonEffect = {
    scaleOnClick : function (sender, type, scale = {start : BUTTON_TOUCH_SCALE_BIG, end: 1}) {
        cc.log("TYPE :::: ", type)
        // sender.setSwallowTouches(true);
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN: {
                sender.setScale( scale.start );
                break;
            }
            case ccui.Widget.TOUCH_ENDED: {
                sender.setScale(scale.end);
                break;
            }
            default: {
                break;
            }
        }
    },
}

var clickEventListener = (callback) => {

    return cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            let target = event.getCurrentTarget();
            let location = target.convertToNodeSpace(touch.getLocation());
            let spriteSize = target.getContentSize();
            let rect = cc.rect(0,0,spriteSize.width, spriteSize.height)
            if (cc.rectContainsPoint(rect, location)) {
                target.setScale(BUTTON_TOUCH_SCALE_BIG)
                return true;
            }
            return false;
        },

        onTouchEnded: function (touch,event) {
            let target = event.getCurrentTarget();
            let location = target.convertToNodeSpace(touch.getLocation());
            let spriteSize = target.getContentSize();
            let rect = cc.rect(0,0,spriteSize.width, spriteSize.height)
            if (cc.rectContainsPoint(rect, location)) {
                target.setScale(1)
                callback();
                return true;
            }

            return false;

        }

    })
}


var clickHoldEventListener = (callback) => {

    return cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            cc.log("Nhấn giữ");
            let target = event.getCurrentTarget();
            let location = target.convertToNodeSpace(touch.getLocation());
            let spriteSize = target.getContentSize();
            let rect = cc.rect(0,0,spriteSize.width, spriteSize.height)
            if (cc.rectContainsPoint(rect, location)) {
                target.setScale(BUTTON_TOUCH_SCALE_BIG);
                target.holdStartTime = new Date().getTime();
                target.count = 0;

                target.action = setTimeout(()=>{
                    target.loop =  setInterval(()=>{
                        cc.log("GỬI TẠO LÍNH NHA MẬY");
                        target.count ++ ;
                        callback(true, 1);
                    }, 400);

                }, 1000)

                return true;
            }
            return false;
        },

        onTouchEnded: function (touch,event) {
            let target = event.getCurrentTarget();
            let location = target.convertToNodeSpace(touch.getLocation());
            let spriteSize = target.getContentSize();
            let rect = cc.rect(0,0,spriteSize.width, spriteSize.height);

            clearTimeout(target.action);
            clearInterval(target.loop);

            if (cc.rectContainsPoint(rect, location)) {
                target.setScale(1);
                callback(false, target.count)
                return true;
            }

            return false;

        }

    })
}
