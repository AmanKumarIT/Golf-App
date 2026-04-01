"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Home, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DrawExperiencePage() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [numbers, setNumbers] = useState([0, 0, 0, 0, 0]);
  const [winnerName, setWinnerName] = useState<string | null>(null);

  const startDraw = async () => {
    setIsDrawing(true);
    setComplete(false);

    try {
      const res = await fetch("/api/draw");
      const data = await res.json();
      const targetNumbers = data.ticket || [4, 8, 1, 5, 2];
      setWinnerName(data.winnerName || "Unknown Player");

      targetNumbers.forEach((target: number, index: number) => {
        setTimeout(() => {
          setNumbers(prev => {
            const newNums = [...prev];
            newNums[index] = target;
            return newNums;
          });

          if (index === targetNumbers.length - 1) {
            setTimeout(() => {
              setComplete(true);
              setIsDrawing(false);
            }, 1000); 
          }
        }, (index + 1) * 1500); 
      });
    } catch(err) {
      console.error(err);
      setIsDrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060A14] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/40 rounded-full blur-[150px] pointer-events-none" />
      {complete && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-yellow-500/20 rounded-full blur-[200px] pointer-events-none transition-all duration-1000" />
      )}

      <header className="absolute top-0 w-full z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Trophy className="w-6 h-6 text-primary-500" />
          <span className="font-bold tracking-tight">FairwayFund</span>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-300">
            <Home className="w-4 h-4" /> Exit Draw
          </Button>
        </Link>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center w-full px-6">
        <div className="text-center mb-16 h-40">
          {!isDrawing && !complete ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter shadow-black drop-shadow-lg">
                Weekly Grand Prize
              </h1>
              <p className="text-xl text-primary-300 font-medium">Bandon Dunes 4-Day Experience + $5,000</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {complete ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    <span className="font-bold tracking-widest uppercase">Winner Found</span>
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
                    Jackpot Match!
                  </h1>
                  <p className="text-2xl text-yellow-400 font-bold tracking-widest bg-yellow-900/40 inline-block px-6 py-2 rounded-full border border-yellow-500/50 shadow-lg">
                    {winnerName}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2 mt-4"
                >
                  <p className="text-xl text-primary-400 font-mono uppercase tracking-widest animate-pulse">Running Draw Engine...</p>
                  <p className="text-slate-500 text-sm font-mono">Verifying cryptography inputs. Matching ticket sequences.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 perspective-[1000px]">
          {numbers.map((num, i) => (
            <motion.div
              key={i}
              className={`w-20 h-28 md:w-32 md:h-44 rounded-2xl flex items-center justify-center text-4xl md:text-6xl font-black shadow-2xl relative border ${
                num !== 0 ? "bg-white text-slate-900 border-white shadow-[0_0_40px_rgba(255,255,255,0.3)]" : "bg-slate-900/80 text-slate-800 border-slate-700 glass"
              }`}
              initial={false}
              animate={{
                rotateX: num !== 0 ? [0, 180, 0] : 0, 
                y: num !== 0 ? [0, -20, 0] : 0
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 border border-white/20 rounded-2xl"></div>
              {num !== 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }} 
                >
                  {num}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="h-24 flex items-center justify-center">
          {!isDrawing && !complete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Button size="lg" className="px-12 h-14 text-lg font-bold uppercase tracking-widest gap-3" onClick={startDraw}>
                <Play className="w-5 h-5 fill-white" /> Initiate Draw
              </Button>
            </motion.div>
          )}
          
          {complete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Button variant="secondary" size="lg" className="px-12 h-14" onClick={() => window.location.reload()}>
                Reset Simulator
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
