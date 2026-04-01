import { Heart, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function CharityPage() {
  const session = await getServerSession(authOptions) as any;
  if (!session?.user?.id) return null;

  // Fetch active charities
  const { data: charities } = await supabase.from('charities').select('*').eq('active', true);
  const activeCharities = charities || [];

  // Fetch user's currently selected charity
  const { data: user } = await supabase.from('users').select('charity').eq('id', session.user.id).single();
  const currentCharity = user?.charity;

  async function selectCharity(formData: FormData) {
    "use server";
    const charityName = formData.get("charityName") as string;
    if (charityName) {
      await supabase.from('users').update({ charity: charityName }).eq('id', session.user.id);
      revalidatePath('/dashboard/charity');
      revalidatePath('/dashboard');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Heart className="w-8 h-8 text-secondary-500" /> My Supported Charity
        </h1>
        <p className="text-slate-400 mt-2">Select where your subscription dividends make an impact.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input placeholder="Search verified charities..." className="pl-10 h-12 text-base w-full bg-slate-900 border border-slate-700/50 rounded-lg text-slate-200 focus:ring-secondary-500/20" />
      </div>

      <div className="grid gap-4">
        {activeCharities.map((charity) => {
          const isSelected = charity.name === currentCharity;
          return (
            <div key={charity.id} className={`border-2 transition-all p-6 rounded-xl flex items-center justify-between ${isSelected ? 'border-secondary-500 bg-secondary-900/10' : 'border-slate-800/50 bg-slate-800/20 hover:border-slate-700'}`}>
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  {charity.name}
                  {isSelected && <span className="text-xs bg-secondary-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Active Choice</span>}
                </h3>
                <p className="text-slate-400 mt-2 max-w-xl">{charity.description}</p>
              </div>
              
              <form action={selectCharity}>
                <input type="hidden" name="charityName" value={charity.name} />
                <button type="submit" disabled={isSelected} className={`px-4 py-2 rounded-lg font-medium transition-colors ${isSelected ? "text-slate-400 cursor-default" : "bg-secondary-600 hover:bg-secondary-500 text-white"}`}>
                  {isSelected ? "Supported" : "Support"}
                </button>
              </form>
            </div>
          )
        })}
        {activeCharities.length === 0 && (
          <div className="text-center p-8 text-slate-500">No active charities are currently listed by the platform admins.</div>
        )}
      </div>
    </div>
  );
}
