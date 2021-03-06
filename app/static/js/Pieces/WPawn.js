class WPawn extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/89712845-7bc84900-d961-11ea-9d0d-78c54efc07e5.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.pawnMoves();
        this.doubleMove = this.y === 1 && flip || this.y === 6 && !flip;
    }

    toString = () => {
        return 'P';
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
                    if (move[0]) {
                        if (noCheck || (('' + moveX + moveY === enPassant() || target && this.isWhite() !== target.isWhite()) && !check(this, [moveX, moveY]))) {
                            attackingSquares.push('' + moveX + moveY);
                            if (!noCheck) this.addMove(circle);
                        }
                    } else if (target) {
                        break;
                    } else if ((Math.abs(move[1]) === 1 || this.doubleMove) && (noCheck || !check(this, [moveX, moveY]))) {
                        if (!noCheck) {
                            if (state[0]) pawnMoves = true;
                            this.addMove(circle);
                        }
                    }
                }
            }
        }
        return attackingSquares;
    }

    place = (ogX, ogY) => {
        let enPassantTarget = enPassant();
        state[2] = '-';
        if ('' + this.x + this.y === enPassantTarget) {
            boardState[(this.y + 1) * 8 + this.x] = 0;
            $(`image[x=${this.x * 100}][y=${(this.y + 1) * 100}]`).remove();
        } else if (this.y === 0) {
            notPromoting = false;
            promotedPawn = this.node;
            promoteModal.style.display = 'inline';
        } else if (ogY - this.y === 2) {
            if (flip) {
                state[2] = '' + (7 - this.x) + (6 - this.y);
            } else {
                state[2] = '' + this.x + (this.y + 1);
            }
        }
        this.doubleMove = false;
    }
}