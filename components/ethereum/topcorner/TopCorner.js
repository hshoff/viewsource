export default function Banner({ width, height }) {
  return (
    <div className="topcorner">
      <svg height={height} width={width}>
        <path fill="#f6f0f2" d={`M0,0L${width},0L0,${height}L0,0`} />
        <path
          fill="white"
          d={`M0,0L${width},0L0,${height}L0,0`}
          transform="scale(.95)"
        />
        <path
          fill="transparent"
          stroke="#ff6a88"
          strokeWidth={1}
          d={`M5,5L${width - 20},5L5,${height - 20}L5,5`}
        />
        <text
          fontFamily="Droid Sans Mono"
          fill="#ff6a88"
          fontSize={14}
          transform="translate(40,60)rotate(-40)"
        >
          ETH
        </text>
      </svg>
      <style jsx>{`
        .topcorner {
          position: absolute;
          top: 0;
          left: 0;
        }
      `}</style>
    </div>
  );
}
