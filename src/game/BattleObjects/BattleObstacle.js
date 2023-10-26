var BattleObstacle = BattleGameObject.extend({
    ctor: function (type, id, posX, posY) {
        this._super();
        this._type = type;
        this._posX = posX;
        this._posY = posY;
        this._id = id;

        this.init();

    },
    init: function () {

        //load config
        var configObstacle = LoadManager.getInstance().getConfig(this._type, 1);
        this._width = configObstacle.width;
        this._height = configObstacle.height;

        //load sprites
        this.loadMainSprite();
        this.loadSubSprite();
        this.initState();

        //schedule update 1s 1 time
        this.update()
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0)
    },

    initState: function () {
        if (this._state === 1) {
            //-1 tho xay
            let playerInfoManager = PlayerInfoManager.getInstance();
            playerInfoManager.changeBuilder("current", -1);
            this._progressBar.setVisible(true);
        } else {
            this._progressBar.setVisible(false);
        }
    },
    //load main sprite
    loadMainSprite: function () {

        let typeIndex = this._type.substring(4);
        var body_link = res_map.SPRITE.BODY.OBS_LINK + typeIndex + "/idle/image0000.png";
        var grass_link = res_map.SPRITE.GRASS.OBSTACLE[this._width];
        this._body = new cc.Sprite(body_link);
        this._grass = new cc.Sprite(grass_link);

        this._body.setAnchorPoint(0.5, 0.5);
        this._grass.setAnchorPoint(0.5, 0.5);

        this._body.setScale(0.5);

        this.addChild(this._grass);
        this.addChild(this._body);
    },

    loadSubSprite: function () {
        //arrow move
        this._arrowMove = new cc.Sprite(res_map.SPRITE.ARROW_MOVE[this._width]);
        this._arrowMove.setScale(SCALE_BUILDING_BODY);
        this._arrowMove.setAnchorPoint(0.5, 0.5);
        this._arrowMove.setVisible(false);
        this.addChild(this._arrowMove, ZORDER_BUILDING_EFFECT);

        //progress bar
        this._progressBar = new ccui.Slider();
        this._progressBar.setScale(SCALE_BUILDING_BODY);
        this._progressBar.loadBarTexture(res_map.SPRITE.PROGRESS_BAR_BG);
        this._progressBar.loadProgressBarTexture(res_map.SPRITE.PROGRESS_BAR);
        this._progressBar.setAnchorPoint(0.5, 0.5);
        this._progressBar.setPosition(0, 30);
        this._progressBar.setVisible(false);
        this.addChild(this._progressBar);

        //name label
        //nameLabel Cay Coi size 20 dont arial cc.Text
        this._nameLabel = new cc.LabelBMFont("Vật cản", res.FONT.SOJI[FONT_SIZE_NAME_LABEL], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._nameLabel.setAnchorPoint(0.5, 0.5);
        this._nameLabel.setPosition(0, 50);
        this._nameLabel.setColor(new cc.Color(255, 255, 0));
        this.addChild(this._nameLabel);
        this._nameLabel.setVisible(false);
        //time label
        this._timeLabel = new cc.LabelBMFont("timeLabel", res.FONT.SOJI[12], 350, cc.TEXT_ALIGNMENT_CENTER);
        this._timeLabel.setAnchorPoint(0.5, 0);
        this._timeLabel.setPosition(
            this._progressBar.getBoundingBox().width,
            this._progressBar.getBoundingBox().height + 10);

        this._progressBar.addChild(this._timeLabel, ZORDER_BUILDING_EFFECT);

    },

    loadButton: function () {


    },
    onSelected: function () {

    },
    onUnselected: function () {

    },
    showButtonToInfoLayer: function () {

    },
    setType: function (type) {
        this._type = type;
    },
    getType: function () {
        return this._type;
    },
    getState: function () {
        return this._state;
    },
    setState: function (state) {
        this._state = state;
    },
    updateProgress: function () {

    },
    update: function (dt) {
        if (this._state === 1) {
            if (this._progressBar.isVisible() === false)
                this._progressBar.setVisible(true);
            this.updateProgress();
        } else {
            this._progressBar.setVisible(false);
        }
    },
    startRemove: function (startTime, endTime) {

    },
    completeRemove: function () {

    },
    //check to client, if valid then send packet to server
    onClickRemove: function () {

    },
    //if server response error = 0, then start remove obstacle
    onReceiveClickRemove: function (packet) {

    },
    onAddIntoMapManager: function () {
    },
    onReceivedBuyResourceByGemSuccess: function (packet) {

    },
    onClickQuickFinish: function () {

    },
    quickFinish: function () {

    },
    getState: function () {
        return this._state;
    },
    getTimeLeft: function () {

    },
    onReceivedQuickFinishOfAnother: function (packet) {

    },
    getGridPosition: function () {
        return cc.p(this._posX, this._posY);
    }
});