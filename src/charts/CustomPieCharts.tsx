
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegned';

interface PieChartItem {
  status: string;
  count: number;
}

interface CustomPieChartProps {
  data?: PieChartItem[];
  colors?: string[];
}

const CustomPieChart = ({
  data = [],
  colors = [],
}: CustomPieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors.length > 0 ? colors[index % colors.length] : '#8884d8'}
            />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
