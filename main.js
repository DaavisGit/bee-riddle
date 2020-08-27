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

    placeBee() {
        this.is_occupied = true;
    }

    needsToFill() {
        let count = 0;
        for(let row in hexfield) {
            for(let col in hexfield) {
                let littleHex = hexfield[row][col];
                if(littleHex && littleHex.is_occupied) {
                    if((this.col === littleHex.col && Math.abs(this.row-littleHex.row)) || (this.row === littleHex.row && Math.abs(this.col-littleHex.col))) {
                        count++;
                        if(count === 2) {
                            return th;
                        }
                    }
                }
            }
        }
        return false;
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
            $li.click(function(){ hex.placeBee(); updateField(hex.id); autoFill();});
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

function autoFill() {
    for(let row in hexfield) {
        for(let col in hexfield) {
            let littleHex = hexfield[row][col];
            if (littleHex && littleHex.needsToFill){
                littleHex.placeBee(); updateField(littleHex.id);
            }
        }
    }
}

function updateField(hex_id) {
    $('#hex_'+hex_id).addClass('occupied');
    console.log(hex_id);
}





$( document ).ready(function() {
    generateHexfield(global_edgesize);
});