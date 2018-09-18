/* GameInfo component: shows game details, such as maze size, level, position of the Pony
   and the Domokun, exit cell position and amount of steps Pony made */

import React from 'react';
import PropTypes from 'prop-types';

import './game-info.css';

const GameInfo = (props) => {

    return(
        <div className="game-info" >
            <div className="label">Level: </div>  <div className="value">{props.level}</div>
            <div className="label">Maze size: </div>  
            <div className="value">{props.size[0]} x {props.size[1]}</div>
            <div className="label">Pony cell: </div>    <div className="value">{props.pony}</div>
            <div className="label">Domokun cell: </div> <div className="value">{props.domokun}</div>
            <div className="label">Exit cell: </div>    <div className="value">{props.exit}</div>
            <div className="label">Pony steps: </div>   <div className="value">{props.steps}</div>
        </div>
    );
}

GameInfo.propTypes = {
    level: PropTypes.number,
    size: PropTypes.array,
    pony: PropTypes.number,
    domokun: PropTypes.number,
    exit: PropTypes.number,
    steps: PropTypes.number,
};

export default GameInfo;