import { 
    ponies, 
    createNewGameURL,
    getMazeStateURL,
    makeNextMoveURL,
 } from './helpers';


/**
 * 
 * @param {number} width - number of columns in the maze; min: 15, max: 25.
 * @param {number} height - number of rows in the maze; min: 15, max: 25.
 * @param {number} ponyIndex - index of Pony from ponies array; min: 0, max 6.
 * @param {number} level - difficulty of the game; min: 1, max: 10.
 * @returns {string} - maze_id
 */
export const createNewGame = (width, height, ponyIndex, level) => {

    const name = ponies[ponyIndex].name;
    const params = {
        "maze-width": width,
        "maze-height": height,
        "maze-player-name": name,
        "difficulty": level
    };
	
    return fetch(createNewGameURL, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(params),
        })
        .then(response => {
            if (response.status !== 200){
                return null;
            }
            return response.json();
        })
        .then(data => {
            return data.maze_id;

        })
        .catch(err => console.log(err))
}


/**
 * 
 * @param {string} mazeId - mazeId 
 * @returns {object} - mazeState object that contains positions of pony, domokun, exit, and maze tracing data. The 'data' contains an array with width*height entries. Each entry has at most 2 walls, 'west' and 'north'. If you want to find all walkable directions from place X you need to use the array entries X, X+1 and X+width to construct all walls around the place X.
 */
export const getMazeCurrenState = (mazeId = null) => {
    if (!mazeId) return null;

    return fetch(getMazeStateURL + mazeId, {
        headers:{
            'Accept': 'application/json',
        },
        })
        .then(response => {
            if (response.status !== 200){
                return null;
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(err => console.log(err));
}


/**
 * 
 * @param {string} mazeId - mazeId 
 * @param {string} direction - direction of the move, one of: 'north', 'east', 'south', 'west' 
 * @returns {object} - moveState object that contains game 'state' and 'state-result'. Game state could be one of : 'active', 'won', 'over'. State result could be one of: "Move accepted", "Can't walk in there", "You won. Game ended", "You lost. Killed by monster".
 */
export const makeNextMove = (mazeId, direction) => {
    if (!mazeId || !direction) return null;

    const params = {
        direction
    };

    return fetch(makeNextMoveURL + mazeId, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(params),
        })
        .then(response => {
            if (response.status !== 200){
                return null;
            }
            return response.json();
        })
        .then(data => {
            return data;

        })
        .catch(err => console.log(err))
}