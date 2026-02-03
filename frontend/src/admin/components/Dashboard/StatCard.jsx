import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon, change, changeType, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
          {icon}
        </div>
        {change && (
            <div className={`flex items-center text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
                {changeType === 'increase' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {change}
            </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export default StatCard;
