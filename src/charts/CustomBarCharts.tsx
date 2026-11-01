
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartItem {
  priority: string;
  count: number;
}

interface CustomBarChartProps {
  data?: BarChartItem[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload?: BarChartItem;
  }>;
}

const CustomBarChart = ({ data = [] }: CustomBarChartProps) => {
  const getBarColor = (entry: BarChartItem): string => {
    switch (entry.priority) {
      case 'low':
        return '#00BC7D';
      case 'medium':
        return '#FE9900';
      case 'high':
        return '#FF1557';
      default:
        return '#00BC7D';
    }
  };

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    const item = payload?.[0]?.payload;

    if (active && item) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-600 mb-1">
            {item.priority}
          </p>

          <p className="text-sm text-gray-600">
            Count:{' '}
            <span className="font-medium text-gray-900">
              {item.count}
            </span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="priority"
            tick={{ fontSize: 12, fill: '#555' }}
            stroke="none"
          />

          <YAxis
            dataKey="count"
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#555' }}
            stroke="none"
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'transparent' }}
          />

          <Bar dataKey="count" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
