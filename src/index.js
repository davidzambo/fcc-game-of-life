import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/css/styles.css';
import './styles/scss/styles.scss';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
