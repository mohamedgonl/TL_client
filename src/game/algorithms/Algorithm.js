var AlgorithmImplement = cc.Class.extend({
    instance: null,
    _gridMap: null,
    ctor: function () {

    },

    setGridMap: function (gridMap) {
        this._gridMap = gridMap;
    },

    getGridMap: function () {
        return this._gridMap;
    },

    printGridMap: function () {
        this._gridMap.map(rows => {
           rows.map(col => {
               cc.log(col+" ")
           })
            cc.log("\n")
        })
    }


})
AlgorithmImplement.Instance = function () {
    if (AlgorithmImplement.instance == null) {
        AlgorithmImplement.instance = new AlgorithmImplement();
    }
    return AlgorithmImplement.instance;
}




