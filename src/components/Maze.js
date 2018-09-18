/* Maze component: renders actual maze, Pony and Monster (Domokun), shows exit cell for Pony;
   Pony and Domokun are renderred on an invisible-maze (absolutely positionned div) 
   so that they can move */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './maze.css';
import Pony from './Pony';
import Domokun from './Domokun';
import { DEFAULT_CELL_SIZE } from '../helpers';

class Maze extends Component {
    constructor(props){
        super(props);

        this.state = {
           
        };
    }

	render() {
        if (!this.props.mazeState){
            return (<div className="maze-wrapper" ></div>);
        }

        const exitCell = this.props.mazeState['end-point'][0];

        const width = this.props.mazeState.size[0];
        const height = this.props.mazeState.size[1];

        const mazeStyle = {
            gridTemplateColumns: `repeat(${width}, ${DEFAULT_CELL_SIZE}px)`,
            height: `${height * DEFAULT_CELL_SIZE + 2}px`,
            width: `${width * DEFAULT_CELL_SIZE + 2}px`
        };

        const invisibleMazeStyle = {
            height: `${height * DEFAULT_CELL_SIZE + 2}px`,
            width: `${width * DEFAULT_CELL_SIZE + 2}px`
        };

		return (
            
            <div className="maze-wrapper" >
                <div className="maze" style={mazeStyle}>
                { 
                    /* adding grid cells according to maze data provided by server; 
                       every cell has a list of css classes to reflect borders and exit cell */
                    this.props.mazeState.data.map((cell, i) => 
                    <div 
                        className={`maze-cell  ${cell.join(' ')} ${i === exitCell ? 'exit' : ''}` }
                        key={`maze-cell-${i}`}>
                        </div>
                    )
                }
                    
                </div>

                <div className="invisible-maze" style={invisibleMazeStyle}>
                    <Pony 
                        position={this.props.mazeState.pony[0]}
                        ponyIndex={this.props.ponyIndex} 
                        mazeWidth={this.props.mazeState.size[0]} />
                    <Domokun 
                        position={this.props.mazeState.domokun[0]}
                        mazeWidth={this.props.mazeState.size[0]} />
                </div>
                    
            </div>
		);
	}
}

Maze.propTypes = {
    mazeState: PropTypes.object,
    ponyIndex: PropTypes.number,
};

export default Maze;
