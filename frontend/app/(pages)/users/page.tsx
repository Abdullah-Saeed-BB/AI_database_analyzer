import { authFetch } from "@/lib/api/authFetch";
import { notFound, redirect } from "next/navigation";
import PageDescription from "@/components/ui/PageDescription";
import { Users, Mail, Calendar, Search } from "lucide-react";
import User from "@/types/user";

async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await authFetch("/api/users/me");
    if (res.status === 401) return null;
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getAllUsers(): Promise<User[]> {
  try {
    const res = await authFetch("/api/users/");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-red-50 text-red-600 border-red-100",
    manager: "bg-indigo-50 text-indigo-600 border-indigo-100",
    employee: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${styles[role.toLowerCase()] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
      {role}
    </span>
  );
}

export default async function UsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "admin") {
    notFound();
  }

  const users = await getAllUsers();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto anime-fade-in">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anime-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <PageDescription 
          title="User Management" 
          description="View and manage all registered users in the system." 
        />
        
        <div className="px-6 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-5 w-max">
            <span className="text-sm text-text-secondary">TOTAL USERS:</span>
            <span className="text-lg text-text-primary">{users.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-400 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-400">
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Last Login</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr 
                  key={user.id}
                  className="hover:bg-blue-50/30 transition-colors duration-200 group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center text-blue-600 font-bold border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-tight">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{formatDate(user.last_login_at)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <code className="text-[10px] bg-gray-50 px-2 py-1 rounded-lg border border-gray-200 text-gray-400 font-mono">
                      {user.id.substring(0, 8)}...
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No users found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2 font-medium">
              We couldn't find any user records in the system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
