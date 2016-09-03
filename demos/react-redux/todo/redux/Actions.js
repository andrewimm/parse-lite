import {App, Ops, Query, Save, Destroy} from 'parse-lite';

// INITIALIZE HERE
const app = new App({
  host: '', // The path to your Parse Server
  applicationId: '', // Your Application ID
});

export function fetch() {
  return function(dispatch) {
    dispatch({type: 'FETCH_ITEMS'});
    const q = Query.ascending({}, 'createdAt');
    Query.find(app, 'TodoItem', q).then((items) => {
      dispatch({
        type: 'FINISH_FETCH_ITEMS',
        items: items,
      });
    });
  };
}

export function update(item, text) {
  return function(dispatch) {
    dispatch({
      type: 'EDIT_ITEM',
      id: item.objectId,
      text: text,
    });
    const updated = Ops.set(item, {text});
    Save(app, 'TodoItem', updated);
  };
}

export function destroy(id) {
  return function(dispatch) {
    dispatch({
      type: 'DELETE_ITEM',
      id: id,
    });
    Destroy(app, 'TodoItem', id);
  };
}

export function create(text) {
  return function(dispatch) {
    dispatch({type: 'CREATE_ITEM'});
    Save(app, 'TodoItem', {text}).then((item) => {
      dispatch({
        type: 'FINISH_CREATE_ITEM',
        item: item,
      });
    });
  };
}
