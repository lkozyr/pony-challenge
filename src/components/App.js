import React from 'react';
import './app.css';

import AudioEffects from './AudioEffects';
import ErrorOverlay from './ErrorOverlay';
import GameInfo from './GameInfo';
import GameOverPopup from './GameOverPopup';
import Maze from './Maze';
import NewGamePopup from './NewGamePopup';

import { 
	DEFAULT_WIDTH, 
	DEFAULT_HEIGHT, 
	DEFAULT_PONY_INDEX, 
	DEFAULT_LEVEL,
	keycodeToDirection,
	errorText,
	showHint } from '../helpers';

import { 
	createNewGame, 
	getMazeCurrenState, 
	makeNextMove } from '../ponyChallengeAPI';


class App extends React.Component {

	constructor(){
		super();
		
        this.state = {
			// new game params:
			ponyIndex: DEFAULT_PONY_INDEX,
			size: [ DEFAULT_WIDTH, DEFAULT_HEIGHT ],
			level: DEFAULT_LEVEL,

			// current maze info:
			mazeId: null,
			mazeState: null,
			moveState: { timeStamp: 0 },
			ponySteps: 0,

			// widget visibility status:
			showNewGamePopup: false,
			error: null,
		};

	}

	isError = (responseBody) => {
		this.setState({ error: null });
		if (!responseBody){
			this.setState({
				error: errorText
			});
			return true;
		}
		return false;
	}

	getNewGameParamsFromLocalStorage = () => {
		const paramsJSON = localStorage.getItem('newGameParams');

		if (paramsJSON) {
			const params = JSON.parse(paramsJSON);

			this.setState({ 
				ponyIndex: params.ponyIndex,
				size: [params.width, params.height],
				level: params.level,
			},
			// as a callback initialize a new game based on parameters
			this.startNewGame);
			return;
		}
		this.startNewGame();
	}

	getMazeState = async (mazeId = this.state.mazeId) => {
		const mazeState = await getMazeCurrenState(this.state.mazeId);
		if (this.isError(mazeState)){
			return;
		}
        this.setState({ 
			mazeState,
			ponySteps: 0
		});
	}

	startNewGame = async (
		width = this.state.size[0], 
		height = this.state.size[1], 
		ponyIndex = this.state.ponyIndex, 
		level = this.state.level
	) => {
		const mazeId = await createNewGame(width, height, ponyIndex, level);
		if (this.isError(mazeId)){
			return;
		}
		this.setState({ 
			ponyIndex,
			size: [width, height],
			level,
			mazeId,
			showNewGamePopup: false,
		},
		// as a callback get current mazeState based on mazeId
		this.getMazeState);

		// save selected game params to local storage
		const params = { width, height, ponyIndex, level };
		localStorage.setItem('newGameParams', JSON.stringify(params));
	}

	loadNextLevel = (width, height, ponyIndex, level) => {
		this.startNewGame(width, height, ponyIndex, level);
	}

	showNewGamePopup = () => {
		this.setState({ showNewGamePopup: true });
	}

	hideNewGamePopup = () =>{
		this.setState({ showNewGamePopup: false });
	}

	hideGameOverPopup = () => {
        this.setState({ moveState: { timeStamp: 0 } });
    }

	handlePonyMove = async (e) => {
		// don't apply this event handler when NewGamePopup is visible:
		if (this.state.showNewGamePopup){
			return;
		}
		
		e.preventDefault();

		// ignore everything except arrow keys
		// also ignore everything if game is not in 'active' status
		if (e.keyCode < 37 || e.keyCode > 40 || 
            this.state.mazeState['game-state'].state.toLowerCase() !== "active"){
            return;
		}
		const direction = keycodeToDirection(e.keyCode);

		const response = await makeNextMove(this.state.mazeId, direction);
		if (this.isError(response)){
			return;
		}
		response.timeStamp = Date.now();
		this.setState({ moveState: response });
		
		// valid pony move
        if (response.state === "active" && response["state-result"] === "Move accepted"){
           
            const mazeState = await getMazeCurrenState(this.state.mazeId);
            this.setState({ 
				mazeState,
				ponySteps: this.state.ponySteps + 1 });
        }

        // invalid pony move
        else if (response.state === "active" && response["state-result"] === "Can't walk in there"){
            
            // even if pony move is invalid, it still causes domokun move, so we request
            // current maze state to reflect new domokun position
            const mazeState = await getMazeCurrenState(this.state.mazeId);
            this.setState({ 
				mazeState,
				ponySteps: this.state.ponySteps + 1 });
        }

        // pony won
        else if (response.state === "won" && response["state-result"] === "You won. Game ended"){
            const mazeState = await getMazeCurrenState(this.state.mazeId);
            this.setState({ 
				mazeState,
				ponySteps: this.state.ponySteps + 1 });
        }

        // pony lost
        else if (response.state === "over" && response["state-result"] === "You lost. Killed by monster"){
            const mazeState = await getMazeCurrenState(this.state.mazeId);
            this.setState({ 
				mazeState,
				ponySteps: this.state.ponySteps + 1 });
        }
	}

	showHintRoute = () => {
		showHint(this.state.mazeState);
	}
 
	async componentDidMount(){
		// get new game params from local storage (if any)
		this.getNewGameParamsFromLocalStorage();

		// start listen to keydown events to allow pony move inside a maze
		document.addEventListener('keydown', (e) => this.handlePonyMove(e));
	}

    componentWillUnmount() {
		// stop listen to keydown events
        document.removeEventListener('keydown', (e) => this.handlePonyMove(e));
    }

	render() {
		return (
			<div className="app">
				<header className="app-header">
					<h1>Save The Pony!</h1>
				</header>

				<main>
					<Maze key="mazeComponent"
						mazeState={this.state.mazeState}
						ponyIndex={this.state.ponyIndex}/>
					
					<section className="info-container">
						{ 
							this.state.mazeState
							?
								<GameInfo 
									level={this.state.mazeState.difficulty}
									size={this.state.mazeState.size}
									pony={this.state.mazeState.pony[0]}
									domokun={this.state.mazeState.domokun[0]}
									exit={this.state.mazeState['end-point'][0]}
									steps={this.state.ponySteps}/> 
							: 	<div className="game-info" ></div>
						}

						<div className="buttons">
							<button 
								className={
									this.state.showNewGamePopup 
										? "btn btn-ok hidden"
										: "btn btn-ok"
									}
								onClick={this.showNewGamePopup}>New Game</button>

							<button 
								className="btn btn-ok"
								onClick={this.showHintRoute}>Show Hint</button>

						</div>
					</section>

				</main>

				<footer className="app-footer">
					<a 
						href="https://ponychallenge.trustpilot.com/api-docs/index.html" 
						rel="noopener noreferrer" 
						target="_blank">
						Pony API. 
					</a> 
					<a 
						href="https://ponychallenge.trustpilot.com/index.html" 
						rel="noopener noreferrer" 
						target="_blank">
						Challenge description. 
					</a> 
					<a 
						href="https://github.com/lkozyr/pony-challenge" 
						rel="noopener noreferrer" 
						target="_blank">
						Javascript solution.
					</a> 
				</footer>

				<NewGamePopup 
					startNewGame={this.startNewGame}
					showNewGamePopup={this.state.showNewGamePopup}
					hideNewGamePopup={this.hideNewGamePopup}
					ponyIndex={this.state.ponyIndex}
					size={this.state.size}
					level={this.state.level} />

				{
					this.state.mazeState &&
					<GameOverPopup 
						status={this.state.moveState}
						level={this.state.mazeState.difficulty}
						showNewGamePopup={this.showNewGamePopup}
						hideGameOverPopup={this.hideGameOverPopup}
						loadNextLevel={this.loadNextLevel}/>
				}
				
				<AudioEffects status={this.state.moveState}/>

				<ErrorOverlay error={this.state.error}/>
				
			</div>
		);
	}
}

export default App;
