import { withParentSize } from '@vx/responsive';
import { Group } from '@vx/group';
import { LinearGradient } from '@vx/gradient';
import { scaleTime, scaleLinear, scaleBand } from '@vx/scale';
import { GridRows, GridColumns } from '@vx/grid';
import { AxisLeft, AxisBottom, AxisRight } from '@vx/axis';
import { Bar } from '@vx/shape';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import Volume from './Volume';

const formatPrice = format('$,.2f');
const formatTime = timeFormat('%I:%M%p');

class Chart extends React.Component {
  render() {
    const { parentWidth, parentHeight, data } = this.props;
    const { buckets, start, end, maxHighPrice, minLowPrice, maxVolume } = data;

    const margin = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 80
    };

    const width = parentWidth;
    const height = parentHeight;

    const xScale = scaleBand({
      range: [0, width - 50],
      domain: buckets.map(b => b.closeTime),
      padding: 0.3
    });
    const timeScale = scaleTime({
      range: [0, width - 50],
      domain: [start, end]
    });
    const yScale = scaleLinear({
      range: [height - margin.bottom, 20],
      domain: [minLowPrice - 3, maxHighPrice]
    });

    const volumeHeight = (height - margin.bottom) * 0.25;
    const yVolumeScale = scaleLinear({
      range: [volumeHeight, 0],
      domain: [0, maxVolume]
    });

    return (
      <svg width={width} height={height}>
        <Group top={margin.top} left={margin.left}>
          <LinearGradient
            id="gradient"
            from="#FF9A8B"
            to="#FF6A88"
            vertical={false}
          />
          <rect width={width} height={height} fill="url(#gradient)" />
          <GridRows
            width={width}
            height={height}
            scale={yScale}
            stroke="rgba(255,255,255,0.2)"
          />
          <GridColumns
            width={width}
            height={height - margin.bottom}
            scale={timeScale}
            stroke="rgba(255,255,255,0.1)"
          />
        </Group>
        {buckets.map(b => {
          return (
            <g key={`b-${b.closeTime}`}>
              <line
                x1={xScale(b.closeTime) + xScale.bandwidth() / 2}
                x2={xScale(b.closeTime) + xScale.bandwidth() / 2}
                y1={yScale(b.highPrice)}
                y2={b.hollow ? yScale(b.closePrice) : yScale(b.lowPrice)}
                stroke="white"
                strokeWidth={1}
              />
              <line
                x1={xScale(b.closeTime) + xScale.bandwidth() / 2}
                x2={xScale(b.closeTime) + xScale.bandwidth() / 2}
                y1={b.hollow ? yScale(b.openPrice) : yScale(b.closePrice)}
                y2={yScale(b.lowPrice)}
                stroke="white"
                strokeWidth={1}
              />
              <Bar
                data={b}
                width={xScale.bandwidth()}
                height={
                  b.hollow
                    ? yScale(b.openPrice) - yScale(b.closePrice)
                    : yScale(b.closePrice) - yScale(b.openPrice)
                }
                fill={b.hollow ? 'transparent' : 'white'}
                stroke={b.hollow ? 'white' : 'transparent'}
                strokeWidth={1}
                x={xScale(b.closeTime)}
                y={b.hollow ? yScale(b.closePrice) : yScale(b.openPrice)}
              />
              <Volume
                top={height - margin.bottom - volumeHeight}
                height={volumeHeight}
                scale={yVolumeScale}
                xScale={xScale}
                data={b}
              />
            </g>
          );
        })}
        <AxisBottom
          top={height - margin.bottom}
          scale={timeScale}
          stroke="rgba(255,255,255,0.5)"
          tickStroke="rgba(255,255,255,0.5)"
          tickFormat={formatTime}
          tickLabelComponent={
            <text
              fill="white"
              fillOpacity={0.5}
              textAnchor="middle"
              fontSize={10}
            />
          }
        />
        <AxisLeft
          left={width}
          scale={yScale}
          hideAxisLine
          hideTicks
          hideZero
          tickFormat={formatPrice}
          tickLength={0}
          tickStroke="white"
          tickLabelComponent={
            <text
              fill="white"
              textAnchor="end"
              dx="-.33em"
              dy="-.33em"
              fontSize={10}
            />
          }
        />
      </svg>
    );
  }
}

export default withParentSize(Chart);
