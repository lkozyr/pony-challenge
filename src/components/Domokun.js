/* Domokun component: simple component that renders Domokun (monster character) 
   based on it's current position in the maze */

import React from 'react';
import PropTypes from 'prop-types';

import './domokun.css';
import { DEFAULT_CELL_SIZE, domokunSpeech } from '../helpers';

import Monster from '../img/Monster.png';

const Domokun = (props) => {

    const top = 
        `${DEFAULT_CELL_SIZE * 
        (props.position - props.position % props.mazeWidth) / props.mazeWidth}px`;
        
    const left = `${(props.position % props.mazeWidth) * DEFAULT_CELL_SIZE}px`;
    const domokunStyle = { top, left };

    return(
        <div 
            className="domokun" 
            title={domokunSpeech}
            style={domokunStyle}>
            <img 
                src={Monster} 
                alt="Domokun Monster" />
        </div>
    );
}

Domokun.propTypes = {
    position: PropTypes.number,
    mazeWidth: PropTypes.number,
};

export default Domokun;