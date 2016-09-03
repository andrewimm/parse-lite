import React from 'react';

export default class TodoCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.creating && !nextProps.creating) {
      this.setState({
        value: '',
      });
    }
  }

  render() {
    return (
      <div className="todoCreator">
        <input
          disabled={this.props.creating}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        <a onClick={this.submit} className="todoSubmit">Add</a>
      </div>
    );
  }

  onChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.submit();
    }
  }

  submit() {
    if (!this.props.creating) {
      this.props.create(this.state.value);
    }
  }
}
