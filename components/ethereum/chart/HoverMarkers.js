import { Bar } from '@vx/shape';

export default function HoverMarker({
  yScale,
  xScale,
  height,
  width,
  margin,
  time,
  yPoint,
  formatPrice
}) {
  return (
    <g>
      <Bar
        width={xScale.bandwidth()}
        height={height - margin.bottom}
        fill="white"
        fillOpacity={0.2}
        x={xScale(time)}
      />
      <line
        x1={0}
        x1={width}
        y1={yPoint}
        y2={yPoint}
        stroke="white"
        strokeOpacity={0.6}
      />
      <rect
        width={55}
        height={20}
        fill="#27273f"
        y={yPoint - 11}
        x={width - 55}
      />
      <path
        d={`M${width - 55},${yPoint - 11}L${width - 55},${yPoint -
          11 +
          20},L${width - 55 - 10},${yPoint},${width - 55},${yPoint - 11}`}
        fill="#27273f"
      />
      <text fontSize={11} x={width - 50} y={yPoint} dy="0.3em" fill="white">
        {formatPrice(yScale.invert(yPoint))}
      </text>
    </g>
  );
}
