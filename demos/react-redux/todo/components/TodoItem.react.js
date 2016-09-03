import PrettyDate from './PrettyDate.react';
import React from 'react';

export default class TodoItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editText: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.stopEdit = this.stopEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  render() {
    const {editing, editText} = this.state;
    if (editing) {
      return (
        <div className="todoItem editing">
          <input
            ref={i => this.inputRef = i}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={editText}
          />
          <a className="save" onClick={this.stopEdit}>
            <i className="submitIcon" />
          </a>
        </div>
      );
    }
    const {item} = this.props;
    return (
      <div className="todoItem">
        <div className="itemText">
          {item.text}
          <div className="options">
            <a onClick={this.startEdit}><i className="editIcon" /></a>
            <a onClick={this.deleteItem}><i className="deleteIcon" /></a>
          </div>
        </div>
        <div className="itemDate">
          <PrettyDate value={item.createdAt} />
        </div>
      </div>
    );
  }

  startEdit() {
    this.setState({
      editText: this.props.item.text,
      editing: true,
    }, () => {
      const node = this.inputRef;
      node.focus();
      const len = this.state.editText.length;
      node.setSelectionRange(len, len);
    });
  }

  onChange(e) {
    this.setState({
      editText: e.target.value,
    });
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.stopEdit();
    }
  }

  stopEdit() {
    if (this.state.editText) {
      this.props.update(this.props.item, this.state.editText);
      this.setState({
        editing: false,
      });
    } else {
      this.props.destroy(this.props.item.objectId);
    }
  }

  deleteItem() {
    this.props.destroy(this.props.item.objectId);
  }
}
