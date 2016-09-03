import {Ops, Save} from 'parse-lite';

const itemReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_ITEM':
      return Ops.set(state, {
        id: action.id,
        text: action.text,
        createdAt: new Date(),
      });
    case 'EDIT_ITEM':
      return Ops.set(state, {text: action.text});
  }
  return state;
};

const todoReducer = (state = {}, action) => {
  const items = state.items || [];
  switch (action.type) {
    case 'FETCH_ITEMS':
      return {
        ...state,
        loading: true,
        items: [],
      };
    case 'FINISH_FETCH_ITEMS':
      return {
        ...state,
        loading: false,
        items: action.items,
      };
    case 'CREATE_ITEM':
      return {
        ...state,
        creating: true,
      };
    case 'FINISH_CREATE_ITEM':
      return {
        ...state,
        creating: false,
        items: items.concat([action.item]),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: items.filter(item => item.objectId !== action.id),
      };
    case 'EDIT_ITEM':
      return {
        ...state,
        items: items.map(
          item => item.objectId === action.id ? itemReducer(item, action) : item
        ),
      };
  }
  return state;
};

const debugReducer = function(state, action) {
  console.log('Action:', action);
  console.log('Current State:', state);
  const next = todoReducer(state, action);
  console.log('New State:', next);
  return next;
}

export default debugReducer;
