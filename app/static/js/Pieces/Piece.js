class Piece {
    constructor(x, y, flip) {
        if (flip) {
            this.x = 7 - x;
            this.y = 7 - y;
        } else {
            this.x = x;
            this.y = y;
        }
        this.moves = [];
        this.move_icons = [];
    }

    toString = () => {
        return '';
    }

    svgX = () => {
        return this.x * 100;
    }

    svgY = () => {
        return this.y * 100;
    }

    updateNode = () => {
        this.node.setAttribute('x', this.x * 100);
        this.node.setAttribute('y', this.y * 100);
    }

    isWhite = () => {
        return true;
    }

    inBounds = (move) => {
        let newX = this.x + move[0];
        let newY = this.y + move[1];
        return newX > -1 && newX < 8 && newY > -1 && newY < 8;
    }

    addMove = (move) => {
        this.move_icons.push(move);
    }

    showMoves = () => {
        for (let move of this.move_icons) {
            move.setAttribute('visibility', 'visible');
            board.append(move);
        }
    }

    hideMoves = () => {
        for (let move of this.move_icons) {
            move.setAttribute('visibility', 'hidden');
        }
    }

    clearMoves = () => {
        this.move_icons = [];
    }

    pawnMoves = () => {
        let toggle = !this.isWhite() ^ flip? -1:1;
        this.moves.push([[0, -1 * toggle], [0, -2 * toggle]]);
        this.moves.push([[1, -1 * toggle]]);
        this.moves.push([[-1, -1 * toggle]]);
    }

    knightMoves = () => {
        this.moves.push([[1, 2]]);
        this.moves.push([[1, -2]]);
        this.moves.push([[-1, 2]]);
        this.moves.push([[-1, -2]]);
        this.moves.push([[2, 1]]);
        this.moves.push([[2, -1]]);
        this.moves.push([[-2, 1]]);
        this.moves.push([[-2, -1]]);
    }

    parallelMoves = (king=false) => {
        let north = [];
        let south = [];
        let west = [];
        let east = [];
        for (let i = 1; i < (king? 2:8); i++) {
            east.push([i, 0]);
            south.push([0, i]);
            west.push([-i, 0]);
            north.push([0, -i]);
        }
        this.moves.push(north);
        this.moves.push(south);
        this.moves.push(west);
        this.moves.push(east);
    }

    diagonalMoves = (king=false) => {
        let nWest = [];
        let nEast = [];
        let sWest = [];
        let sEast = [];
        for (let i = 1; i < (king? 2:8); i++) {
            sEast.push([i, i]);
            nEast.push([i, -i]);
            sWest.push([-i, i]);
            nWest.push([-i, -i]);
        }
        this.moves.push(nWest);
        this.moves.push(nEast);
        this.moves.push(sWest);
        this.moves.push(sEast);
    }

    castling = () => {
        this.moves.push([[2, 0]]);
        this.moves.push([[-2, 0]]);
    }

    generateMoves = (noCheck) => {
        let attackingSquares = [];
        for (let group of this.moves) {
            for (let move of group) {
                if (this.inBounds(move)) {
                    let moveX = this.x + move[0];
                    let moveY = this.y + move[1];
                    let target = boardState[moveY * 8 + moveX];
                    let circle = $(`circle[id=${moveX}${moveY}]`)[0];
                    if (target && this.isWhite() === target.isWhite()) break;
                    if (noCheck || !check(this, [moveX, moveY])) {
                        attackingSquares.push('' + moveX + moveY);
                        if (!noCheck) this.addMove(circle);
                        if (target) break;
                    }
                }
            }
        }
        return attackingSquares;
    }

    place = (ogX, ogY) => {
        state[2] = '-';
    }
}