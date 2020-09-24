var hexfield = [];
var bees_placed = 0;
var bees_total = 60;
var hexes_filled = 0;
var finished = false;
var global_edgesize = 5;

class Hex {
    constructor(id, row, col) {
        this.id = id;
        this.row = row;
        this.col = col;
        this.is_occupied = false;

    }

    fillCell() {
        console.log(this.row,this.col);
        if( this.is_occupied) {
            return false;
        } else {
            this.is_occupied = true;
            updateField(this.id);
            this.iterateNeighbouringCells();
        }
    }

    checkNeighbouringCells() {
        let filledNeighboursCount = 0;

        if(this.row <=5) {
            var neigbours = [
                [-1,-1],
                [-1,0],
                [0,1],
                [1,1],
                [1,0],
                [0,-1],
             ];
        } else {
            var neigbours = [
                [-1,0],
                [-1,1],
                [0,1],
                [1,0],
                [1,-1],
                [0,-1],
             ];
        }

        for(let diff of neigbours) {
            if(!hexfield[this.row-diff[0]]) {
                continue;
            }
            let littleHex = hexfield[this.row-diff[0]][this.col-diff[1]];
            if(!littleHex) {
                continue;
            }
            if(littleHex.is_occupied) {
                filledNeighboursCount++;
            }
        }
        if(filledNeighboursCount >= 3) {
            this.fillCell();
        }
    }

    iterateNeighbouringCells() {

        if(this.row <=5) {
            var neigbours = [
                [-1,-1],
                [-1,0],
                [0,1],
                [1,1],
                [1,0],
                [0,-1],
             ];
        } else {
            var neigbours = [
                [-1,0],
                [-1,1],
                [0,1],
                [1,0],
                [1,-1],
                [0,-1],
             ];
        }



        for(let diff of neigbours) {
            if(!hexfield[this.row-diff[0]]) {
                continue;
            }
            let littleHex = hexfield[this.row-diff[0]][this.col-diff[1]];
            if(littleHex && littleHex.is_occupied === false) {
                littleHex.checkNeighbouringCells();
            }
        }

    }
}


function generateHexfield(edgesize) {
    global_edgesize = edgesize;
    var longest_row = (edgesize*2) - 1;
    var cols = edgesize;
    let id = 1;
    for (let row = 0; row < longest_row; row++) {
        var $row = $("<div>", {"class": "line line-"+(cols)});
        for (let col = 0; col < cols; col++) {
            if(!hexfield[row]) { hexfield[row] = [];}
            let hex = new Hex(id, row, col);
            hexfield[row][col] = hex;
            var $li = $("<li>");
            $li.click(function(){ hex.fillCell();});
            $li.mouseover(function(){ });
            $li.mouseleave(function(){ });
            var $hex = $("<div>", {id:"hex_" + hex.id, "class": "hexagon"});
            $li.append($hex);
            $row.append($li);
            id+=1;
        }

        $("#hexfield").append($row);
        if(row < (longest_row / 2) -1 ) {
            cols+=1
        } else {
            cols-=1;
        }
    }
}

function updateField(hex_id) {
    $('#hex_'+hex_id).addClass('occupied');
}





$( document ).ready(function() {
    generateHexfield(global_edgesize);
});