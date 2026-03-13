"use client";

import { useEffect, useState, use } from 'react';
import { authFetchClient } from "@/lib/api/authFetchClient";
import { table_data } from "@/types/ecomr_data";
import { ArrowLeft, ChevronDown, RefreshCw, Table as TableIcon, Loader2, Database } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ table: string }>;
}

export default function DataDetails({ params }: PageProps) {
  const { table: tableName } = use(params);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const limit = 25;

  const fetchData = async (currentOffset: number, isInitial: boolean = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await authFetchClient(`/api/data/${tableName}?offset=${currentOffset}&limit=${limit}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }
      const result: table_data = await res.json();
      
      if (isInitial) {
        setData(result.data);
        setTotal(result.total);
      } else {
        setData(prev => [...prev, ...result.data]);
      }
      setOffset(currentOffset + limit);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData(0, true);
  }, [tableName]);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  if (loading && data.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-text-active animate-spin mb-4" />
        <p className="text-text-secondary font-medium italic">Preparing your data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Link 
            href="/explore-data" 
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-active transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Tables
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <TableIcon className="w-6 h-6 text-text-active" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary capitalize">{tableName} Data</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tight">Total Records</span>
              <span className="text-sm font-bold text-text-primary">{total.toLocaleString()}</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tight">Displayed</span>
              <span className="text-sm font-bold text-text-primary">{data.length.toLocaleString()}</span>
            </div>
          </div>
          <button 
            onClick={() => fetchData(0, true)}
            className="p-3 bg-white hover:bg-bg-light border border-border rounded-2xl shadow-sm transition-all hover:shadow-md text-text-secondary hover:text-text-active"
            title="Refresh Table"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-text-active' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Database className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-red-700">Unable to fetch table data</h3>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
          <button 
            onClick={() => fetchData(0, true)}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-light border-b border-border">
                    {columns.map((col) => (
                      <th 
                        key={col} 
                        className="px-6 py-4 text-[11px] font-extrabold text-text-secondary uppercase tracking-widest whitespace-nowrap"
                      >
                        {col.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.map((row, i) => (
                    <tr 
                      key={i} 
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {columns.map((col) => (
                        <td 
                          key={`${i}-${col}`} 
                          className="px-6 py-4 text-sm font-medium text-text-primary group-hover:text-text-active transition-colors"
                        >
                          {row[col]?.toString() || <span className="text-text-secondary italic opacity-50">null</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.length === 0 && !loading && (
              <div className="p-20 text-center space-y-3">
                <TableIcon className="w-12 h-12 text-text-secondary mx-auto opacity-20" />
                <p className="text-text-secondary font-medium">This table appears to be empty.</p>
              </div>
            )}
          </div>

          {data.length < total && (
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={() => fetchData(offset)}
                disabled={loadingMore}
                className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-text-active text-text-primary hover:text-white border-2 border-border hover:border-text-active rounded-2xl font-bold transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading More...</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    <span>Load More Records</span>
                    <span className="text-xs opacity-60 ml-2">
                       ({total - data.length} remaining)
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}