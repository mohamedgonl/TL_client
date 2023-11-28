var Bomber = BattleTroop.extend({
    ctor: function (posX,posY) {
        this._type = "ARM_6";
            this._super(posX,posY);
    },
    findPath: function () {
        //get path
        let graph = BattleManager.getInstance().getBattleGraphWithoutWall();
        let start = new BattleGridNode(this._posX, this._posY, graph.getNode(this._posX, this._posY).weight, null);
        //let end X Y random in building
        if(this._id === null)
        {
            cc.log("ID TROOP NULL :::::::::::::::::::")

        }
        let nearestPoint = this._target.getNearestPoint({x: this._posX, y: this._posY},this._id,true);

        let end = new BattleGridNode(
            nearestPoint.x, nearestPoint.y,
            graph.getNode(nearestPoint.x, nearestPoint.y).weight, this._target._id);

        this._path = BattleAStar.search(graph, start, end);
    },
    checkPath: function () {
        for (let i = 0; i < this._path.length; i++) {
            let x = this._path[i].x;
            let y = this._path[i].y;

            // if path go through WAL, this._target = WAL
            let building = BattleManager.getInstance().getBuildingByGrid(x, y);
            if(building !== null) {
                LogUtils.writeLog("building: " + building._type);
                LogUtils.writeLog("x , y" + x + " " + y);
                LogUtils.writeLog("building pos: " + building._posX + " " + building._posY);
                LogUtils.writeLog("building width: " + building._width + " height: " + building._height);
            }
            //if (x,y) is in range attack, path is valid, return;
            if (this.isInAttackRange(this._target, x, y) === true) {
                return;
            }
        }
    },


})