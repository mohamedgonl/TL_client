const CROSS_DISTANCE = 1.41421;
function BattleGridNode(x, y, weight,id) {
    this.x = x;
    this.y = y;
    this.weight = weight;
    this.buildingId = id;
}

BattleGridNode.prototype.toString = function () {
    return "[" + this.x + " " + this.y + "]";
};

BattleGridNode.prototype.getCost = function (fromNeighbor) {
    //get id of
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
        return CROSS_DISTANCE;
    }
    return 1;
};


//======================================================================================================================

function BattleGraph(gridIn, idIn) {
    this.nodes = [];
    this.grid = [];
    for (let x = 0; x < gridIn.length; x++) {
        this.grid[x] = [];

        for (let y = 0, row = gridIn[x]; y < row.length; y++) {
            let node = new BattleGridNode(x, y, row[y],idIn[x][y]);
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

BattleGraph.prototype.changeNodeWeight = function (x, y, weight) {
    this.grid[x][y].weight = weight;
}

BattleGraph.prototype.getNode = function (x, y) {
    return this.grid[x][y];
}

//======================================================================================================================


let BattleAStar = {

    searchSimple: function (graph, start, end) {
        let path = [];
        if(start.x !== end.x) {
            //go to end x
            let x = start.x;
            let y = start.y;
            while (x !== end.x) {
                if (x < end.x) {
                    x++;
                } else {
                    x--;
                }
                path.push(graph.grid[x][y]);
            }
        }
        if(start.y !== end.y) {
            //go to end y
            let x = start.x;
            let y = start.y;
            while (y !== end.y) {
                if (y < end.y) {
                    y++;
                } else {
                    y--;
                }
                path.push(graph.grid[x][y]);
            }
        }
        return path;
    },
    /**
     * Perform an A* Search on a graph given a start and end node.
     * @param {BattleGraph} graph
     * @param {BattleGridNode} start
     * @param {BattleGridNode} end
     */
    search: function (graph, start, end) {
        graph.cleanDirty();
        let heuristic = BattleAStar.heuristics.diagonal;
        let openHeap = getHeap();
        let closestNode = start; // set the start node to be the closest if required


        start.h = heuristic(start, end);
        start.g = 0;
        graph.markDirty(start);

        openHeap.push(start);

        while (openHeap.size() > 0) {
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            let currentNode = openHeap.pop();


            // End case -- result has been found, return the traced path.

            if(currentNode.x === end.x && currentNode.y === end.y){
                return pathTo(currentNode);
            }


            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node.
            let neighbors = graph.neighbors(currentNode);

            for (let i = 0, il = neighbors.length; i < il; ++i) {
                let neighbor = neighbors[i];

                if (neighbor.closed) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                let gScore;
                if (neighbor.buildingId === end.buildingId) {
                    gScore = currentNode.g + neighbor.getCost(currentNode);
                }
                else{
                    gScore = currentNode.g + neighbor.getCost(currentNode) + neighbor.weight;
                }
                let beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.g = gScore;

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
        // cc.log("ERRORR::::not found path")
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
        diagonal: function (pos0, pos1) {
            let D = 1;
            let D2 = Math.sqrt(2);
            let d1 = Math.abs(pos1.x - pos0.x);
            let d2 = Math.abs(pos1.y - pos0.y);
            return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
        }
    },
    cleanNode: function (node) {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
    },

};

