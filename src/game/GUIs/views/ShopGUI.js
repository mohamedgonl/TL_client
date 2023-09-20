const CONFIRM_DIALOGUE_SIZE_OFFSET = cc.size(100, 150);
const ANIMATION_TIME = 0.15;
const FADE_RATIO = 150;

const FONT = {
    LABEL_OFFSET: 50,
    DESCRIPTION_TEXT_SIZE: 45,
    TITLE_TEXT_SIZE: 70,
    GAME_FONT: res.FONT.SOJI["16"],
    LABEL_STROKE: 4,
};

const IMAGEPATH = {
    OK_BUTTON: res.BUTTON.INFO,
    OK_BUTTON_PRESSED: res.BUTTON.INFO,
    CANCEL_BUTTON: res.BUTTON.BACK,
    CANCEL_BUTTON_PRESSED: res.BUTTON.BACK,
    CLOSE_BUTTON: res.BUTTON.CLOSE,
    BACKGROUND_IMAGE: res.BACKGROUND.SHOP,
};

var PopupDelegates = cc.LayerGradient.extend({
    ctor: function() {
        this._super(cc.color(0, 0, 0, 0), cc.color(0, 0, 0, FADE_RATIO), cc.winSize.width / 1.7, cc.winSize.height / 2, 0.075);
        this.setOpacity(0);
        this.show(true);
        this.setUpTouches();
        cc.load
    },

    show: function(animated) {
        if (animated) {
            this.runAction(cc.fadeTo(ANIMATION_TIME, FADE_RATIO));
        } else {
            this.setOpacity(FADE_RATIO);
        }
    },

    dismiss: function(animated) {
        if (animated) {
            this.runAction(cc.sequence(cc.fadeTo(ANIMATION_TIME, 0), cc.removeSelf()));
        } else {
            this.removeFromParentAndCleanup(true);
        }
    },

    setUpTouches: function () {
        const listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: (touch, event) => {
                if (this._bg) {
                    if (!this._bg.getBoundingBox().containsPoint(this.convertToNodeSpace(touch.getLocation()))) {
                        this.dismiss(true);
                    }
                } else {
                    this.dismiss(true);
                }
                return true;
            },
        });
        cc.eventManager.addListener(listener, this);
    }
})

const Popup = {
    createAsMessage: function (title, msg) {
        return this.createAsConfirmDialogue(title, msg, null);
    },

    createAsConfirmDialogue: function (title, msg, YesFunc) {
        return this.create(title, msg, null, YesFunc);
    },

    create: function (title, msg, lbl, YesFunc) {
        const node = new cc.Node();
        const winSize = cc.winSize;

        if (!lbl) {
            lbl = new ccui.Text(msg, FONT.GAME_FONT, FONT.DESCRIPTION_TEXT_SIZE);
        }
        lbl.setPosition(winSize.width / 2, winSize.height / 2 - FONT.LABEL_OFFSET / 2);
        lbl.enableOutline(cc.color(0, 0, 0, 255), FONT.LABEL_STROKE);
        lbl.setAlignment(cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        lbl.enableShadow(cc.color(0, 0, 0, 255), cc.size(0, -2));

        if (YesFunc) {
            const yesButton = new cc.MenuItemImage(IMAGEPATH.OK_BUTTON, IMAGEPATH.OK_BUTTON_PRESSED, () => {
                YesFunc();
                this.dismiss(true);
            });

            const noButton = new cc.MenuItemImage(IMAGEPATH.CANCEL_BUTTON, IMAGEPATH.CANCEL_BUTTON_PRESSED, () => {
                this.dismiss(true);
            });

            const menu = new cc.Menu(yesButton, noButton);
            node.addChild(menu, 2);
            menu.setPosition(winSize.width / 2, winSize.height / 2 - lbl.getContentSize().height / 2 - 75);
            menu.alignItemsHorizontallyWithPadding(FONT.LABEL_OFFSET / 2);

            lbl.setPosition(winSize.width / 2, winSize.height / 2);
            // CONFIRM_DIALOGUE_SIZE_OFFSET = cc.size(CONFIRM_DIALOGUE_SIZE_OFFSET.width, 300);
        }
        node.addChild(lbl, 3);
        // this.initBg(lbl.getContentSize().add(cc.size(CONFIRM_DIALOGUE_SIZE_OFFSET.width, 300)), title);
        return node;
    },

    initBg: function (size, title) {
        const winSize = cc.winSize;
        const _bg = new ccui.ImageView(IMAGEPATH.BACKGROUND_IMAGE);
        node.addChild(_bg);
        _bg.setPosition(winSize.width / 2, winSize.height / 2);
        _bg.setScale9Enabled(true);
        _bg.setContentSize(size);

        const fill = new ccui.ImageView(IMAGEPATH.BACKGROUND_IMAGE);
        _bg.addChild(fill);
        fill.setColor(cc.color(210, 210, 210));
        fill.setScale9Enabled(true);
        fill.setAnchorPoint(cc.p(0.0, 0.0));
        fill.setPosition(cc.p(FONT.LABEL_OFFSET / 4, FONT.LABEL_OFFSET / 4));
        fill.setContentSize(cc.size(size.width - FONT.LABEL_OFFSET / 2, size.height - FONT.LABEL_OFFSET * 2));

        const heading = new cc.LabelTTF(title, FONT.GAME_FONT, FONT.TITLE_TEXT_SIZE);
        heading.setPosition(_bg.getContentSize().width / 2, _bg.getContentSize().height - FONT.LABEL_OFFSET);
        _bg.addChild(heading);
        heading.enableOutline(cc.color(0, 0, 0, 255), FONT.LABEL_STROKE);
        heading.enableShadow(cc.color(0, 0, 0, 255), cc.size(0, -3));
    },
};
