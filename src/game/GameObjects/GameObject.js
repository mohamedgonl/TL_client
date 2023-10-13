
var GameObject = cc.Node.extend({
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
        this._isChosen = false;
    },

    setId: function (id) {
        this._id = id;
    },

    getId: function () {
        return this._id;
    }


});