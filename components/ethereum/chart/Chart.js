import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { localPoint } from '@vx/event';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { LinearGradient } from '@vx/gradient';
import { withParentSize } from '@vx/responsive';
import { GridRows, GridColumns } from '@vx/grid';
import { AxisLeft, AxisBottom, AxisRight } from '@vx/axis';
import { scaleTime, scaleLinear, scaleBand } from '@vx/scale';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import Volume from './Volume';
import Details from './Details';
import TimeMarker from './TimeMarker';
import HoverMarkers from './HoverMarkers';

const formatPrice = format('$,.2f');
const formatNumber = format(',.0f');
const formatTime = timeFormat('%I:%M%p');

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeBucket: undefined,
      yPoint: undefined
    };
  }
  render() {
    const { parentWidth, parentHeight, data } = this.props;
    const {
      buckets,
      start,
      end,
      maxHighPrice,
      minLowPrice,
      maxVolume,
      showTooltip,
      hideTooltip,
      tooltipLeft,
      tooltipTop,
      tooltipData
    } = data;

    const { activeBucket, yPoint } = this.state;

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
      <div>
        <svg width={width} height={height} ref={s => (this.svg = s)}>
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
          <Group top={height - margin.bottom - volumeHeight}>
            <AxisRight
              scale={yVolumeScale}
              hideZero
              hideTicks
              hideAxisLine
              tickLength={0}
              tickValues={yVolumeScale.ticks(5)}
              tickLabelComponent={
                <text dx="0.33em" fill="white" fontSize={8} fillOpacity={0.8} />
              }
            />
          </Group>
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
          {activeBucket &&
            <HoverMarkers
              xScale={xScale}
              yScale={yScale}
              height={height}
              width={width}
              margin={margin}
              time={activeBucket.closeTime}
              yPoint={yPoint}
              formatPrice={formatPrice}
            />}
          <Bar
            data={data}
            width={width}
            height={height - margin.bottom}
            fill="transparent"
            onMouseMove={data => event => {
              const { x: xPoint, y: yPoint } = localPoint(this.svg, event);
              const bandWidth = xScale.step();
              const index = Math.floor(xPoint / bandWidth);
              const val = buckets[index];
              const left = xScale(val.closeTime);
              this.setState({
                activeBucket: val,
                yPoint
              });
            }}
            onMouseLeave={data => event =>
              this.setState({ activeBucket: undefined, yPoint: undefined })}
          />
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
        </svg>
        {activeBucket &&
          <div>
            <TimeMarker
              top={height - margin.bottom + 3}
              xScale={xScale}
              formatTime={formatTime}
              time={activeBucket.closeTime}
            />
            <Details
              yScale={yScale}
              xScale={xScale}
              formatPrice={formatPrice}
              formatNumber={formatNumber}
              bucket={activeBucket}
            />
          </div>}
      </div>
    );
  }
}

export default withParentSize(withTooltip(Chart));
