import App from './components/App.react';
import {Provider} from 'react-redux';
import React from 'react';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {render} from 'react-dom';
import todoReducer from './redux/todoReducer';

const store = createStore(
  todoReducer,
  applyMiddleware(thunk),
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('mount')
);
