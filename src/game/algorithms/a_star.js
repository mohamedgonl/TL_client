class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = 0; // Giá trị g
        this.h = 0; // Giá trị h
        this.f = 0; // Giá trị f
        this.parent = null;
    }
}

function a_star(grid, start, end) {
    const openSet = [];
    const closedSet = [];
    openSet.push(start);

    while (openSet.length > 0) {
        let currentNode = openSet[0];
        let currentIndex = 0;

        // Tìm node với giá trị f nhỏ nhất
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < currentNode.f) {
                currentNode = openSet[i];
                currentIndex = i;
            }
        }

        // Di chuyển currentNode từ openSet sang closedSet
        openSet.splice(currentIndex, 1);
        closedSet.push(currentNode);

        // Đã tìm thấy đích
        if (currentNode === end) {
            const path = [];
            let current = currentNode;
            while (current !== null) {
                path.push({ x: current.x, y: current.y });
                current = current.parent;
            }
            return path.reverse();
        }

        const neighbors = [];
        const { x, y } = currentNode;

        // Xác định các ô hàng xóm hợp lệ và thêm chúng vào neighbors
        // (ví dụ: kiểm tra xem ô hàng xóm không nằm ngoài biên và không phải là tường)
        // Đảm bảo bạn triển khai hàm isValidNeighbor để kiểm tra các điều kiện cụ thể của lưới của bạn.

        // Ví dụ:
        // if (isValidNeighbor(x - 1, y, grid)) {
        //   neighbors.push(grid[x - 1][y]);
        // }

        // Duyệt qua các ô hàng xóm
        for (let neighbor of neighbors) {
            if (!closedSet.includes(neighbor)) {
                const tempG = currentNode.g + 1; // 1 là khoảng cách giữa các ô hàng xóm
                let newPath = false;

                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                    newPath = true;
                }

                if (newPath) {
                    neighbor.h = heuristic(neighbor, end); // Hàm heuristic tính giá trị h
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;
                }
            }
        }
    }

    // Không tìm thấy đường đi
    return [];
}

function heuristic(node, end) {
    // Hàm heuristic (ví dụ: khoảng cách Euclidean)
    const dx = Math.abs(node.x - end.x);
    const dy = Math.abs(node.y - end.y);
    return Math.sqrt(dx * dx + dy * dy);
}




