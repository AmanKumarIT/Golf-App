import { CreditCard, Check, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions) as any;
  if (!session?.user?.id) return redirect("/login");

  const { data: charities } = await supabase.from('charities').select('*').eq('active', true);
  const { data: user } = await supabase.from('users').select('*').eq('id', session.user.id).single();

  async function handleSubscribe(formData: FormData) {
    "use server";
    const plan = formData.get("plan") as string;
    const charity = formData.get("charity") as string;
    const userId = formData.get("userId") as string;

    const renewalDate = new Date();
    if (plan === "monthly") {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    await supabase.from('users').update({
      subscriptionStatus: 'active',
      planType: plan,
      renewalDate: renewalDate.toISOString(),
      charity: charity,
      charityPercentage: 10, // Default 10%
      entries: 10 // Bonus entries on sub
    }).eq('id', userId);

    revalidatePath('/dashboard');
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-slate-950 to-slate-950">
      <div className="max-w-4xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Choose Your Impact</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Select a plan to unlock full platform access and start contributing to your chosen cause.</p>
        </div>

        <form action={handleSubscribe} className="space-y-12">
          <input type="hidden" name="userId" value={session.user.id} />
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Plan */}
            <div className="relative group">
              <input type="radio" name="plan" value="monthly" id="plan-monthly" className="absolute opacity-0" defaultChecked />
              <label htmlFor="plan-monthly" className="block border-2 border-slate-800 bg-slate-900/50 rounded-2xl p-8 cursor-pointer transition-all hover:border-primary-500 peer-checked:border-primary-500 peer-checked:bg-primary-500/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Monthly</h3>
                    <p className="text-slate-400 text-sm">Flexible contribution</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black">$29</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500" /> Full Access to Scores</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500" /> Weekly Draw Eligibility</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500" /> 10% Minimal Charity</li>
                </ul>
              </label>
            </div>

            {/* Yearly Plan */}
            <div className="relative group">
              <input type="radio" name="plan" value="yearly" id="plan-yearly" className="absolute opacity-0" />
              <label htmlFor="plan-yearly" className="block border-2 border-slate-800 bg-slate-900/50 rounded-2xl p-8 cursor-pointer transition-all hover:border-accent-500 peer-checked:border-accent-500 peer-checked:bg-accent-500/5">
                <div className="absolute -top-3 right-8 bg-accent-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Best Value</div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Yearly</h3>
                    <p className="text-slate-400 text-sm">Annual commitment</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black">$290</span>
                    <span className="text-slate-500">/yr</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-500" /> Everything in Monthly</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-500" /> 2 Months Free</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-500" /> Exclusive Early Access</li>
                </ul>
              </label>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><Heart className="w-5 h-5 text-secondary-500" /> Select Your Primary Charity</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {charities?.map((c) => (
                <div key={c.id} className="relative">
                  <input type="radio" name="charity" value={c.name} id={`charity-${c.id}`} className="absolute opacity-0" required />
                  <label htmlFor={`charity-${c.id}`} className="block border border-slate-800 bg-black/40 rounded-xl p-4 text-sm cursor-pointer transition-all hover:border-secondary-500 peer-checked:border-secondary-500 peer-checked:bg-secondary-500/10">
                    <p className="font-bold">{c.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">Verified Partner</p>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button type="submit" className="w-full bg-slate-100 hover:bg-white text-black h-16 rounded-2xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              <ShieldCheck className="w-6 h-6" /> Complete Secure Gateway <ArrowRight className="w-6 h-6" />
            </button>
            <div className="text-center">
              <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 text-xs uppercase tracking-widest font-bold transition-colors">
                Skip for now & browse platform
              </Link>
            </div>
          </div>
        </form>

        <p className="text-center text-slate-500 text-xs uppercase tracking-widest">Dummy Gateway Simulation Mode • No Real Charges Applied</p>
      </div>
    </div>
  );
}
