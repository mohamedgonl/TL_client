var GameObject = cc.Sprite.extend({
    ctor: function () {
        this._super();
        this._id = null;
        this._posX = null;
        this._posY = null;
        this._name = null;
        this._body = null;
        this._grass = null;
        this._shadow = null;
        this._objectType = null;
    },
});