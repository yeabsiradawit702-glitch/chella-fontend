
interface LegendEntry {
  color?: string;
  value?: string | number;
}

interface CustomLegendProps {
  payload?: LegendEntry[];
}

const CustomLegend = ({ payload = [] }: CustomLegendProps) => {
  return (
    <div className="flex flex-wrap justify-center mt-2 space-x-6 gap-2">
      {payload.map((entry, index) => (
        <div
          key={`Legend-${index}`}
          className="flex items-center space-x-2"
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />

          <span className="text-xs text-gray-700 font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
