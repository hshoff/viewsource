import { Group } from '@vx/group';
import { AxisRight } from '@vx/axis';
import { Bar } from '@vx/shape';

export default function Volume({ top, scale, xScale, height, data }) {
  return (
    <Group top={top}>
      <AxisRight
        scale={scale}
        hideZero
        hideTicks
        hideAxisLine
        tickLength={0}
        tickValues={scale.ticks(5)}
        tickLabelComponent={<text dx="0.33em" fill="white" fontSize={8} />}
      />
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
