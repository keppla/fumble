import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/App';

import '../style/main.scss';


const element = document.createElement('div');
document.body.appendChild(element);

ReactDOM.render(React.createElement(App, {}), element);
