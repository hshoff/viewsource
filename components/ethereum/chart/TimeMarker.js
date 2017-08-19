import { Tooltip } from '@vx/tooltip';

export default function TimeMarker({ top, time, formatTime, xScale }) {
  return (
    <Tooltip
      style={{
        transform: 'translate(-50%)',
        borderRadius: 0,
        boxShadow: '0 1px 10px rgba(0,0,0,0.1)',
        backgroundColor: '#27273f',
        color: 'white',
        fontSize: '11px'
      }}
      top={top}
      left={xScale(time)}
    >
      <div>
        {formatTime(time)}
      </div>
    </Tooltip>
  );
}
