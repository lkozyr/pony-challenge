/* ErrorOverlay component: displays error message if any request to server responded with status !== 200.
   This can happen if server is overloaded or any other server error occurs.
   Once button is clicked, page is reloaded to request a new game. */

import React from 'react';
import PropTypes from 'prop-types';

import SadPony from '../img/SadPony.gif';
import './error-overlay.css';

const ErrorOverlay = (props) => {

    const soSadButtonHandler = () => {
        window.location.reload();
    }

    if (!props.error){
        return null;
    }

    return(
        <div className="error-overlay" >
            <div className="error-content">
                <img 
                    src={SadPony} 
                    alt={props.error} />
                <h2>{props.error}</h2>
                <button className="btn btn-ok" onClick={soSadButtonHandler}>So sad...</button>
            </div>
        </div>
    );
}

ErrorOverlay.propTypes = {
    error: PropTypes.string,
};

export default ErrorOverlay;