var AlgorithmImplement = cc.Class.extend({
    instance: null,
    _gridMapAStar: null,
    _results: {},
    _amcSize: 5,
    ctor: function () {

    },

    getGridMapStar : function () {
        return this._gridMapAStar;
    },

    setGridMapStar: function (gridMapGame) {

        let barracks = ArmyManager.Instance().getBarrackList();
        let barrackIds = barracks.map(e => e.getId());
        let armyCamps = ArmyManager.Instance().getArmyCampList();
        let armyCampIds = armyCamps.map(e => e.getId());
        this._results = {};
        let gridMap = JSON.parse(JSON.stringify(gridMapGame)) ;
        for (let i = 0; i < gridMap.length; i++) {
            for (let j = 0; j < gridMap[i].length; j++) {
                if (gridMap[i][j] === 0 || armyCampIds.indexOf(gridMap[i][j]) !== -1) {
                    gridMap[i][j] = 1;
                }
                else if ( (gridMap[i][j] !== 0 && (gridMap[i+1] ? gridMap[i+1][j] : 0.1) !== gridMap[i][j])
                || (gridMap[i][j] !== 0 && gridMap[i][j+1] !== gridMap[i][j]) ) {
                    gridMap[i][j] = 1;
                }
                else {
                    gridMap[i][j] = 0;
                }
            }
        }
        this._gridMapAStar = new Graph(gridMap, {diagonal: true});
    },

    searchPathByAStar: function (start, end) {
        let key = start.toString() + end.toString();
        if (this._results[key]) {
            return this._results[key];
        } else {
            cc.log("NEW SEARCH")
            let _start = this._gridMapAStar.grid[start[0]][start[1]];
            let _end = this._gridMapAStar.grid[end[0]][end[1]];
            let result = a_star.search(this._gridMapAStar, _start, _end, {closest: true});
            this._results[key] = result;
            return result;
        }
    },

    printGridMap: function (grid) {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                cc.log(grid[i][j] + "|");
            }
            cc.log("\n");
        }
    }

})
AlgorithmImplement.Instance = function () {
    if (AlgorithmImplement.instance == null) {
        AlgorithmImplement.instance = new AlgorithmImplement();
    }
    return AlgorithmImplement.instance;
}




