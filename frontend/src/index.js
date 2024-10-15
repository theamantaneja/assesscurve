import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        {/* Add other routes as needed */}
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);