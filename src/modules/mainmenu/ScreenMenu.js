/**
 * Created by GSN on 7/6/2015.
 */

var ScreenMenu = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,
    _popUpLayer: null,


    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();

        var yBtn = 3*size.height/5;

        var btnNetwork = gv.commonButton(200, 64, cc.winSize.width/4, yBtn,"Network");
        this.addChild(btnNetwork);
        btnNetwork.addClickEventListener(this.onSelectNetwork.bind(this));

        var btnShop = gv.commonButton(200, 64, cc.winSize.width/2, yBtn,"Shop UI");
        this.addChild(btnShop);
        btnShop.addClickEventListener(this.onSelectShop.bind(this));

        var btnMap = gv.commonButton(200, 64, 3*cc.winSize.width/4, yBtn,"Map");
        this.addChild(btnMap);
        btnMap.addClickEventListener(this.onSelectMap.bind(this));

        this._popUpLayer = new PopupLayer();
        this._popUpLayer.setVisible(false);
        this.addChild(this._popUpLayer);


    },
    onEnter:function(){
        this._super();
    },
    onSelectNetwork:function(sender)
    {
        fr.view(ScreenNetwork);
    },
    onSelectShop:function(sender)
    {
        // fr.view(PopupLayer, 0);
        this._popUpLayer.setVisible(true);
    },
    onSelectMap:function(sender)
    {
        fr.view(MapLayer);
    },
    getPopUpLayer: function () {
        return this._popUpLayer
    }

});