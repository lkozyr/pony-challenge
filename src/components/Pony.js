/* Pony component: simple component that renders Pony character based 
   on it's current position in the maze and pony name user selected (one of 7 available ponies) */

import React from 'react';
import PropTypes from 'prop-types';

import './pony.css';
import { ponies, DEFAULT_CELL_SIZE, ponySpeech } from '../helpers';

const Pony = (props) => {

    const top = 
        `${DEFAULT_CELL_SIZE * 
        (props.position - props.position % props.mazeWidth) / props.mazeWidth}px`;

    const left = `${(props.position % props.mazeWidth) * DEFAULT_CELL_SIZE}px`;
    const ponyStyle = { top, left };

    return(
        <div 
            className="pony" 
            title={ponySpeech}
            style={ponyStyle} >
            <img 
                src={ponies[props.ponyIndex].imageURL} 
                alt={ponies[props.ponyIndex].name} />
        </div>
    );
}

Pony.propTypes = {
    position: PropTypes.number,
    ponyIndex: PropTypes.number,
    mazeWidth: PropTypes.number,
};

export default Pony;