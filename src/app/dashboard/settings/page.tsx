import { Settings, CreditCard, User, Mail, Save, Heart } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function SettingsPage() {
  const session = await getServerSession(authOptions) as any;
  if (!session?.user?.id) return null;

  const { data: user } = await supabase.from('users').select('*').eq('id', session.user.id).single();

  async function updateProfile(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const charityPercentage = parseInt(formData.get("charityPercentage") as string);
    if (session?.user?.id) {
      await supabase.from('users').update({ name, charityPercentage }).eq('id', session.user.id);
      revalidatePath('/dashboard/settings');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            System Config
          </h1>
          <p className="text-slate-500 mt-2 font-mono text-xs uppercase tracking-widest">Adjust your impact and profile parameters.</p>
        </div>
      </header>

      <form action={updateProfile} className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-8 space-y-8">
          <h2 className="text-xl font-bold flex items-center gap-3 uppercase italic border-b border-slate-800 pb-4">
            <User className="w-5 h-5 text-primary-500" /> Identity
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Display name</label>
              <input 
                name="name" 
                defaultValue={user?.name || ""} 
                className="w-full bg-black border border-slate-800 p-3 rounded-xl text-slate-200 text-sm focus:border-primary-500 font-bold" 
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Email Address</label>
              <input 
                disabled 
                value={user?.email || ""} 
                className="w-full bg-black/40 border border-slate-800/50 p-3 rounded-xl text-slate-600 text-sm cursor-not-allowed italic" 
              />
            </div>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-slate-100 hover:bg-white text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-white/5">
            <Save className="w-4 h-4" /> Save Identity
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-3 uppercase italic border-b border-slate-800 pb-4">
              <Heart className="w-5 h-5 text-secondary-500" /> Impact Multiplier
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Allocated Portion</label>
                <span className="text-2xl font-black text-secondary-400 font-mono tracking-tighter">{user?.charityPercentage || 10}%</span>
              </div>
              <input 
                type="range" 
                name="charityPercentage" 
                min="10" 
                max="100" 
                step="5" 
                defaultValue={user?.charityPercentage || 10}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-secondary-500" 
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                <span>Min (10%)</span>
                <span>Max (100%)</span>
              </div>
              <div className="p-4 bg-secondary-900/10 border border-secondary-500/20 rounded-2xl">
                <p className="text-[10px] text-secondary-300 leading-relaxed italic">
                  Increasing this multiplier directly boosts the net donation amount from your subscription to {user?.charity || "your selected charity"}.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3 uppercase italic border-b border-slate-800 pb-4">
              <CreditCard className="w-5 h-5 text-accent-500" /> Plan Strategy
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Level</p>
                <p className="font-black text-white uppercase italic">{user?.planType || "None"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Status</p>
                <p className={`font-black uppercase italic ${user?.subscriptionStatus === 'active' ? 'text-green-500' : 'text-red-500'}`}>{user?.subscriptionStatus || "Inactive"}</p>
              </div>
              <Link href="/subscription" className="block text-center bg-accent-600 hover:bg-accent-500 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all">
                Manage Subscription
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
