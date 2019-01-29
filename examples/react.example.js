import React, { Component } from 'react';
import { EhEvent } from '../dist';

const eventChangeColor = EhEvent.fromInstance({ color: '' });

class ControlPanel extends Component {

    constructor(props) {
        super(props);

        this.changeToBlue = () => eventChangeColor.fire({ color: 'blue' });
        this.changeToRed = () => eventChangeColor.fire({ color: 'red' });
    }

    render() {
        return (
            <div>
                <button onClick={this.changeToBlue}>Blue</button>
                <button onClick={this.changeToRed}>Red</button>
            </div>
        );
    }
}

class ColorDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = { color: 'yellow' };

        eventChangeColor.register(this.setState);
    }

    render() {
        return (
            <div style={{ backgroundColor: this.state.color }}>

            </div>
        );
    }
}