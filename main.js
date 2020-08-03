var hexfield = [];
var global_edgesize = 0;

class Hex {
    constructor(id, row, col) {
        this.id = id;
        this.row = row;
        this.col = col;
        this.occupied = false;
    }

    hasAtleast3OccupiedNeighbours() {
        let occupied_count = 0;
        this.neighbours().forEach(neighbour => {
            if(neighbour.occupied) {
                occupied_count++;
            }
        });

        return occupied_count >= 3;
    }

    neighbours() {
        let neighbours = [];
        hexfield.forEach(row => {
            row.forEach(hex => {
                let xdelta = Math.abs(hex.row - this.row);
                let ydelta = Math.abs(hex.col - this.col);
                let rel_deltas = JSON.stringify([hex.row - this.row, hex.col - this.col]);
                let excluded_deltas = [];
                //ensure skew due to hexagon shape
                if(this.row+1 == global_edgesize) {
                    excluded_deltas = ["[-1,1]","[1,1]"];
                } else if(this.row+1 < global_edgesize) {
                    excluded_deltas = ["[-1,1]","[1,-1]"];
                } else {
                    excluded_deltas = ["[-1,-1]","[1,1]"];
                }
                
                if (
                    excluded_deltas.indexOf(rel_deltas) === -1 && 
                    xdelta <= 1 && ydelta <= 1 && 
                    hex.id != this.id
                ) {
                    neighbours.push(hex);
                }
            });
        })
        return neighbours;
    }

    occupy() {
        this.occupied = true;
        $('#hex_'+this.id).addClass('occupied')
    }

    phantomOccupy() {
        $('#hex_'+this.id).addClass('phantom-occupied')
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
            $li.click(function(){ placeBee(hexfield[row][col]) });
            $li.mouseover(function(){ showNeighbours(hexfield[row][col]) });
            $li.mouseleave(function(){ clearPhantoms() });
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

    console.log(hexfield);
}

function placeBee(hex) {
    hex.occupy();
    moveAndFill();
}

function moveAndFill() {
    let added = 0;
    hexfield.forEach(row => {
        row.forEach(hex => {
            if(!hex.occupied) {
                if(hex.hasAtleast3OccupiedNeighbours()) {
                    hex.occupy();
                    added++;
                }
                // count++;
            }
        });
    })

    if(added > 0) {
        moveAndFill();
    }
    // console.log('There are '+count+' occupied hexes');
}

function showNeighbours(hex) {
    let neighbours = hex.neighbours();
    neighbours.forEach(neighbour => {
        neighbour.phantomOccupy();
    })
}


function clearPhantoms() {
    $(".hexagon.phantom-occupied").removeClass("phantom-occupied");
}





$( document ).ready(function() {
    generateHexfield(5);
});