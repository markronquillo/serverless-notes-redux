import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import config from './config.js';

import './index.css';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
    	<Router>
    		<App />
    	</Router>
    </Provider>, 
	document.getElementById('root'));

	
registerServiceWorker();

