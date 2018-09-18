/* AudioEffects component: component that adds short sounds to complement Pony moves;
   user will hear a short sound that acknowledges successful or unsuccessful (invalid)
   pony move, as well as game win and game loss */

import React from 'react';
import PropTypes from 'prop-types';

import moveSound from '../sounds/move.mp3';
import wrongMoveSound from '../sounds/wrong-move.mp3';
import winSound from '../sounds/win.mp3';
import lostSound from '../sounds/lost.mp3';
   
class AudioEffects extends React.Component {
    constructor(props){
        super(props);

        this.moveAudio = React.createRef();
		this.wrongMoveAudio = React.createRef();
		this.winAudio = React.createRef();
		this.lostAudio = React.createRef();
    }

    async componentDidUpdate(prevProps){
        if (!this.props.status || !prevProps.status || this.props.status.timeStamp === prevProps.status.timeStamp) {
            return;
        }
        if (this.props.status.state === "active" && 
            this.props.status["state-result"] === "Move accepted"){
            this.moveAudio.current.play();
        }
        else if (this.props.status.state === "active" && 
            this.props.status["state-result"] === "Can't walk in there"){
            this.wrongMoveAudio.current.play();
        }
        else if (this.props.status.state === "won" && 
            this.props.status["state-result"] === "You won. Game ended"){
            this.winAudio.current.play();
        }
        else if (this.props.status.state === "over" && 
            this.props.status["state-result"] === "You lost. Killed by monster"){
            this.lostAudio.current.play();
        }
    }

    render() {
        return(
            <div className="audio-effects">
                <audio ref={this.moveAudio} ><source src={moveSound} /></audio>
                <audio ref={this.wrongMoveAudio} ><source src={wrongMoveSound} /></audio>
                <audio ref={this.winAudio} ><source src={winSound} /></audio>
                <audio ref={this.lostAudio} ><source src={lostSound} /></audio>
            </div>
        );
    }
}

AudioEffects.propTypes = {
    status: PropTypes.object,
};

export default AudioEffects;