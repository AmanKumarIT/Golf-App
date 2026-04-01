"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Trophy, LayoutDashboard, History, Settings, Heart, LogOut, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const subStatus = (session as any)?.user?.subscriptionStatus;
  const isPremium = subStatus === "active";

  if (status === "loading" || status === "unauthenticated") {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  }

  const links = [
    { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { href: "/dashboard/history", icon: <History className="w-5 h-5" />, label: "Score History" },
    { href: "/dashboard/charity", icon: <Heart className="w-5 h-5" />, label: "My Charity" },
    { href: "/dashboard/settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 glass border-r-0 border-slate-800/50 flex flex-col hidden md:flex">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold tracking-tight">Fairway<span className="text-slate-400">Fund</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary-500/10 text-primary-400 font-medium' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`}
              >
                {link.icon} {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto">
          {!isPremium && (
            <Link href="/subscription" className="block bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl p-4 mb-4 transition-all shadow-lg shadow-primary-500/10 group">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-accent-300 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-tight italic">Go Premium</span>
              </div>
              <p className="text-[10px] text-primary-100/80 leading-tight">Unlock full score history, draw eligibility and multiplier control.</p>
            </Link>
          )}

          <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400 font-mono text-[10px] uppercase tracking-widest">Draw Window</span>
              <span className="text-[10px] font-bold text-accent-400">2d 14h</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1">
              <div className="bg-accent-500 h-1 rounded-full w-[70%]"></div>
            </div>
          </div>
          
          <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 cursor-pointer">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
