import React from 'react';

var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export default class PrettyDate extends React.Component {
  constructor(props) {
    super(props);

    this.forceUpdate = this.forceUpdate.bind(this);
  }

  componentWillMount() {
    this.interval = null;
  }

  componentDidMount() {
    const delta = (new Date() - this.props.value) / 1000;
    if (delta < 60 * 60) {
      this.setInterval(this.forceUpdate, 10000);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  setInterval() {
    this.interval = setInterval.apply(null, arguments);
  }

  render() {
    const {value} = this.props;
    let text = '';
    const delta = (new Date() - value) / 1000;

    if (delta < 60) {
      text = 'Just now';
    } else if (delta < 60 * 60) {
      const mins = (delta / 60)|0;
      text = mins + (mins === 1 ? ' minute ago' : ' minutes ago');
    } else if (delta < 60 * 60 * 24) {
      const hours = (delta / 60 / 60)|0;
      text = hours + (hours === 1 ? ' hour ago' : ' hours ago');
    } else {
      text = value.getDate() + ' ' + months[value.getMonth()];
    }

    return <span>{text}</span>;
  }
}
