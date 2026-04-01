import Link from "next/link";
import { ArrowLeftRight, Play, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminOverviewPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Status Overview</h1>
          <p className="text-sm font-mono text-slate-500 mt-1">v2.1.0 • Connected • Engine Alpha</p>
        </div>
        
        {/* Prominent Action Button */}
        <Link href="/draw">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-500 rounded-sm font-bold gap-2 tracking-widest w-full md:w-auto h-12 uppercase">
            <Play className="w-5 h-5 fill-white" /> Execute Draw System
          </Button>
        </Link>
      </header>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Revenue", val: "$124,500/mo", delta: "+5.2%" },
          { label: "Pool Entropy", val: "High", delta: "14.2k Entries" },
          { label: "Pending Payout", val: "$84,000", delta: "To Charities" },
          { label: "Sys Load", val: "14%", delta: "Nominal" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-sm">
            <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">{stat.label}</p>
            <div className="mt-2 text-2xl font-bold text-white">{stat.val}</div>
            <div className="mt-1 text-xs text-green-500">{stat.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Users Table (Data Dense) */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm text-sm">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <h2 className="font-semibold text-white flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-slate-500"/> Real-time Subscribers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase text-slate-500 bg-black/50">
                  <th className="px-4 py-3 font-semibold">User ID</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Pool Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  { id: "usr_948a...21x", status: "Active Premium", weight: "1.4x (14 entries)" },
                  { id: "usr_112c...89q", status: "Active Base", weight: "1.0x (4 entries)" },
                  { id: "usr_053x...lp1", status: "Payment Failed", weight: "0.0x (0 entries)", err: true },
                  { id: "usr_789d...w23", status: "Active Premium", weight: "2.1x (42 entries)" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 font-mono text-xs text-slate-300">
                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3">
                      <span className={`${row.err ? "text-red-400" : "text-green-400"}`}>
                        {row.err ? "● " : "● "} {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charities & Audit Log */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-sm text-sm">
            <div className="p-4 border-b border-slate-800 bg-slate-950">
              <h2 className="font-semibold text-white">Charity Allocation Status</h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { name: "First Tee", pct: 45, val: "$37,800" },
                { name: "PGA HOPE", pct: 30, val: "$25,200" },
                { name: "Youth on Course", pct: 25, val: "$21,000" },
              ].map((charity, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-1 text-xs">
                    <span className="text-slate-300 font-medium">{charity.name} ({charity.pct}%)</span>
                    <span className="text-slate-500 font-mono">{charity.val} allocated</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-none overflow-hidden">
                    <div className="bg-secondary-500 h-1.5" style={{ width: `${charity.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">System Alerts</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              [10:45:22] Pool signature verified. Entropy sources nominal.<br/>
              [10:42:01] 14 newly uploaded scores verified by integration engine.<br/>
              [08:12:44] Automated ACH batch submitted to Charity Processor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
