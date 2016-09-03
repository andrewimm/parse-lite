import App from './components/App.react';
import {Provider} from 'react-redux';
import React from 'react';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {render} from 'react-dom';
import budgetReducer from './redux/budgetReducer';

const store = createStore(
  budgetReducer,
  applyMiddleware(thunk),
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('mount')
);
