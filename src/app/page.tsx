import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, Trophy, HeartHandshake, Zap, BarChart3, Users, Globe2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 glass border-b-0 border-slate-800/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold tracking-tight">Fairway<span className="text-slate-400">Fund</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How it Works</Link>
            <Link href="/charities" className="text-slate-300 hover:text-white transition-colors">Charities</Link>
            <Link href="#impact" className="text-slate-300 hover:text-white transition-colors">Our Impact</Link>
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin/login">
              <Button variant="ghost" size="sm">Admin Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative px-6 py-32 md:py-48 overflow-hidden flex flex-col items-center text-center">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium text-primary-400 border-primary-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Over $1M raised for charities this year
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Win Big. <br />
              <span className="text-gradient">Give Back.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Join the premier golf subscription platform. Every swing counts towards a greater cause, and every draw is a chance to win exclusive luxury experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/subscription">
                <Button size="lg" className="gap-2">
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/draw">
                <Button variant="outline" size="lg" className="px-8 !border-slate-600">
                  Watch Live Draw
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Charity Spotlight */}
        <section className="container mx-auto px-6 py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <span className="text-secondary-500 font-mono text-xs font-bold uppercase tracking-[0.3em]">Featured Partner</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Impact Spotlight</h2>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center group transition-all hover:bg-slate-900/60 hover:border-slate-700">
              <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border border-slate-800 grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&q=80" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" alt="Featured Charity" />
              </div>
              <div className="w-full md:w-2/3 space-y-6">
                <h3 className="text-4xl font-bold uppercase italic tracking-tight italic">The First Tee</h3>
                <p className="text-slate-400 leading-relaxed italic font-light">"Empowering the next generation of leaders through the game of golf. Providing kids with tools to succeed academically and socially."</p>
                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Platform Allocation</p>
                    <p className="text-xl font-black text-white">$42,500+</p>
                  </div>
                  <Link href="/charities">
                    <button className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-secondary-500 transition-colors">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 bg-slate-900/50">
          <div className="container mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">The Mechanics of Impact</h2>
              <p className="text-slate-400 max-w-xl mx-auto">A seamless blend of competition, philanthropy, and exclusive rewards.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8 text-primary-500" />,
                  title: "1. Play & Track",
                  desc: "Log your golf scores and earn entries into the weekly and monthly prize draws."
                },
                {
                  icon: <HeartHandshake className="w-8 h-8 text-secondary-500" />,
                  title: "2. Support Charities",
                  desc: "Your subscription fee goes directly to your chosen vetted charity partners."
                },
                {
                  icon: <Trophy className="w-8 h-8 text-accent-500" />,
                  title: "3. Win Exclusive Prizes",
                  desc: "Watch the thrilling live digital draws to win high-end equipment and luxury trips."
                }
              ].map((step, i) => (
                <Card key={i} className="bg-slate-800/20 border-slate-700/50 hover:-translate-y-2 transition-transform duration-300">
                  <CardContent className="p-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6 shadow-inner">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-slate-400">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="impact" className="py-24 px-6 relative">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Real numbers. <br />
                  <span className="text-secondary-400">Real change.</span>
                </h2>
                <p className="text-lg text-slate-400">
                  Our community leverages their passion for golf to fund critical initiatives around the world. Transparency is our core value.
                </p>
                <div className="flex gap-4">
                  <Button variant="secondary">View Full Report</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass !bg-primary-900/10 border-primary-500/20">
                  <CardContent className="p-6">
                    <BarChart3 className="w-8 h-8 text-primary-400 mb-4" />
                    <p className="text-4xl font-bold text-slate-100">$2.4M</p>
                    <p className="text-sm text-slate-400 mt-1">Total Donated</p>
                  </CardContent>
                </Card>
                <Card className="glass !bg-secondary-900/10 border-secondary-500/20 mt-8">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 text-secondary-400 mb-4" />
                    <p className="text-4xl font-bold text-slate-100">14k+</p>
                    <p className="text-sm text-slate-400 mt-1">Active Subscribers</p>
                  </CardContent>
                </Card>
                <Card className="glass !bg-accent-900/10 border-accent-500/20 -mt-8">
                  <CardContent className="p-6">
                    <HeartHandshake className="w-8 h-8 text-accent-400 mb-4" />
                    <p className="text-4xl font-bold text-slate-100">85</p>
                    <p className="text-sm text-slate-400 mt-1">Charities Supported</p>
                  </CardContent>
                </Card>
                <Card className="glass border-slate-700/50">
                  <CardContent className="p-6">
                    <Globe2 className="w-8 h-8 text-slate-400 mb-4" />
                    <p className="text-4xl font-bold text-slate-100">12</p>
                    <p className="text-sm text-slate-400 mt-1">Countries Run In</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Trophy className="w-6 h-6" />
            <span className="font-bold tracking-tight">FairwayFund</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 FairwayFund Subscription Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
