var fr = fr || {}

fr.view = function (Screen, transitionTime) {
    var layer = new Screen();
    layer.setName("screen");
    var scene = new cc.Scene();
    scene.addChild(layer);
    if (!transitionTime) {
        transitionTime = 1.2;
    }
    cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
};
fr.getCurrentScreen = function () {
    return cc.director.getRunningScene().getChildByName("screen");
};
fr.createActionByFrames = function (frames, options) {
    let {delayPerUnit, restoreOriginalFrame} = options;
    let animate = new cc.Animation();
    for (let idx in frames) {
        animate.addSpriteFrameWithFile(frames[idx]);
    }
    animate.setDelayPerUnit(delayPerUnit);
    animate.setRestoreOriginalFrame(restoreOriginalFrame);
    const action = cc.animate(animate);

    return action;
}

