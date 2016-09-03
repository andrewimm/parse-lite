import React from 'react';
import TodoCreator from './TodoCreator.react';
import TodoItem from './TodoItem.react';

export default class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
  }

  componentWillMount() {
    this.props.fetch();
  }

  refresh() {
    this.props.fetch();
  }

  render() {
    return (
      <div className={this.props.loading ? 'todoList loading' : 'todoList'}>
        <a onClick={this.refresh} className="refresh">Refresh</a>
        {this.props.items.map((i) =>
          <TodoItem
            key={i.objectId}
            item={i}
            update={this.props.update}
            destroy={this.props.destroy}
          />
        )}
        <TodoCreator creating={this.props.creating} create={this.props.create} />
      </div>
    );
  }
}
