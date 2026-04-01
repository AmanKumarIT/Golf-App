import { CheckCircle2, TrendingUp, Heart, Gift, Trophy, Upload, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function DashboardOverviewPage() {
  const session = await getServerSession(authOptions) as any;
  if (!session?.user?.id) return null;

  const { data: user } = await supabase.from('users').select('*').eq('id', session.user.id).single();
  const { data: winnings } = await supabase.from('draw_winners').select('*').eq('winnerId', session.user.id).order('createdAt', { ascending: false });
  const myWinnings = winnings || [];

  const isPremium = user?.subscriptionStatus === "active";

  async function quickScoreLog(formData: FormData) {
    "use server";
    const course = formData.get("course") as string;
    const score = parseInt(formData.get("score") as string);
    const date = new Date().toISOString().split('T')[0];

    if (course && score && session?.user?.id) {
      await supabase.from('scores').insert([{ userId: session.user.id, course, score, datePlayed: date }]);
      const currentEntries = user?.entries || 0;
      await supabase.from('users').update({ entries: currentEntries + 1 }).eq('id', session.user.id);
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/history');
    }
  }

  async function uploadProof(formData: FormData) {
    "use server";
    const drawId = formData.get("drawId") as string;
    const proofUrl = formData.get("proofUrl") as string;
    if (drawId && proofUrl) {
      await supabase.from('draw_winners').update({ proofUrl }).eq('id', drawId);
      revalidatePath('/dashboard');
      revalidatePath('/admin/winners');
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Player"}.</h1>
          <p className="text-slate-400">Here's your impact and performance overview.</p>
        </div>
        <a href="/dashboard/history" className="hidden md:flex gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <TrendingUp className="w-4 h-4" /> Score History Log
        </a>
      </header>

      {/* Top Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Subscription Status</p>
            <p className={`text-xl font-bold ${isPremium ? "text-green-400" : "text-slate-100"}`}>
              {isPremium ? (user?.planType === "yearly" ? "Annual Member" : "Monthly Member") : "Standard Access"}
            </p>
            {isPremium && <p className="text-[10px] text-slate-500 uppercase mt-1">Renews: {new Date(user?.renewalDate).toLocaleDateString()}</p>}
          </div>
        </div>

        <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-500/10 flex items-center justify-center border border-secondary-500/20">
            <Heart className="w-6 h-6 text-secondary-500" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Charity Support ({user?.charityPercentage || 10}%)</p>
            <p className="text-xl font-bold text-slate-100 truncate max-w-[150px]">{user?.charity || "None Selected"}</p>
            <p className="text-[10px] text-slate-500 uppercase mt-1">Based on Net Subscription</p>
          </div>
        </div>

        <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl block pointer-events-none" />
          <div className="p-6 flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-accent-500/10 flex items-center justify-center border border-accent-500/20">
              <Gift className="w-6 h-6 text-accent-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Participation</p>
              <p className="text-xl font-bold text-slate-100">{user?.entries || 0} Entries</p>
              <p className="text-[10px] text-slate-500 uppercase mt-1">Next Draw: 24h 12m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="w-5 h-5 text-accent-500"/> Winnings Overview</h2>
            <div className="flex gap-4 text-xs font-mono">
              <span className="text-slate-500">Total Won: <span className="text-white">${myWinnings.reduce((acc: number, curr: any) => acc + (curr.amount_won || 0), 0).toFixed(2)}</span></span>
            </div>
          </div>
          
          <div className="space-y-4">
            {myWinnings.map((w) => (
              <div key={w.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-accent-500/30 transition-all">
                <div className="flex gap-4 items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${w.tier === 5 ? 'bg-accent-500/20 text-accent-400' : 'bg-slate-700/30 text-slate-400'}`}>
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{new Date(w.createdAt).toLocaleDateString()} • Tier {w.tier || 5}</p>
                    <p className="text-lg font-bold text-white">{w.prize}</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">Ticket Match: {w.ticketNumber}</p>
                  </div>
                </div>
                
                <div className="bg-slate-900 border border-slate-700/50 p-4 rounded-xl w-full sm:w-auto self-stretch flex items-center justify-center min-w-[140px]">
                  {w.payout_status === "paid" ? (
                    <div className="flex flex-col items-center justify-center h-full text-green-400 text-xs font-bold uppercase tracking-widest">
                      <Check className="w-5 h-5 mb-1" />
                      Paid
                    </div>
                  ) : w.status === "verified" ? (
                    <div className="flex flex-col items-center justify-center h-full text-blue-400 text-xs font-bold uppercase tracking-widest">
                      Processing<br/><span className="text-[10px] font-normal text-slate-500 italic lowercase mt-1">Funds being released</span>
                    </div>
                  ) : w.proofUrl ? (
                    <div className="flex flex-col items-center justify-center h-full text-amber-500 text-xs font-bold uppercase tracking-widest text-center">
                      Reviewing<br/><span className="text-[10px] font-normal text-slate-500 lowercase mt-1">Pending admin check</span>
                    </div>
                  ) : (
                    <form action={uploadProof} className="flex flex-col gap-2 w-full">
                      <input type="hidden" name="drawId" value={w.id} />
                      <input required name="proofUrl" type="url" placeholder="Paste proof URL" className="w-full bg-black border border-slate-700 p-2 text-[10px] rounded text-slate-200 focus:border-accent-500" />
                      <button type="submit" className="w-full bg-slate-100 hover:bg-white text-black py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors">
                        Claim Prize
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
            {myWinnings.length === 0 && (
              <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center italic">
                <Gift className="w-12 h-12 text-slate-800 mb-4" />
                <p>No wins recorded yet. Keep entering scores to increase your impact!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <h2 className="text-xl font-bold uppercase italic">Quick Action</h2>
          <form action={quickScoreLog} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Round Location</label>
                <input required name="course" placeholder="e.g. ST ANDREWS LINKS" className="w-full bg-black border border-slate-800 p-3 rounded-xl text-slate-200 text-sm focus:border-primary-500 focus:ring-0" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Gross Score</label>
                <input required name="score" type="number" placeholder="72" className="w-full bg-black border border-slate-800 p-3 rounded-xl text-slate-200 text-sm focus:border-primary-500 focus:ring-0" />
              </div>
            </div>
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-500/20">
              Log Score & Enter Draw
            </button>
            <p className="text-[10px] text-center text-slate-600 italic">Scores are verified against platform integration before final draw.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
