import Chart from './chart';
import formatPrice from '../utils/formatPrice';

export default function BitcoinPrice({ data = {}, width, height }) {
  if (!data.bpi) return <div>loading...</div>;

  const prices = Object.keys(data.bpi).map(k => ({
    time: k,
    price: data.bpi[k]
  }));

  const currentPrice = prices[prices.length - 1].price;
  const firstPrice = prices[0].price;
  const diffPrice = currentPrice - firstPrice;
  const hasIncreased = diffPrice > 0;

  return (
    <div className="bitcoin">
      <div className="title">
        <div>
          Bitcoin Price<br />
          <small>last 30 days</small>
        </div>
        <div className="spacer" />
        <div className="stats">
          <div className="current">
            {formatPrice(currentPrice)}
          </div>
          <div className={hasIncreased ? 'diffIncrease' : 'diffDecrease'}>
            {hasIncreased ? '+' : '-'}
            {formatPrice(diffPrice)}
          </div>
        </div>
      </div>
      <div className="chart">
        <Chart
          data={prices}
          parentWidth={width * 0.6}
          parentHeight={height * 0.45}
          margin={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 45
          }}
        />
      </div>
      <style jsx>{`
        .bitcoin {
          color: white;
          background-color: #27273f;
          border-radius: 6px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
        }
        .duration {
          font-weight: 100 !important;
          font-size: 14px;
          padding-bottom: 1px;
          border-bottom: 2px solid #6086d6;
        }
        .title,
        .stats {
          padding: 15px 15px 0;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .title small {
          color: #6086d6;
        }
        .stats {
          padding: 0px;
          justify-content: flex-end;
          align-items: flex-end;
          flex-direction: column;
        }
        .current {
          font-size: 24px;
        }
        .diffIncrease,
        .diffDecrease {
          font-size: 12px;
          margin-left: .5rem;
        }
        .diffIncrease {
          color: #00f1a1;
        }
        .spacer {
          display: flex;
          flex: 1;
        }
        .chart {
          display: flex;
          flex: 1;
        }
      `}</style>
    </div>
  );
}
