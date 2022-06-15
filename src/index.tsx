import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import { RecoilRoot } from 'recoil';
import '@fortawesome/fontawesome-free/js/all.js';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);
