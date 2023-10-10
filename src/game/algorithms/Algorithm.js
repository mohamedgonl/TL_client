var AlgorithmImplement = cc.Class.extend({
    instance: null,
    _gridMapAStar: null,
    _results: {},
    ctor: function () {

    },

    setGridMapStar : function (gridMapGame) {
        this._results = {};
        let gridMap = gridMapGame;
        for (let i = 0; i < gridMap.length; i++) {
            for (let j = 0; j < gridMap[i].length; j++) {
                if (gridMap[i][j] === 0) {
                    gridMap[i][j] = 1;
                } else {
                    gridMap[i][j] = 0;
                }
            }
        }
        this._gridMapAStar = new Graph(gridMap, {diagonal: true});
    },

    searchPathByAStar: function (start, end) {
        let key = start.toString() + end.toString();
        if(this._results[key]) {
            return this._results[key];
        }
        else {
            let _start = this._gridMapAStar.grid[start[0]][start[1]];
            let _end = this._gridMapAStar.grid[end[0]][end[1]];
            let result = a_star.search(this._gridMapAStar,_start, _end, {closest: true});
            this._results[key] = result;
            return result;
        }
    }

})
AlgorithmImplement.Instance = function () {
    if (AlgorithmImplement.instance == null) {
        AlgorithmImplement.instance = new AlgorithmImplement();
    }
    return AlgorithmImplement.instance;
}




