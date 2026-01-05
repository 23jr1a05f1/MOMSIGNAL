import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format } from 'date-fns';

interface VitalsChartProps {
  data: any[];
  dataKey: string;
  color: string;
  title: string;
  unit: string;
}

export function VitalsChart({ data, dataKey, color, title, unit }: VitalsChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm h-[350px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
        <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
          Live Trend
        </span>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(ts) => format(new Date(ts), 'HH:mm:ss')}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit={unit}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' 
              }}
              labelFormatter={(ts) => format(new Date(ts), 'HH:mm:ss')}
            />
            <Area
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3}
              fill={`url(#color${dataKey})`}
              animationDuration={500}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
