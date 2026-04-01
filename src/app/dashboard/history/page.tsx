import { History, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function HistoryPage() {
  const session = await getServerSession(authOptions) as any;
  if (!session?.user?.id) return null;

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('userId', session.user.id)
    .order('createdAt', { ascending: false });

  const rounds = scores || [];

  async function addScore(formData: FormData) {
    "use server";
    const course = formData.get("course") as string;
    const score = parseInt(formData.get("score") as string);
    const date = formData.get("date") as string;

    if (course && score && date) {
      await supabase.from('scores').insert([{
        userId: session.user.id,
        course,
        score,
        datePlayed: date
      }]);

      // Calculate simple entry logic: 1 entry per round logged
      const { data: user } = await supabase.from('users').select('entries').eq('id', session.user.id).single();
      const currentEntries = user?.entries || 0;
      await supabase.from('users').update({ entries: currentEntries + 1 }).eq('id', session.user.id);

      revalidatePath('/dashboard/history');
      revalidatePath('/dashboard');
    }
  }

  async function deleteScore(id: string) {
    "use server";
    await supabase.from('scores').delete().eq('id', id);
    // Remove the earned entry
    const { data: user } = await supabase.from('users').select('entries').eq('id', session.user.id).single();
    if (user && user.entries > 0) {
      await supabase.from('users').update({ entries: user.entries - 1 }).eq('id', session.user.id);
    }
    revalidatePath('/dashboard/history');
    revalidatePath('/dashboard');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <History className="w-8 h-8 text-primary-500" /> Score History
          </h1>
          <p className="text-slate-400 mt-2">Every round logged brings you closer to the next draw.</p>
        </div>
      </header>

      <form action={addScore} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full">
          <label className="text-xs text-slate-500 block mb-1">Course Name</label>
          <input required name="course" placeholder="e.g. Pebble Beach" className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-slate-200" />
        </div>
        <div className="w-full md:w-32">
          <label className="text-xs text-slate-500 block mb-1">Gross Score</label>
          <input required name="score" type="number" placeholder="82" className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-slate-200" />
        </div>
        <div className="w-full md:w-48">
          <label className="text-xs text-slate-500 block mb-1">Date Played</label>
          <input required name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-slate-200" />
        </div>
        <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 h-[42px] whitespace-nowrap">
          <Plus className="w-4 h-4" /> Log Score
        </button>
      </form>

      <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl overflow-hidden divide-y divide-slate-700/50">
        {rounds.map((round) => (
          <div key={round.id} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
            <div>
              <p className="text-xl font-medium text-slate-200">{round.course}</p>
              <p className="text-sm text-slate-500 mt-1">{new Date(round.datePlayed).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-bold text-3xl text-slate-100">{round.score}</p>
                <p className="text-xs text-slate-500">Gross</p>
              </div>
              <span className="text-sm font-medium text-primary-400 bg-primary-500/10 px-3 py-1.5 rounded-md hidden md:inline-block">
                +1 Entry
              </span>
              <form action={deleteScore.bind(null, round.id)}>
                <button type="submit" className="text-red-400/50 hover:text-red-400 p-2 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        ))}
        {rounds.length === 0 && (
          <div className="p-8 text-center text-slate-500">No rounds logged yet. Add your first score above!</div>
        )}
      </div>
    </div>
  );
}
