class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(element, priority) {
        this.queue.push({ element, priority });
        this.sort();
    }

    dequeue() {
        if (!this.isEmpty()) {
            return this.queue.shift().element;
        }
        return null;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    sort() {
        this.queue.sort((a, b) => a.priority - b.priority);
    }
}

function shortestPath(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
    const distances = Array(rows)
        .fill()
        .map(() => Array(cols).fill(Infinity));
    distances[start[0]][start[1]] = 0;

    const cameFrom = {}; // Để lưu đường đi

    const priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(start, 0);

    const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ];

    while (!priorityQueue.isEmpty()) {
        const current = priorityQueue.dequeue();

        if (current[0] === end[0] && current[1] === end[1]) {
            // Tìm thấy đường đi, bắt đầu lưu đường đi
            const path = [];
            let currentNode = end;
            while (currentNode.toString() !== start.toString()) {
                path.unshift(currentNode);
                currentNode = cameFrom[currentNode.toString()];
            }
            path.unshift(start);

            return path;
        }

        for (const direction of directions) {
            const newRow = current[0] + direction[0];
            const newCol = current[1] + direction[1];

            if (
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                grid[newRow][newCol] === 0
            ) {
                const distance = distances[current[0]][current[1]] + 1;

                if (distance < distances[newRow][newCol]) {
                    distances[newRow][newCol] = distance;
                    priorityQueue.enqueue([newRow, newCol], distance);
                    cameFrom[[newRow, newCol].toString()] = current; // Lưu bước đi
                }
            }
        }
    }

    return []; // Không tìm thấy đường đi
}