import 'isomorphic-fetch';
import { TopCorner, Banner, Chart } from '../components/ethereum';

class Ethereum extends React.Component {
  static async getInitialProps() {
    const res = await fetch(
      `https://api.cryptowat.ch/markets/gdax/ethusd/ohlc?period=180`
    );
    const json = await res.json();
    return { data: json.result['180'] };
  }

  constructor(props) {
    super(props);
    this.state = { numItems: 180 };
    this.increaseNumItems = this.increaseNumItems.bind(this);
    this.decreaseNumItems = this.decreaseNumItems.bind(this);
  }

  increaseNumItems() {
    if (this.state.numItems === 500) return;
    this.setState(() => ({ numItems: this.state.numItems + 20 }));
  }

  decreaseNumItems() {
    if (this.state.numItems === 40) return;
    this.setState(() => ({ numItems: this.state.numItems - 20 }));
  }

  render() {
    const { data } = this.props;

    const unix = d => new Date(d * 1000);

    const buckets = data
      .map(b => {
        const [
          closeTime,
          openPrice,
          highPrice,
          lowPrice,
          closePrice,
          volume
        ] = b;
        return {
          closeTime: unix(closeTime),
          openPrice,
          highPrice,
          lowPrice,
          closePrice,
          volume,
          hollow: closePrice > openPrice
        };
      })
      .reverse()
      .slice(0, this.state.numItems);

    const sortedBuckets = buckets.sort((a, b) => {
      return a.closeTime - b.closeTime;
    });

    const maxHighPrice = Math.max(
      ...buckets.map(b => Math.max(...[b.highPrice, b.openPrice, b.closePrice]))
    );
    const minLowPrice = Math.min(
      ...buckets.map(b => Math.min(...[b.lowPrice, b.openPrice, b.closePrice]))
    );
    const maxVolume = Math.max(...buckets.map(b => b.volume));

    const start = sortedBuckets[0].closeTime;
    const end = sortedBuckets[sortedBuckets.length - 1].closeTime;

    return (
      <div className="ethereum">
        <div className="container">
          <div className="chart-container">
            <Chart
              data={{
                buckets: sortedBuckets,
                start,
                end,
                maxHighPrice,
                minLowPrice,
                maxVolume
              }}
            />
          </div>
          <TopCorner width={160} height={140} />
          <Banner
            numItems={this.state.numItems}
            increaseNumItems={this.increaseNumItems}
            decreaseNumItems={this.decreaseNumItems}
          />
        </div>
        <div className="desc">
          <div>
            <small>made with vx</small>
          </div>
          <div>
            <a href="https://vx-demo.now.sh/gallery">
              <small>vx-demo.now.sh/gallery</small>
            </a>
          </div>
          <div>
            <a href="https://github.com/hshoff/viewsource">
              <small>github.com/hshoff/viewsource</small>
            </a>
          </div>
        </div>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css?family=Droid+Sans+Mono');

          .ethereum {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            justify-content: center;
            align-items: center;
            background-color: #f6f0f2;
            font-family: 'Droid Sans Mono', monospace;
          }
          .desc {
            margin-top: 3rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .container {
            height: 75vh;
            width: 90vw;
            background-color: #ecc3c7;
            position: relative;
          }
          .chart-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
          .controls {
          }
        `}</style>
      </div>
    );
  }
}

export default Ethereum;
