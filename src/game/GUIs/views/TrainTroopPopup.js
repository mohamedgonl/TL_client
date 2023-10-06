var TrainTroopPopup = cc.Node.extend({

    ctor: function () {
        this._super();


    },

    close: function () {
        let popUp = this;
        PopupEffect.disappear(this, () => {
            popUp.getParent().setVisible(false);
            popUp.setVisible(false);
        })
    }

})