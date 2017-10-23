import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './css/font-awesome.min.css';
import App from './Components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
