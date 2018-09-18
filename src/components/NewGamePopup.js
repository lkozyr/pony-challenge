/* NewGamePopup component: popup form that allows user select parameters for the new game,
   such as level (difficulty), maze size, pony name */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './new-game-popup.css';

import { ponies, TOTAL_GAME_LEVELS } from '../helpers';

class NewGamePopup extends Component {
    constructor(props){
        super(props);

        this.dimension0 = React.createRef();
        this.dimension1 = React.createRef();

        this.state = {
            selectedPonyIndex: props.ponyIndex,
            dimensions: props.size,
            difficulty: props.level,
        };
    }


    handlePonyChange = (e) => {
        const index = e.target.id.replace('pony_', '');
        this.setState({ selectedPonyIndex: parseInt(index, 10)});
    }
    
    handleDimensionsChange = () => {
        const width =  parseInt(this.dimension0.current.value, 10);
        const height = parseInt(this.dimension1.current.value, 10);

        this.setState({ dimensions: [width, height] });
    }

    handleDifficultyChange = (e) => {
        this.setState({ difficulty: e.target.selectedIndex + 1});
    }

    handleStart = () => {
        const width =  this.state.dimensions[0];
        const height = this.state.dimensions[1];

        if (!(width >= 15 && width <=25 && height >= 15 && height <=25)){
           return; 
        }

        this.props.startNewGame(
            width, 
            height,
            this.state.selectedPonyIndex,
            this.state.difficulty);
    }

    handleCancel = () => {
        this.props.hideNewGamePopup();
    }

    checkInputValidity = (e) => {
        e.target.style.borderColor = "rgb(155, 175, 195)";
        if (!e.target.checkValidity()){
            e.target.style.borderColor = "red";
        }
    }

    componentDidUpdate(prevProps){
        if (this.props.ponyIndex === prevProps.ponyIndex && 
            this.props.size === prevProps.size &&
            this.props.level === prevProps.level){
            return;
        }

        this.setState({
            selectedPonyIndex: this.props.ponyIndex,
            dimensions: this.props.size,
            difficulty: this.props.level,
        });
    }

	render() {
		return (
            <div className={
                this.props.showNewGamePopup
                    ? "new-game"
                    : "new-game hidden"}>

                <h2>New game</h2>
                <div className="container">
                    <label htmlFor="level" >Select difficulty: </label>
                    <select id="level" value={this.state.difficulty} onChange={this.handleDifficultyChange}>
                        {
                            [...Array(TOTAL_GAME_LEVELS)].map((x, i) =>
                                <option key={`option${i}`} value={i+1}>{i+1}</option>
                            )
                        }
                    </select>
                </div>

                <div className="container">
                    <label>Dimensions:</label>
                    <div>
                        <input 
                            type="number"  
                            min="15" 
                            max="25" 
                            step="1"
                            ref={this.dimension0}
                            value={this.state.dimensions[0]}
                            onChange={this.handleDimensionsChange}
                            onBlur={this.checkInputValidity}/> 

                        <span>{'\u00A0'}x{'\u00A0'}</span>

                        <input 
                            type="number"  
                            min="15" 
                            max="25" 
                            step="1"
                            ref={this.dimension1}
                            value={this.state.dimensions[1]}
                            onChange={this.handleDimensionsChange}
                            onBlur={this.checkInputValidity}/>
                    </div>
                </div>
                
                <h4>Select your Pony:</h4>
                <div className="ponies-container">
                    {
                        ponies.map((pony, i) => 
                            <React.Fragment key={'pony' + i}>
                                <input 
                                    type="radio" 
                                    name="ponyName" 
                                    value={pony.name} 
                                    id={'pony_' + i}
                                    checked={i === this.state.selectedPonyIndex}
                                    onChange={this.handlePonyChange} /> 
                                <label htmlFor={'pony_' + i} className="single-pony">
                                    <img className="pony-icon" src={pony.imageURL} alt="pony" />
                                    <span className="pony-name">{pony.name}</span>
                                </label>
                            </React.Fragment>
                        )
                    }
                </div>
                <div className="btn-container">
                    <button className="btn btn-cancel" onClick={this.handleCancel}>Cancel</button>
                    <button className="btn btn-ok" onClick={this.handleStart}>Start New Game</button>
                </div>
		</div>
		);
	}
}

NewGamePopup.propTypes = {
    startNewGame: PropTypes.func,
    showNewGamePopup: PropTypes.bool,
    hideNewGamePopup: PropTypes.func,
    ponyIndex: PropTypes.number,
    size: PropTypes.array,
    level: PropTypes.number,
};

export default NewGamePopup;
