var TrainTroopPopup = cc.Layer.extend({
    _trainPages: [],
    _curPage: 0,
    ctor: function () {
        this._super();
        this.initPages();
        this.updateBarracks();
        this.setVisible(false);
    },

    initPages: function () {
        let barracks = ArmyManager.Instance().getBarrackList();
        for(let i = 0; i< barracks.length; i++){
            let trainPage = new TrainTroopPage(i);
            trainPage.setVisible(false);
            this._trainPages.push(trainPage);
            this.addChild(trainPage);
        }
    },

    updateBarracks: function () {
        let barracks = ArmyManager.Instance().getBarrackList();
        barracks.map(e => {
            testnetwork.connector.sendGetTrainingList({barrackId: e.getId()});
        })
    },

    close: function () {
        let popUp = this;
        PopupEffect.disappear(this, () => {
            popUp.setVisible(false);
            if(this._curPage) popUp._trainPages[this._curPage].setVisible(false);
            popUp.getParent().setVisible(false);
        })
    },

    getPage:  function ({page, barackId}){
        cc.log(JSON.stringify({page, barackId}))
        if(page) {
            cc.log("GO TO PAGE")
            return this._trainPages[page];
        }
        if(barackId) {
            cc.log("GO TO BARRACK ID")
            for (let i = 0; i <this._trainPages.length; i++) {
                cc.log("HERRE:", this._trainPages[i].getBarrackId())
                if(this._trainPages[i].getBarrackId() === barackId) {
                    return  this._trainPages[i];
                }
            }
        }
    },

    open: function (page) {
        // if(this._trainPages.length === 0) {
        //     this.initPages();
        // }
        if(page >= this._trainPages.length || page < 0 || page === undefined || page === null) return;

        this._curPage = page;
        this._trainPages[this._curPage].setVisible(true);
        cc.log("ĐI QUA DAY =-----------------------------------" + this._curPage);
    },

    changePage: function (page) {
        cc.log("OLD PAGE :::: "+this._curPage)
        this._trainPages[this._curPage].setVisible(false);
        if(page >= this._trainPages.length ) {
            this._curPage = 0;
        }
        else if(page < 0) {
            this._curPage = this._trainPages.length -1;
        }
        else {
            this._curPage = page;
        }
        this._trainPages[this._curPage].setVisible(true);
        cc.log("CHANGE PAGE :::: "+this._curPage)

    }

})