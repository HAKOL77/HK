import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, headerAction }) => {
  return (
    <div className={`bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl overflow-hidden flex flex-col ${className}`}>
      {(title || headerAction) && (
        <div className="px-4 py-3 border-b border-gray-600 flex justify-between items-center bg-gray-800/30">
          {title && <h3 className="text-sm font-medium text-gray-200">{title}</h3>}
          {headerAction}
        </div>
      )}
      <div className="p-4 flex-1 relative">
        {children}
      </div>
    </div>
  );
};