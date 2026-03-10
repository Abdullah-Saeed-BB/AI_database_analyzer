// components/chat/DataBlock.tsx
import React, { useState } from 'react';
import { Table as TableIcon, BarChart3 } from 'lucide-react';

interface DataBlockProps {
  data: any[];
}

export const DataBlock = ({ data }: DataBlockProps) => {
  const [view, setView] = useState<'table' | 'chart'>('table');

  return (
    <div className="mt-4 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Toggle Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50/50 border-b border-gray-100">
        <span className="text-xs font-semibold text-[#5A5E63] uppercase px-2">Data Insights</span>
        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'table' ? 'bg-white text-[#2772CE] shadow-sm' : 'text-[#5A5E63] hover:text-[#1F2324]'
            }`}
          >
            <TableIcon size={14} /> Table
          </button>
          <button
            onClick={() => setView('chart')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'chart' ? 'bg-white text-[#2772CE] shadow-sm' : 'text-[#5A5E63] hover:text-[#1F2324]'
            }`}
          >
            <BarChart3 size={14} /> Chart
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-x-auto">
        {view === 'table' ? (
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 font-semibold text-[#1F2324]">Month</th>
                <th className="py-2 font-semibold text-[#1F2324]">Revenue</th>
                <th className="py-2 font-semibold text-[#1F2324]">Growth</th>
              </tr>
            </thead>
            <tbody className="text-[#5A5E63]">
              {data.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-2">{row.month}</td>
                  <td className="py-2">${row.revenue}</td>
                  <td className="py-2 text-green-600">{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-[#5A5E63] italic text-sm text-center">
              [Chart Visualization Placeholder]<br/>
              (We will integrate Recharts here in the next step)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};