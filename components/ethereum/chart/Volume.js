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
        fill="white"
        fillOpacity={0.3}
      />
    </Group>
  );
}
