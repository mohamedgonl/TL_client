function BattleGridNode(x, y, weight) {
    this.x = x;
    this.y = y;
    this.weight = weight;
}

BattleGridNode.prototype.toString = function () {
    return "[" + this.x + " " + this.y + "]";
};

BattleGridNode.prototype.getCost = function (fromNeighbor) {
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
        return 1.41421;
    }
    return 1;
};

BattleGridNode.prototype.canNotWalk = function () {
    let x = this.x;
    let y = this.y;
    let grid = BattleManager.getInstance().getTroopMap();
    return grid[x][y] !== 0;
};
//======================================================================================================================

function BattleGraph(gridIn) {
    this.nodes = [];
    this.grid = [];
    for (let x = 0; x < gridIn.length; x++) {
        this.grid[x] = [];

        for (let y = 0, row = gridIn[x]; y < row.length; y++) {
            let node = new BattleGridNode(x, y, row[y]);
            this.grid[x][y] = node;
            this.nodes.push(node);
        }
    }
    this.init();
}

BattleGraph.prototype.init = function () {
    this.dirtyNodes = [];
    for (let i = 0; i < this.nodes.length; i++) {
        BattleAStar.cleanNode(this.nodes[i]);
    }
};

BattleGraph.prototype.cleanDirty = function () {
    for (let i = 0; i < this.dirtyNodes.length; i++) {
        BattleAStar.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
};

BattleGraph.prototype.markDirty = function (node) {
    this.dirtyNodes.push(node);
};

BattleGraph.prototype.neighbors = function (node) {
    let ret = [];
    let x = node.x;
    let y = node.y;
    let grid = this.grid;

    // West
    if (grid[x - 1] && grid[x - 1][y]) {
        ret.push(grid[x - 1][y]);
    }

    // East
    if (grid[x + 1] && grid[x + 1][y]) {
        ret.push(grid[x + 1][y]);
    }

    // South
    if (grid[x] && grid[x][y - 1]) {
        ret.push(grid[x][y - 1]);
    }

    // North
    if (grid[x] && grid[x][y + 1]) {
        ret.push(grid[x][y + 1]);
    }

    // Southwest
    if (grid[x - 1] && grid[x - 1][y - 1]) {
        ret.push(grid[x - 1][y - 1]);
    }

    // Southeast
    if (grid[x + 1] && grid[x + 1][y - 1]) {
        ret.push(grid[x + 1][y - 1]);
    }

    // Northwest
    if (grid[x - 1] && grid[x - 1][y + 1]) {
        ret.push(grid[x - 1][y + 1]);
    }

    // Northeast
    if (grid[x + 1] && grid[x + 1][y + 1]) {
        ret.push(grid[x + 1][y + 1]);
    }
    return ret;
};

BattleGraph.prototype.toString = function () {
    let graphString = [];
    let nodes = this.grid;
    for (let x = 0; x < nodes.length; x++) {
        let rowDebug = [];
        let row = nodes[x];
        for (let y = 0; y < row.length; y++) {
            rowDebug.push(row[y].weight);
        }
        graphString.push(rowDebug.join(" "));
    }
    return graphString.join("\n");
};

//======================================================================================================================


let BattleAStar = {
    /**
     * Perform an A* Search on a graph given a start and end node.
     * @param {BattleGraph} graph
     * @param {BattleGridNode} start
     * @param {BattleGridNode} end
     */
    search: function (graph, start, end) {
        graph.cleanDirty();
        let heuristic = BattleAStar.heuristics.manhattan;
        let openHeap = getHeap();
        let closestNode = start; // set the start node to be the closest if required

        start.h = BattleAStar.heuristics.manhattan(start, end);
        start.g = 0;
        graph.markDirty(start);

        openHeap.push(start);

        while (openHeap.size() > 0) {
            // cc.log("openHeap.size() = " + openHeap.size());

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            let currentNode = openHeap.pop();
            cc.log("currentNode =  x " + currentNode.x + " y " + currentNode.y + " f " + currentNode.f + " g " + currentNode.g + " h " + currentNode.h);

            // End case -- result has been found, return the traced path.
            // if (this.isEndCase(currentNode, end)) {
            //
            //     return pathTo(currentNode);
            // }

            let neighborList = graph.neighbors(currentNode);

            for (let i = 0; i < neighborList.length; i++) {

                let neighbor = neighborList[i];
                let neighborId = BattleManager.getInstance().getTroopMap()[neighbor.x][neighbor.y];
                let endId = BattleManager.getInstance().getTroopMap()[end.x+1][end.y+1];
                // cc.log("neighborId = " + neighborId + " endId = " + endId)
                if (neighborId === endId) {
                    cc.log("found path")
                    return pathTo(currentNode);
                }
            }
            // cc.log("neighborList.length = " + neighborList.length)

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node.
            let neighbors = graph.neighbors(currentNode);

            for (let i = 0, il = neighbors.length; i < il; ++i) {
                let neighbor = neighbors[i];

                if (neighbor.closed || neighbor.canNotWalk()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                let gScore = currentNode.g + neighbor.getCost(currentNode);
                let beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = BattleAStar.heuristics.manhattan(neighbor, end);
                    neighbor.g = gScore;
                    cc.log("neighbor = " + neighbor.x + " " + neighbor.y + " " + neighbor.f + " " + neighbor.g + " " + neighbor.h)
                    neighbor.f = neighbor.g + neighbor.h;
                    graph.markDirty(neighbor);

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    } else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }
        cc.log("not found path")
        // No result was found - empty array signifies failure to find path.
        return [];
    },
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    heuristics: {
        manhattan: function (pos0, pos1) {
            let d1 = Math.abs(pos1.x - pos0.x);
            let d2 = Math.abs(pos1.y - pos0.y);
            return d1 + d2;
        },
        // diagonal: function (pos0, pos1) {
        //     let D = 1;
        //     let D2 = Math.sqrt(2);
        //     let d1 = Math.abs(pos1.x - pos0.x);
        //     let d2 = Math.abs(pos1.y - pos0.y);
        //     return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
        // }
    },
    cleanNode: function (node) {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
    },

    //if currentNode neighbor grid value == end grid value return true. else return false
    isEndCase: function (currentNode, endNode) {

    }
};

