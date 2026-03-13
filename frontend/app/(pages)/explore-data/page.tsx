import PageDescription from "@/components/ui/PageDescription";
import { authFetch } from "@/lib/api/authFetch";
import { data_status } from "@/types/ecomr_data";
import { Database, List, AlertCircle } from "lucide-react";
import Link from "next/link";

async function getStats(): Promise<data_status[]> {
  try {
    const res = await authFetch("/api/data/stats");
    if (!res.ok) {
      console.error("Failed to fetch stats, status:", res.status);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return [];
  }
}

export default async function ExploreDataPage() {
  const stats = await getStats();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <PageDescription 
        title="Explore Data" 
        description="Review your database structure and manage your data tables." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((table) => (
          <div 
            key={table.table_name}
            className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                <Database className="w-6 h-6 text-text-active" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Status
                </span>
                <span className={`text-xs font-medium ${table.error ? 'text-red-500' : 'text-green-500'}`}>
                  {table.error ? "Error" : "Live"}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <Link href={`/explore-data/${table.table_name}`} className="space-y-1">
                <h3 className="text-xl font-bold text-text-primary capitalize">
                  {table.table_name}
                </h3>
                <p className="text-sm text-text-secondary font-medium">
                  {table.error ? "Unavailable" : `${(table.row_count || 0).toLocaleString("en")} Total Records`}
                </p>
              </Link>
            </div>

            {table.error ? (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-600 leading-relaxed italic">
                  {table.error}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-semibold text-text-primary border-b border-gray-400 pb-3">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-text-active" />
                    <span>Columns Schema</span>
                  </div>
                  <span className="bg-bg-subtle px-2 py-0.5 rounded-lg text-xs">
                    {(table.columns || []).length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(table.columns || []).map((col) => (
                    <span 
                      key={col}
                      className="px-2.5 py-1 bg-bg-light border border-border rounded-lg text-[10px] font-medium text-text-secondary hover:border-text-active hover:text-text-active transition-colors cursor-default"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {stats.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-border text-center">
            <div className="p-4 bg-bg-light rounded-full mb-4">
              <Database className="w-8 h-8 text-text-secondary opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">No Table Data Found</h3>
            <p className="text-sm text-text-secondary mt-1">
              Connect your database or check if the tables are initialized.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
