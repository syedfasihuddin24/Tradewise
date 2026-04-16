import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export default function Sparkline({ data, positive = true, width = 80, height = 32 }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const color = positive ? '#00e563' : '#f87171';

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <Tooltip
          content={() => null}
        />
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          filter="url(#glow)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
