import { supabase } from "@/lib/supabase";
import { Heart, Calendar, Image as ImageIcon, MapPin, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CharityProfilePage({ params }: { params: { id: string } }) {
  const { data: charity } = await supabase.from('charities').select('*').eq('id', params.id).single();
  
  if (!charity) return notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <div className="h-[40vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
        <img 
          src={charity.images?.[0] || "https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&q=80"} 
          className="w-full h-full object-cover grayscale opacity-50"
          alt={charity.name}
        />
        <div className="absolute bottom-0 left-0 w-full z-20 p-8 md:p-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <Link href="/charities" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4 uppercase tracking-widest font-bold">
                <ArrowLeft className="w-4 h-4" /> Back to Directory
              </Link>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">{charity.name}</h1>
              <p className="text-secondary-400 font-mono flex items-center gap-2 tracking-widest">
                <Heart className="w-4 h-4 fill-secondary-500" /> Vetted Platform Partner
              </p>
            </div>
            <Link href="/register">
              <button className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-primary-500/20">
                Support This Cause
              </button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-8 py-16 grid lg:grid-cols-3 gap-16">
        {/* Left Column: Mission & Images */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-l-4 border-primary-500 pl-6 uppercase italic">Our Global Mission</h2>
            <p className="text-xl text-slate-400 leading-relaxed font-light italic">"{charity.mission || charity.description}"</p>
            <p className="text-slate-300 leading-relaxed">
              Every round you play contributes directly to the operational growth and field-impact of {charity.name}. We focus on transparent fund allocation to ensure maximum benefit for the causes you care about most.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 uppercase tracking-tight">
              <ImageIcon className="w-5 h-5 text-slate-500" /> Impact In Focus
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {(charity.images || []).length > 1 ? charity.images.slice(1).map((img: string, i: number) => (
                <img key={i} src={img} className="rounded-2xl border border-slate-800 hover:border-primary-500/50 transition-all cursor-crosshair h-64 w-full object-cover" />
              )) : (
                <div className="col-span-full h-48 rounded-2xl border border-dashed border-slate-800 flex items-center justify-center text-slate-600 italic">
                  Additional media documentation pending verification...
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Events & Sidebar */}
        <div className="space-y-12">
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-8">
            <h3 className="text-2xl font-bold flex items-center gap-2 uppercase italic tracking-tight">
              <Calendar className="w-5 h-5 text-accent-500" /> Upcoming Events
            </h3>
            <div className="space-y-6">
              {(charity.events || []).length > 0 ? charity.events.map((ev: any, i: number) => (
                <div key={i} className="group cursor-default">
                  <p className="text-xs font-bold text-accent-500 uppercase tracking-widest mb-1">{ev.date}</p>
                  <p className="text-md font-bold text-white group-hover:text-accent-400 transition-colors">{ev.name}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{ev.description}</p>
                </div>
              )) : (
                <p className="text-slate-500 italic text-sm">No scheduled events at this time.</p>
              )}
            </div>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors">
              Request Info Pack
            </button>
          </section>

          <section className="bg-gradient-to-br from-primary-900/20 to-slate-900 border border-primary-500/20 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <Trophy className="w-12 h-12 text-primary-500 mb-6" />
            <h3 className="text-xl font-bold uppercase italic mb-4">Make a difference today</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 italic">
              "Joining the FairwayFund pool means {charity.name} receives predictable, sustainable funding. It changes everything."
            </p>
            <Link href="/register">
              <button className="text-primary-400 font-bold uppercase tracking-widest text-xs hover:text-white flex items-center gap-2 transition-colors">
                Become a Subscriber <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

function ArrowRight(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}
