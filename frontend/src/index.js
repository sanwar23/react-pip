import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './redux-saga/reducers';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './redux-saga/saga/saga';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';

import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer(history),
  compose(
    applyMiddleware(sagaMiddleware, routerMiddleware(history)),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
