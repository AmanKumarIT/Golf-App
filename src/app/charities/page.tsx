import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Heart, ArrowLeft, Trophy } from "lucide-react";

export const revalidate = 60; // Cache for 60 seconds

export default async function PublicCharitiesPage() {
  const { data: charities } = await supabase.from('charities').select('*').eq('active', true).order('name');
  const activeCharities = charities || [];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-20">
      <header className="fixed top-0 w-full z-50 glass border-b border-slate-800/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold tracking-tight text-white">Fairway<span className="text-slate-400">Fund</span></span>
          </div>
          <Link href="/">
            <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary-900/20 rounded-full blur-[100px] pointer-events-none" />
            <Heart className="w-12 h-12 text-secondary-500 mx-auto" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight relative z-10 uppercase italic">Vetted Impact Partners</h1>
            <p className="text-slate-400 max-w-xl mx-auto text-lg relative z-10">
              When you join the pool, you choose exactly where your platform dividends are allocated. 100% transparent. 100% impact.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-col md:flex-row gap-2 relative z-10">
            <input 
              placeholder="Search by mission, name or keyword..." 
              className="flex-1 bg-black/40 border-none px-4 py-3 rounded-xl text-white focus:ring-1 focus:ring-secondary-500"
            />
            <div className="flex gap-2">
              <select className="bg-black/40 border-none px-4 py-3 rounded-xl text-slate-400 text-sm focus:ring-1 focus:ring-secondary-500">
                <option>All Categories</option>
                <option>Youth Golf</option>
                <option>Veterans</option>
                <option>Environment</option>
              </select>
              <button className="bg-secondary-600 hover:bg-secondary-500 text-white px-6 py-3 rounded-xl font-bold transition-all">
                Search
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {activeCharities.map((charity) => (
              <div key={charity.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:-translate-y-1 hover:border-slate-700 transition-all duration-300">
                <h3 className="text-2xl font-bold text-slate-100">{charity.name}</h3>
                <p className="text-slate-400 mt-4 leading-relaxed">{charity.description}</p>
                <div className="mt-8 pt-6 border-t border-slate-800/50">
                  <Link href="/register">
                    <button className="text-secondary-400 hover:text-secondary-300 font-medium text-sm transition-colors uppercase tracking-wider h-[42px]">
                      Select This Charity →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
            {activeCharities.length === 0 && (
              <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                Charity catalog is currently being updated. Check back soon!
              </div>
            )}
          </div>

          <div className="text-center pt-8 border-t border-slate-800/50 relative z-10">
            <p className="text-slate-400 mb-6">Ready to make every round count?</p>
            <Link href="/register">
              <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-primary-500/20 transition-all hover:scale-105">
                Join FairwayFund Today
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
