
import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Clock } from 'lucide-react';

interface TimerWidgetProps {
  totalSeconds: number;
  onTick: () => void;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ totalSeconds, onTick }) => {
  const [isRunning, setIsRunning] = useState(false);
  // Goal: 2 hours (7200 seconds)
  const goalSeconds = 7200; 

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        onTick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, onTick]);

  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = Math.min((totalSeconds / goalSeconds) * 100, 100);

  return (
    <Card className="h-full justify-center">
      <div className="flex flex-col gap-6">
        {/* Timer Section */}
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                 <span className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <Clock size={16} />
                    총 공부한 시간
                 </span>
                 <span className="text-3xl font-bold font-mono text-white tracking-wider">
                     {formatTime(totalSeconds)}
                 </span>
            </div>
            
            <Button 
                onClick={() => setIsRunning(!isRunning)} 
                variant={isRunning ? 'danger' : 'primary'}
                size="md"
            >
                {isRunning ? '중지' : '시작'}
            </Button>
        </div>

        {/* Goal Section */}
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-300">목표 시간</span>
                <span className="text-blue-400 font-mono">{Math.floor(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-600 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-500 relative transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" 
                         style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}} 
                    />
                </div>
            </div>
        </div>
      </div>
    </Card>
  );
};
