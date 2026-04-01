import { Gift, ShieldCheck, CheckSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function AdminWinnersPage() {
  const { data: winners } = await supabase.from('draw_winners').select('*').order('createdAt', { ascending: false });
  const winnerList = winners || [];

  async function verifyWinner(id: string) {
    "use server";
    await supabase.from('draw_winners').update({ status: 'verified' }).eq('id', id);
    revalidatePath('/admin/winners');
  }

  async function authorizePayout(id: string) {
    "use server";
    await supabase.from('draw_winners').update({ payout_status: 'paid' }).eq('id', id);
    revalidatePath('/admin/winners');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 text-slate-300">
      <header>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          Audit & Compliance
        </h1>
        <p className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-widest">Verify subscriber integrity and authorize fiscal distributions.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 font-bold text-white flex items-center gap-2 uppercase italic text-sm tracking-widest">
          <ShieldCheck className="w-4 h-4 text-primary-500" /> Distribution Ledger
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-black/80 text-[10px] uppercase text-slate-500 font-black">
              <tr>
                <th className="px-6 py-4 tracking-widest">Sequence</th>
                <th className="px-6 py-4 tracking-widest">Subject</th>
                <th className="px-6 py-4 tracking-widest text-center">Tier</th>
                <th className="px-6 py-4 tracking-widest text-right">Value</th>
                <th className="px-6 py-4 tracking-widest">Evidence</th>
                <th className="px-6 py-4 tracking-widest">Verification</th>
                <th className="px-6 py-4 tracking-widest text-right">Fiscal Authorization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono">
              {winnerList.map((w) => {
                const isVerified = w.status === 'verified';
                const isPaid = w.payout_status === 'paid';
                return (
                  <tr key={w.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5 text-slate-500">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-white font-sans font-bold">{w.winnerName}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2 py-1 rounded ${w.tier === 5 ? 'bg-accent-500/10 text-accent-400' : 'bg-slate-800 text-slate-400'}`}>
                        L{w.tier || 5}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right text-white font-bold">${(w.amount_won || 0).toFixed(2)}</td>
                    <td className="px-6 py-5">
                      {w.proofUrl ? (
                        <a href={w.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform tracking-tight font-sans text-xs">
                          Launch Media <ArrowRight className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-700 italic">No Evidence</span>
                      )}
                    </td>
                    <td className="px-6 py-5 uppercase font-black text-[10px] tracking-widest">
                      <span className={isVerified ? "text-green-500" : (w.proofUrl ? "text-amber-500" : "text-slate-600")}>
                        {isVerified ? "Secured" : (w.proofUrl ? "Pending" : "Awaiting")}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {isPaid ? (
                        <span className="text-white bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">Distributed</span>
                      ) : isVerified ? (
                        <form action={authorizePayout.bind(null, w.id)}>
                          <button type="submit" className="text-[10px] bg-green-600 hover:bg-green-500 text-white px-4 py-2 font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-500/10">
                            Authorize Payout
                          </button>
                        </form>
                      ) : w.proofUrl ? (
                        <form action={verifyWinner.bind(null, w.id)}>
                          <button type="submit" className="text-[10px] bg-slate-100 hover:bg-white text-black px-4 py-2 font-black uppercase tracking-widest rounded-xl transition-all">
                            Verify Proof
                          </button>
                        </form>
                      ) : (
                        <span className="text-slate-700 italic">None</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {winnerList.length === 0 && (
                <tr><td colSpan={7} className="p-12 text-center text-slate-700 text-xs uppercase tracking-widest italic font-bold">No distribution records found in ledger.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}
