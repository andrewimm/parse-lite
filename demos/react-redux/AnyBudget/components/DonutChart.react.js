import React from 'react';

const DonutChart = ({segments, width, height}) => {
  if (!segments) {
    segments = [];
  }
  let total = 0;
  for (let i = segments.length; i--;) {
    total += segments[i].total;
  }
  const cx = (width / 2)|0;
  const cy = (height / 2)|0;
  const r = Math.min(cx, cy) * 0.9;

  let lastX = cx + r;
  let lastY = cy;
  let alpha = 0;

  const children = [];

  for (let i = 0; i < segments.length; i++) {
    const arc = segments[i].total / total * 2 * Math.PI;
    let angle = Math.min(arc, Math.PI) + alpha;
    let endX = r * Math.cos(angle) + cx;
    let endY = r * Math.sin(angle) + cy;
    let path = ['M', cx, cy, 'L', lastX, lastY, 'A', r, r, 0, 0, 1, endX, endY];
    if (arc > Math.PI) {
      angle = arc + alpha;
      endX = r * Math.cos(angle) + cx;
      endY = r * Math.sin(angle) + cy;
      path = path.concat(['A', r, r, 0, 0, 1, endX, endY]);
    }
    path.push('Z');
    children.push(
      <path
        key={segments[i].id}
        d={path.join(' ')}
        style={{transformOrigin: cx + 'px ' + cy + 'px'}} />
    );
    children.push(
      <text
        key={segments[i].id + 'T'}
        textAnchor='middle'
        x={cx}
        y={cy * 2 + 20}>
        {segments[i].id}
      </text>
    );

    lastX = endX;
    lastY = endY;
    alpha = angle;
  }

  return (
    <svg
      className='donutChart'
      width={width}
      height={height + 40}>
      {children}
      <circle cx={cx} cy={cy} r={r/2} fill='white' />
    </svg>
  );
};

export default DonutChart;
