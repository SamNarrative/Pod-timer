import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Info from './Info';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

const path = window.location.href.substring(
  window.location.href.lastIndexOf('/') + 1
);

if (path === 'main') {
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  reportWebVitals();
}

if (path === 'info') {
  root.render(
    <Provider store={store}>
      <Info />
    </Provider>
  );
  reportWebVitals();
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
