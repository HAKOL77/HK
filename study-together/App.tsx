
import React, { useState, useEffect, useRef } from 'react';
import { ChatWidget } from './components/ChatWidget';
import { TimerWidget } from './components/TimerWidget';
import { LineChartWidget, PieChartWidget } from './components/ChartsWidget';
import { MembersWidget } from './components/MembersWidget';
import { BookOpen } from 'lucide-react';
import { Member, ChartDataPoint } from './types';

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Me', studyTime: 0 },
  { id: '2', name: 'Sam', studyTime: 3500 }, // ~58 mins
  { id: '3', name: 'Tom', studyTime: 5200 }, // ~1h 26m
  { id: '4', name: 'Jerry', studyTime: 1800 }, // ~30 mins
  { id: '5', name: 'Sans', studyTime: 7100 }, // ~1h 58m
];

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // To track real time for the chart X-axis
  const startTimeRef = useRef<number>(Date.now());

  // Function to format current time for chart axis
  const getCurrentTimeLabel = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Initialize Chart Data
  useEffect(() => {
    const initialData = [];
    // Generate some fake history for the graph so it's not empty
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMinutes(d.getMinutes() - i * 5);
        initialData.push({
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: 0
        });
    }
    setChartData(initialData);
  }, []);

  // Update "Me" study time
  const handleTick = () => {
    setMembers(prev => prev.map(m => {
      if (m.id === '1') {
        return { ...m, studyTime: m.studyTime + 1 };
      }
      return m;
    }));
  };

  // Simulation: Other members studying randomly + Chart Updates
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Simulate others studying (Randomly add 1 second to others)
      setMembers(prevMembers => prevMembers.map(m => {
        if (m.id !== '1' && Math.random() > 0.3) {
          return { ...m, studyTime: m.studyTime + 1 };
        }
        return m;
      }));

      // 2. Update Line Chart Data periodically (every 5 seconds for demo, usually would be mins)
      // We are creating a smooth looking chart by updating the last point or adding new ones
      setChartData(prevData => {
        const nowLabel = getCurrentTimeLabel();
        const myMember = members.find(m => m.id === '1');
        const myMinutes = myMember ? parseFloat((myMember.studyTime / 60).toFixed(2)) : 0;
        
        const lastPoint = prevData[prevData.length - 1];

        // If the minute has changed, add new point. Otherwise update last point.
        // For this demo, we'll update more frequently to show movement.
        if (lastPoint && lastPoint.time === nowLabel) {
             const newData = [...prevData];
             newData[newData.length - 1] = { time: nowLabel, value: myMinutes };
             return newData;
        } else {
             // Keep only last 10 points to keep chart clean
             const newData = [...prevData, { time: nowLabel, value: myMinutes }];
             if (newData.length > 10) return newData.slice(newData.length - 10);
             return newData;
        }
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [members]); // Dependency on members ensures we get latest 'Me' time

  const myTotalSeconds = members.find(m => m.id === '1')?.studyTime || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-600 rounded-lg">
                <BookOpen size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">study together</h1>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[800px]">
            
            {/* Left Column: Chat (Takes up 4 columns on large screens) */}
            <div className="lg:col-span-4 h-full">
                <ChatWidget />
            </div>

            {/* Right Column: Dashboard (Takes up 8 columns) */}
            <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                
                {/* Row 1: Timer & Progress (Fixed height) */}
                <div className="flex-none h-48">
                    <TimerWidget totalSeconds={myTotalSeconds} onTick={handleTick} />
                </div>

                {/* Row 2: Line Chart (Flexible height) */}
                <div className="flex-1 min-h-[250px]">
                    <LineChartWidget data={chartData} />
                </div>

                {/* Row 3: Pie Chart & Members (Fixed height) */}
                <div className="flex-none h-56 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PieChartWidget members={members} />
                    <MembersWidget members={members} />
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
