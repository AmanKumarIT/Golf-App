import { CopyPlus, Play, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function AdminDrawsPage() {
  const { data: draws } = await supabase.from('draw_winners').select('*').order('createdAt', { ascending: false });
  const { data: poolData } = await supabase.from('prize_pools').select('*').limit(1).single();
  const { data: activeUsers } = await supabase.from('users').select('id').eq('subscriptionStatus', 'active');
  const { data: eligibleUsers } = await supabase.from('users').select('id').eq('subscriptionStatus', 'active').gt('entries', 0);
  
  const drawList = draws || [];

  async function executeDraw() {
    "use server";
    
    // 1. Fetch Current State
    const { data: poolData } = await supabase.from('prize_pools').select('*').limit(1).single();
    const { data: activeUsers } = await supabase.from('users').select('id').eq('subscriptionStatus', 'active');
    const { data: eligibleUsers } = await supabase.from('users').select('*').eq('subscriptionStatus', 'active').gt('entries', 0);
    
    if (!poolData || !activeUsers || !eligibleUsers || eligibleUsers.length === 0) return;

    // 2. Calculate Global Pool (20% share of $29 avg sub)
    const currentPoolTotal = activeUsers.length * 29 * 0.20;
    const tier5Pool = (currentPoolTotal * 0.40) + (poolData.tier_5_rollover || 0);
    const tier4Pool = (currentPoolTotal * 0.35);
    const tier3Pool = (currentPoolTotal * 0.25);

    // 3. Generate Winning Ticket
    const winningTicket = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("");
    const winners: { userId: string, name: string, tier: number, ticket: string }[] = [];

    // 4. Match Entries
    eligibleUsers.forEach(user => {
      for (let i = 0; i < user.entries; i++) {
        const userTicket = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("");
        let matches = 0;
        for (let j = 0; j < 5; j++) if (userTicket[j] === winningTicket[j]) matches++;
        if (matches >= 3) winners.push({ userId: user.id, name: user.name, tier: matches, ticket: userTicket });
      }
    });

    // 5. Payouts
    const t5w = winners.filter(w => w.tier === 5);
    const t4w = winners.filter(w => w.tier === 4);
    const t3w = winners.filter(w => w.tier === 3);

    let nextRollover = 0;
    if (t5w.length > 0) {
      const split = tier5Pool / t5w.length;
      for (const w of t5w) await supabase.from('draw_winners').insert([{ prize: `Jackpot Split: $${split.toFixed(2)}`, amount_won: split, tier: 5, winnerId: w.userId, winnerName: w.name, ticketNumber: w.ticket }]);
    } else {
      nextRollover = tier5Pool; // Entire tier 5 share rolls over
    }

    if (t4w.length > 0) {
      const split = tier4Pool / t4w.length;
      for (const w of t4w) await supabase.from('draw_winners').insert([{ prize: `Tier 4: $${split.toFixed(2)}`, amount_won: split, tier: 4, winnerId: w.userId, winnerName: w.name, ticketNumber: w.ticket }]);
    }

    if (t3w.length > 0) {
      const split = tier3Pool / t3w.length;
      for (const w of t3w) await supabase.from('draw_winners').insert([{ prize: `Tier 3: $${split.toFixed(2)}`, amount_won: split, tier: 3, winnerId: w.userId, winnerName: w.name, ticketNumber: w.ticket }]);
    }

    // 6. Finalize
    await supabase.from('prize_pools').update({ tier_5_rollover: nextRollover, last_updated: new Date().toISOString() }).eq('id', poolData.id);
    await supabase.from('users').update({ entries: 0 }).eq('subscriptionStatus', 'active');
    revalidatePath('/admin/draws');
    revalidatePath('/admin/winners');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 text-slate-300">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <CopyPlus className="w-6 h-6 text-accent-500" /> Draws Engine
        </h1>
        <p className="text-sm font-mono text-slate-500 mt-1">Configure and execute prize distributions.</p>
      </header>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 space-y-4 font-mono text-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />
            <h2 className="font-semibold text-white font-sans text-base">Estimated Prize Pool</h2>
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between">
                <span className="text-slate-500">Tier 5 (Jackpot)</span>
                <span className="text-accent-400 font-bold">${((activeUsers?.length || 0) * 29 * 0.20 * 0.40 + (poolData?.tier_5_rollover || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tier 4 (4-Match)</span>
                <span className="text-slate-300">${((activeUsers?.length || 0) * 29 * 0.20 * 0.35).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tier 3 (3-Match)</span>
                <span className="text-slate-300">${((activeUsers?.length || 0) * 29 * 0.20 * 0.25).toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between text-xs">
                <span className="text-slate-500 italic">Eligible Entrants</span>
                <span className="text-white">{eligibleUsers?.length || 0}</span>
              </div>
            </div>
            <form action={executeDraw}>
              <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white font-bold tracking-widest uppercase p-3 rounded flex justify-center items-center gap-2 mt-4 relative z-10 transition-transform active:scale-95">
                <Play className="w-4 h-4 fill-white" /> Execute Draw Protocol
              </button>
            </form>
            <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider mt-4">Calculated from {activeUsers?.length || 0} active subscribers.</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 font-semibold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent-500" /> Historical Draws
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Prize</th>
                <th className="px-4 py-3 font-semibold">Recipient</th>
                <th className="px-4 py-3 font-semibold text-right">Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {drawList.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/20 font-mono text-sm tracking-tight text-slate-300">
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><div className="text-white font-sans font-medium">{d.prize}</div></td>
                  <td className="px-4 py-3">{d.winnerName}</td>
                  <td className="px-4 py-3 text-right text-accent-400 font-bold">{d.ticketNumber}</td>
                </tr>
              ))}
              {drawList.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-slate-500 text-xs text-mono">No draw history records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
