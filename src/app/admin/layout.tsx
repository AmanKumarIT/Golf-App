"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { CopyPlus, Activity, Database, Gift, Server, UserCog, Settings2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return; // Let the login page render

    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      // If they are logged in as a typical user but trying to reach Admin area,
      // send them to the Admin Login so they can use the Admin credentials.
      router.push("/admin/login"); 
    }
  }, [status, session, router, pathname]);

  if (pathname === "/admin/login") {
    // Return pure children for the login page without the sidebar layout
    return <>{children}</>;
  }

  if (status === "loading" || session?.user?.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center bg-black text-slate-500 font-mono">Initializing Secure Environment...</div>;
  }

  const navItems = [
    { href: "/admin", icon: <Activity className="w-5 h-5" />, label: "Overview" },
    { href: "/admin/users", icon: <UserCog className="w-5 h-5" />, label: "Users & Subs" },
    { href: "/admin/charities", icon: <Database className="w-5 h-5" />, label: "Charities DB" },
    { href: "/admin/draws", icon: <CopyPlus className="w-5 h-5" />, label: "Draws Engine" },
    { href: "/admin/winners", icon: <Gift className="w-5 h-5" />, label: "Audit Log" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-slate-300">
      <aside className="w-16 md:w-64 border-r border-slate-800 bg-slate-950 flex flex-col">
        <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-center md:justify-start gap-2">
          <Server className="w-6 h-6 text-accent-500" />
          <span className="hidden md:inline text-lg font-bold tracking-tight text-white">System<span className="text-slate-500">Admin</span></span>
        </div>
        
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 md:px-6 py-3 cursor-pointer transition-colors border-l-2 ${isActive ? "border-accent-500 text-white bg-accent-500/10" : "border-transparent text-slate-400 hover:bg-slate-900"}`}
              >
                {item.icon}
                <span className="hidden md:inline font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 md:p-6 border-t border-slate-800">
          <Link href="/dashboard" className="flex justify-center md:justify-start items-center gap-3 text-sm text-slate-500 hover:text-white transition-colors">
            <Settings2 className="w-5 h-5" />
            <span className="hidden md:inline">Return to Hub</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
