// components/chat/DataBlock.tsx
"use client";
import { useState } from 'react';
import { Table as TableIcon, BarChart3, Code } from 'lucide-react';
import { metadata } from '@/types/conversation';
import { SmartBarChart, SmartLineChart, SmartScatterChart } from './Charts';

interface DataBlockProps {
  data: { [key: string]: any[] };
  metadata: metadata;
  sql_query: string;
}

function formatSQL(query: string): string {
  // Define the keywords we want to move to a new line
  const keywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "ORDER BY",
    "LIMIT",
    "JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "INNER JOIN",
    "OUTER JOIN",
    "UNION",
    "VALUES",
    "SET"
  ];

  // Create a regex pattern: \b(KEYWORD1|KEYWORD2)\b
  // \b ensures we match whole words only
  const pattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");

  return query
    .replace(/\s+/g, " ")       // Collapse multiple spaces/newlines into one
    .replace(pattern, "\n$1")   // Add newline before the keyword
    .trim();                    // Remove leading/trailing whitespace
}


export const DataBlock = ({ data, metadata, sql_query }: DataBlockProps) => {
  const [view, setView] = useState<'table' | 'chart' | 'sql'>('table');
  const columns = Object.keys(data);
  const rowCount = data[columns[0]].length;

  return (
    <div className="mt-4 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Toggle Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50/50 border-b border-gray-100">
        <span className="text-xs font-semibold text-text-secondary uppercase px-2">Data Insights</span>
        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'table' ? 'bg-white text-text-active shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TableIcon size={14} /> Table
          </button>
          <button
            onClick={() => setView('chart')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'chart' ? 'bg-white text-text-active shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <BarChart3 size={14} /> Chart
          </button>
          <button
            onClick={() => setView('sql')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'sql' ? 'bg-white text-text-active shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Code size={14} /> SQL
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-x-auto">
        {view === 'table' ? (
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                {Object.keys(data).map((key) => (
                  <th key={key} className="pr-6 py-2 font-semibold text-text-primary">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#5A5E63]">
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-50 last:border-0">
                  {columns.map((col) => (
                    <td key={`${col}-${rowIndex}`} className="py-2">
                      {/* Access the specific cell using the column name and row index */}
                      {data[col][rowIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : view === 'chart' ? (
          <div className="flex items-center justify-center ">
            {/* {JSON.stringify(metadata)} */}
            {/* <SmartBarChart data={data} columns={["rate", "stock"]}/> */}
            {/* <SmartScatterChart data={data} columns={["rate", "stock"]}/> */}
            <SmartLineChart data={data} columns={["sale_date", "total_sales_amount"]}/>
          </div>
        ) : (
          <div className="bg-gray-700 text-white shadow-lg px-6 py-4 rounded-lg">
            <pre>
              {/* {formatSQL(sql_query)} */}
              {JSON.stringify(metadata, null, 4)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};