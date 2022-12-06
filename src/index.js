import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Info from './Info';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './app/store';
import { initMessageListener } from 'redux-state-sync';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider, styled } from 'baseui';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistStore, persistReducer } from 'redux-persist';

const engine = new Styletron();
const root = ReactDOM.createRoot(document.getElementById('root'));
initMessageListener(store);
let persistor = persistStore(store);
const path = window.location.href.substring(
  window.location.href.lastIndexOf('/') + 1
);

if (path === 'main') {
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StyletronProvider value={engine}>
          <BaseProvider theme={LightTheme}>
            <App />
          </BaseProvider>
        </StyletronProvider>
      </PersistGate>
    </Provider>
  );
  reportWebVitals();
}

if (path === 'info') {
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StyletronProvider value={engine}>
          <BaseProvider theme={LightTheme}>
            <Info />
          </BaseProvider>
        </StyletronProvider>
      </PersistGate>
    </Provider>
  );
  reportWebVitals();
}