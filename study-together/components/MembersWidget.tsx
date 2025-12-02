
import React from 'react';
import { User, Trophy } from 'lucide-react';
import { Card } from './Card';
import { Member } from '../types';

interface MembersWidgetProps {
  members: Member[];
}

export const MembersWidget: React.FC<MembersWidgetProps> = ({ members }) => {
  // Sort by study time to show leaders at top
  const sortedMembers = [...members].sort((a, b) => b.studyTime - a.studyTime);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <Card title="그룹 인원" className="h-full">
      <div className="grid grid-cols-2 gap-3 h-full content-start overflow-y-auto scrollbar-hide">
        {sortedMembers.map((member, index) => (
          <div 
            key={member.id} 
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-colors cursor-pointer group border border-transparent hover:border-gray-600"
          >
            <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-300 transition-colors ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-700'}`}>
                {index === 0 ? <Trophy size={16} /> : <User size={16} />}
                </div>
            </div>
            
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-gray-200 truncate">{member.name}</span>
                <span className="text-xs text-gray-400">{formatTime(member.studyTime)}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
