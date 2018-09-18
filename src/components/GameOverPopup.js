/* GameOverPopup component: pops up when the game is over, shows user whether they won or lost.
   If user won, popup allows to proceed to the next level with same maze size and pony name,
   if user lost, popup allows to play same level again.
   In any case allows to start a new game with new parameters. */

import React from 'react';
import PropTypes from 'prop-types';

import './game-over-popup.css';

const GameOverPopup = (props) => {

    const newGameHandler = () => {
        props.hideGameOverPopup();
        props.showNewGamePopup();
    }

    const nextLevelHandler = () => {
        props.hideGameOverPopup();

        let level = props.level;

        if (props.level <= 9 && props.status.state === "won"){
            level++;
        }
        props.loadNextLevel(undefined, undefined, undefined, level);
    }

  
    if (!props.status.state) return null;

    if (props.status.state === "won" || props.status.state === "over") {
        return(
            <div className="game-over" >
                <img 
                    src={`https://ponychallenge.trustpilot.com${props.status['hidden-url']}`}
                    alt={props.status["state-result"]} />
                <h4>
                    {props.status["state-result"]}
                </h4>
                <div className="btn-container">
                    <button 
                        className="btn btn-cancel"
                        onClick={props.hideGameOverPopup}>Close</button>

                    <button 
                        className="btn btn-ok"
                        onClick={newGameHandler}>New Game</button>

                    {
                        props.level <= 9 && props.status.state === "won"
                        ?
                            <button 
                                className="btn btn-ok"
                                onClick={nextLevelHandler}>Next Level</button>
                        :   
                            <button 
                                className="btn btn-ok"
                                onClick={nextLevelHandler}>Play Again</button>
                    }
                </div>
            </div>
        );
    }
    return null;
}

GameOverPopup.propTypes = {
    status: PropTypes.object,
    level: PropTypes.number,
    showNewGamePopup: PropTypes.func,
    hideGameOverPopup: PropTypes.func,
    loadNextLevel: PropTypes.func,
};

export default GameOverPopup;