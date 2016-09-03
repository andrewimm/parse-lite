import React from 'react';

export default class BarChart extends React.Component {
  constructor() {
    super();

    this.state = {width: 0};
  }

  componentWillReceiveProps(nextProps) {
    let fillPercent = nextProps.value / nextProps.max * 100;
    if (!isFinite(fillPercent)) {
      fillPercent = 100;
    }
    setTimeout(() => {
      this.setState({width: fillPercent});
    }, 0);
  }

  componentDidMount() {
    let fillPercent = this.props.value / this.props.max * 100;
    if (!isFinite(fillPercent)) {
      fillPercent = 100;
    }
    setTimeout(() => {
      this.setState({width: fillPercent});
    }, 0);
  }

  render() {
    const fillPercent = this.props.value / this.props.max * 100;
    return (
      <div className='barChartWrap'>
        <div className='barChartFill' style={{width: this.state.width + '%'}} />
      </div>
    );
  }
}
