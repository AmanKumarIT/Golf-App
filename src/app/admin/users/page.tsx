import { UserCog, ArrowLeftRight, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

// To make this a Server Component with dynamic data fetching:
export const revalidate = 0; // Prevent Next.js from aggressively caching this page

export default async function AdminUsersPage() {
  // Fetch real users from Supabase directly via Server Component
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error("Failed to load users:", error);
  }

  const registeredUsers = users || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 text-slate-300">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <UserCog className="w-6 h-6 text-accent-500" /> Users & Subscribers
        </h1>
        <p className="text-sm font-mono text-slate-500 mt-1">Real-time user monitoring interface.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-sm">
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
          <h2 className="font-semibold text-white flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-slate-500"/> Account Registry</h2>
          <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded-sm border border-slate-800">
            {registeredUsers.length} Total Users
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase text-slate-500 bg-black/50">
                <th className="px-4 py-3 font-semibold w-1/4">Name / ID</th>
                <th className="px-4 py-3 font-semibold w-1/4">Email Address</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Contributed</th>
                <th className="px-4 py-3 font-semibold text-right">Pool Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {registeredUsers.length > 0 ? registeredUsers.map((user) => {
                const isActive = user.subscriptionStatus === "active";
                return (
                  <tr key={user.id} className="hover:bg-slate-800/20 font-mono text-xs text-slate-300 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-white font-medium mb-1 font-sans">{user.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{user.id}</div>
                    </td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className={`flex items-center gap-1.5 ${isActive ? "text-green-400" : "text-amber-500/80"}`}>
                        {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {isActive ? "Active Premium" : "Inactive / Guest"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {user.charity ? <span className="text-secondary-400 truncate max-w-[120px] inline-block" title={user.charity}>{user.charity}</span> : "-"}
                    </td>
                    <td className="px-4 py-4 text-right font-medium">
                      <span className={user.entries > 0 ? "text-white" : "text-slate-600"}>{user.entries} entries</span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-mono text-sm">
                    No users found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
