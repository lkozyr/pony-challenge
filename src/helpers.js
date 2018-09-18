
import TwilightSparkle from './img/TwilightSparkle.png';
import RainbowDash from './img/RainbowDash.png';
import PinkiePie from './img/PinkiePie.png';
import Rarity from './img/Rarity.png';
import Applejack from './img/Applejack.png';
import Fluttershy from './img/Fluttershy.png';
import Spike from './img/Spike.png';

export const createNewGameURL = 'https://ponychallenge.trustpilot.com/pony-challenge/maze';
export const getMazeStateURL =  'https://ponychallenge.trustpilot.com/pony-challenge/maze/';
export const makeNextMoveURL =  'https://ponychallenge.trustpilot.com/pony-challenge/maze/';

export const ponies = [
    { name: "Twilight Sparkle", imageURL: TwilightSparkle },
    { name: "Rainbow Dash", imageURL: RainbowDash },
    { name: "Pinkie Pie", imageURL: PinkiePie },
    { name: "Rarity", imageURL: Rarity },
    { name: "Applejack", imageURL: Applejack },
    { name: "Fluttershy", imageURL: Fluttershy },
    { name: "Spike", imageURL: Spike },
];

export const TOTAL_GAME_LEVELS =    10;
export const DEFAULT_PONY_INDEX =   0;
export const DEFAULT_WIDTH =        20;
export const DEFAULT_HEIGHT =       20;
export const DEFAULT_LEVEL =        1;
export const DEFAULT_CELL_SIZE =    25;  // 25px

export const ponySpeech = 'I am little Pony, help me avoid Domokun!';
export const domokunSpeech = 'I am angry Domokun! Give me that Pony!';
export const errorText = 'Something went wrong. Pony is crying. Please try again later.';

export const keycodeToDirection = (keycode) => {
    let direction = null;
    switch (keycode){

        // left arrow
        case 37: 
            direction = "west"; 
            break; 

        // up arrow
        case 38: 
            direction = "north"; 
            break; 

        // right arrow
        case 39: 
            direction = "east"; 
            break; 

        // down arrow
        case 40: 
            direction = "south"; 
            break; 

        default: break;
    }
    return direction;
}


// showHint algorithm is used to calculate the shortest route for Pony to reach the exit cell 
// based on Pony position and exit cell position;
// domokun position is not used to calculate the route
// created using the loop instead of recursion; 
// recursion caused 'Maximum call stack exceeded' error and took too long to calculate the route
export const showHint = (mazeObject) => {

    if (!mazeObject) return;
    
    // create a deep copy of mazeObject to be able to modify it safely
    const mazeData = JSON.parse(JSON.stringify(mazeObject));  
    const cells = mazeData.data;

    const width =       mazeData.size[0];
    const height =      mazeData.size[1];

    const ponyStart =   mazeData.pony[0]; 
    const endpoint =    mazeData['end-point'][0]; 

    let prev = -1;          // previous cell
    let curr = ponyStart;   // current cell

    const steps = [];       // path to endpoint, contains all analyzed cells (including dead ends)
    const route = [];      // shortest path to endpoint

    const iterationsLimit = 1250; // maximum allowed amount of iterations ( 25 * 25 * 2 = 1250), allows to walk through every cell twice
    let iterations = 0;


    // defines whether the given cell has specific border
    const hasWall = (x, border) => {
        return mazeData.data[x].includes(border);
    }

    // find where Pony can go from the current cell
    const findPossibleDirections = (x) => {
        const directions = [];

        if (!hasWall(x, 'west') && (x - 1 >= 0) && 
            (cells[x-1].deadEnd !== 'x')){
            directions.push('west');
        } 

        if (!hasWall(x, 'north') && (x - width >= 0) && 
            (cells[x-width].deadEnd !== 'x')) {
            directions.push('north');
        } 

        if ( (x + 1 < width * height) && !hasWall(x + 1, 'west') && 
            (cells[x+1].deadEnd !== 'x') ) {
            directions.push('east');
        }
            
        if ( (x + width < width * height) && !hasWall(x + width, 'north') && 
            (cells[x+width].deadEnd !== 'x' )){
            directions.push('south');
        } 

        return directions;
    }

    // define whether x cell is previous 
    const isPrevious = (x, direction, prev) => {
        let res = false;
        switch (direction){
            case 'west':
                x - 1 === prev
                ? res = true
                : res = false;
                break;
            case 'north': 
                x - width === prev
                ? res = true
                : res = false;
                break;
            case 'east': 
                x + 1 === prev
                ? res = true
                : res = false;
                break;
            case 'south': 
                x + width === prev
                ? res = true
                : res = false;
                break;
            default: break;
        }
        return res;
    }

    // define cellNumber based on direction
    const directionToCellnumber = (current, direction) => {
        let cellNumber;
        switch (direction){
            case 'north': 
                cellNumber = current - width; 
            break;
            case 'west': 
                cellNumber = current - 1; 
            break;
            case 'south': 
                cellNumber = current + width; 
            break;
            case 'east': 
                cellNumber = current + 1; 
            break;
            default: break;
        }
        return cellNumber;
    }

    // mark given cell as a dead end
    const markDeadEnd = (x) => {
        cells[x].deadEnd = 'x';
    }

    while(1){
        iterations++;
        steps.push(curr);

        // push value to route array only if it is not equal to the last item in this array
        if (route[route.length - 1] !== curr){
            route.push(curr);
        }
        
        // if we came back to start cell, reset the previous cell to avoid marking start cell as a dead end
        if (curr === ponyStart){
            prev = -1;
        }
        
        // avoid endless loop (if for some reason route to endpoint not found)
        if (iterations >= iterationsLimit){
            break;
        }

        // stop loop when endpoint reached
        if (curr === endpoint){
            break;
        }

        let directions = findPossibleDirections(curr);

        switch (directions.length){
            case 1: 
                if (curr !== ponyStart){
                    markDeadEnd(curr);   // dead end
                    route.pop();         // remove dead end cell from the route array
                }

                // go to prev
                prev = curr;
                curr = directionToCellnumber(curr, directions[0]);
            break;

            case 2:
                // if none of both possible exits is previous cell
                if (!isPrevious(curr, directions[0], prev) && !isPrevious(curr, directions[1], prev)){

                    // define whether any of the available directions 
                    // have already been walked through in the past
                    // if so - chose the other direction for next move
                    const move1 = directionToCellnumber(curr, directions[0]);
                    const move2 = directionToCellnumber(curr, directions[1]);

                    if (steps.includes(move1) && !steps.includes(move2)){
                        // go to move2
                        prev = curr;
                        curr = move2;
                    }
                    else if (steps.includes(move2) && !steps.includes(move1)){
                        // go to move1
                        prev = curr;
                        curr = move1;
                    }
                    else{
                        // if none of these already taken 
                        // or if both - go to first
                        prev = curr;
                        curr = move1;
                    }
                }
                // if first possible exit is not previous cell
                else if (!isPrevious(curr, directions[0], prev) && isPrevious(curr, directions[1], prev)){
                    // go to '0'
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[0]);
                } 
                // if second possible exit is not previous cell
                else if (!isPrevious(curr, directions[1], prev) && isPrevious(curr, directions[0], prev)){
                    // go to '1'
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[1]);
                } 
            break;

            case 3: 
                // if none of three possible exits is previous cell
                if (!isPrevious(curr, directions[0], prev) && 
                    !isPrevious(curr, directions[1], prev) && 
                    !isPrevious(curr, directions[2], prev)){

                    // define whether any of the available directions 
                    // have already been walked through in the past
                    // if so - chose the other direction for next move
                    const move1 = directionToCellnumber(curr, directions[0]);
                    const move2 = directionToCellnumber(curr, directions[1]);
                    const move3 = directionToCellnumber(curr, directions[2]);

                    if (!steps.includes(move1)){
                        // go to move1
                        prev = curr;
                        curr = move1;
                    }
                    else if(!steps.includes(move2)){
                        // go to move2
                        prev = curr;
                        curr = move2;
                    }
                    else if(!steps.includes(move3)){
                        // go to move3
                        prev = curr;
                        curr = move3;
                    }
                    else{ // default case
                        prev = curr;
                        curr = move1;
                    }

                }
                // if first possible exit is previous cell
                else if (isPrevious(curr, directions[0], prev) && 
                    !isPrevious(curr, directions[1], prev) && !isPrevious(curr, directions[2], prev)){

                    // go to '1'
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[1]);
                } 
                // if second possible exit is previous cell
                else if (isPrevious(curr, directions[1], prev) && 
                    !isPrevious(curr, directions[0], prev) && !isPrevious(curr, directions[2], prev)){

                    // go to '0'
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[0]);
                }  
                // if third possible exit is previous cell
                else if (isPrevious(curr, directions[2], prev) && 
                    !isPrevious(curr, directions[0], prev) && !isPrevious(curr, directions[1], prev)){

                    // go to '1'
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[0]);
                } 
            break;
            case 4: 
                // if none of four possible exits is previous cell
                if (!isPrevious(curr, directions[0], prev) && 
                    !isPrevious(curr, directions[1], prev) && 
                    !isPrevious(curr, directions[2], prev) &&
                    !isPrevious(curr, directions[4], prev)){

                    // go to first
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[0]);
                }
                // if first possible exit is previous cell
                else if (isPrevious(curr, directions[0], prev) && 
                    !isPrevious(curr, directions[1], prev) && 
                    !isPrevious(curr, directions[2], prev) && 
                    !isPrevious(curr, directions[3], prev)){

                    // go to '1'
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[1]);
                } 
                // if second possible exit is previous cell
                else if (isPrevious(curr, directions[1], prev) && 
                    !isPrevious(curr, directions[0], prev) && 
                    !isPrevious(curr, directions[2], prev) && 
                    !isPrevious(curr, directions[3], prev)){

                    // go to '0'
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[0]);
                }  
                // if third possible exit is previous cell
                else if (isPrevious(curr, directions[2], prev) && 
                    !isPrevious(curr, directions[0], prev) && 
                    !isPrevious(curr, directions[1], prev) &&
                    !isPrevious(curr, directions[3], prev)){

                    // go to '0'
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[0]);
                } 
                // if fourth possible exit is previous cell
                else if (isPrevious(curr, directions[3], prev) && 
                    !isPrevious(curr, directions[0], prev) && 
                    !isPrevious(curr, directions[1], prev) &&
                    !isPrevious(curr, directions[2], prev)){

                    // go to '0'
                    prev = curr;
                    curr = directionToCellnumber(curr, directions[0]);
                } 
            break;

            default: 
            break;
        }
    }
    
    // highlight the route cells for 7 seconds 
    const cellsArray = document.querySelectorAll('.maze-cell');
    route.forEach(s => {
        cellsArray[s].classList.add('shortest-route');
    });

    setTimeout(() => {
        route.forEach(s => {
            cellsArray[s].classList.remove('shortest-route');
        });
    }, 7000);
}