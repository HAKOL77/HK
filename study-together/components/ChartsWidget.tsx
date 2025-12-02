
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card } from './Card';
import { ChartDataPoint, Member } from '../types';

// Color palette for ranking (Rank 1 -> Rank N)
const RANK_COLORS = [
  "#3b82f6", // Blue-500 (1st)
  "#14b8a6", // Teal-500 (2nd)
  "#a855f7", // Purple-500 (3rd)
  "#f59e0b", // Amber-500 (4th)
  "#ec4899", // Pink-500 (5th)
  "#6366f1", // Indigo-500 (6th)
  "#8b5cf6", // Violet-500 (7th)
];

interface LineChartWidgetProps {
  data: ChartDataPoint[];
}

export const LineChartWidget: React.FC<LineChartWidgetProps> = ({ data }) => {
  return (
    <Card title="시간 관리 (분)" className="h-full">
      <div className="w-full h-[180px] md:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af" 
              tick={{fontSize: 12}} 
              interval="preserveStartEnd"
            />
            <YAxis stroke="#9ca3af" tick={{fontSize: 12}} width={30} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => [`${value} min`, '공부 시간']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{r: 3, fill: '#3b82f6'}} 
              activeDot={{ r: 6 }} 
              isAnimationActive={false} // Disable animation for smoother realtime updates
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

interface PieChartWidgetProps {
  members: Member[];
}

export const PieChartWidget: React.FC<PieChartWidgetProps> = ({ members }) => {
  // Sort members by study time (descending) and assign colors
  const sortedData = useMemo(() => {
    return [...members]
      .sort((a, b) => b.studyTime - a.studyTime)
      .map((member, index) => ({
        name: member.name,
        value: member.studyTime,
        color: RANK_COLORS[index % RANK_COLORS.length]
      }));
  }, [members]);

  const formatTooltip = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
  };

  return (
    <Card title="공부 비율 (순위별)" className="h-full flex flex-col items-center justify-center">
      <div className="w-full h-[160px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="rgba(0,0,0,0)" 
                />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#fff', borderRadius: '4px', fontSize: '12px' }}
               itemStyle={{ color: '#fff' }}
               formatter={(value: number) => [formatTooltip(value), '']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Mini Legend for Top 3 */}
      <div className="flex gap-3 text-xs text-gray-400 mt-[-10px]">
        {sortedData.slice(0, 3).map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
