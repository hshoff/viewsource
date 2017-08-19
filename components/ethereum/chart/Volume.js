import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

export default function Volume({ top, scale, xScale, height, data }) {
  return (
    <Group top={top}>
      <Bar
        data={data}
        width={xScale.bandwidth()}
        height={height - scale(data.volume)}
        x={xScale(data.closeTime)}
        y={scale(data.volume)}
        fill={data.hollow ? 'transparent' : 'white'}
        stroke={data.hollow ? 'white' : 'transparent'}
        fillOpacity={0.7}
        strokeOpacity={0.7}
      />
    </Group>
  );
}
