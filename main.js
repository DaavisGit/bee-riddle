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
        hexes_filled++;
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
}

function updateCounts() {
    if (bees_placed > 0) {
        $('#bee_counter').show();
    }
    $('#bees_placed').html(bees_placed);
    $('#bees_total').html(bees_total);
    if(hexes_filled >= bees_total) {
        let bees_for_hive_needed = bees_placed+1;//+1 to place queen
        let possible_hives = Math.floor(bees_total / bees_for_hive_needed);
        $('#results').html(possible_hives+' hives can be created with this approach');
        finished = true; 
    }
}

function placeBee(hex) {
    if(finished) {
        alert('Already finished');
        return;
    }
    hex.occupy();
    moveAndFill();
    bees_placed++;
    updateCounts();
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
            }
        });
    })

    if(added > 0) {
        moveAndFill();
    }
}

function showNeighbours(hex) {
    if(!finished){
        let neighbours = hex.neighbours(false);
        neighbours.forEach(neighbour => {
            if(!neighbour.occupied){
                neighbour.phantomOccupy();
            }
        })
    }
}

function clearPhantoms() {
    $(".hexagon.phantom-occupied").removeClass("phantom-occupied");
}

$( document ).ready(function() {
    generateHexfield(global_edgesize);
    updateCounts();
});