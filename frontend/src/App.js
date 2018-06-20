import React from 'react';

import HomePage from './Client/HomePage';

import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <div style={{height: '100%'}}>
                    <Route exact path="/" component={HomePage} />
                </div>
            </Router>
        )
    }
}