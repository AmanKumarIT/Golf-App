import { Database, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function AdminCharitiesPage() {
  const { data: charities } = await supabase.from('charities').select('*').order('name');
  const charityList = charities || [];

  async function addCharity(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    
    if (name) {
      await supabase.from('charities').insert([{ name, description, active: true }]);
      revalidatePath('/admin/charities');
    }
  }

  async function toggleCharityStatus(id: string, currentStatus: boolean) {
    "use server";
    await supabase.from('charities').update({ active: !currentStatus }).eq('id', id);
    revalidatePath('/admin/charities');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 text-slate-300">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-accent-500" /> Charities DB
          </h1>
          <p className="text-sm font-mono text-slate-500 mt-1">Manage platform vetted charities.</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 font-semibold text-white">Active Organizations</div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Charity Name</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {charityList.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/20 font-mono text-sm tracking-tight text-slate-300">
                  <td className="px-4 py-3">
                    <div className="text-white font-sans font-medium">{c.name}</div>
                    {c.description && <div className="text-xs text-slate-500 mt-1 truncate max-w-[300px]">{c.description}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={c.active ? "text-green-500" : "text-slate-500"}>{c.active ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={toggleCharityStatus.bind(null, c.id, c.active)}>
                      <button type="submit" className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded">
                        Toggle
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {charityList.length === 0 && (
                <tr><td colSpan={3} className="p-4 text-center text-slate-500 text-xs text-mono">No charities exist in database.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <form action={addCharity} className="bg-slate-900 border border-slate-800 rounded-sm p-6 space-y-4 font-mono text-sm">
            <h2 className="font-semibold text-white font-sans text-base">Add New Charity</h2>
            <div>
              <label className="block text-slate-500 text-xs mb-1 uppercase tracking-tight">Organization Name</label>
              <input name="name" required className="w-full bg-black border border-slate-800 p-2 rounded text-white" />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1 uppercase tracking-tight">Short Description</label>
              <textarea name="description" className="w-full bg-black border border-slate-800 p-2 rounded text-white min-h-[80px]" />
            </div>
            <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white font-bold tracking-widest uppercase p-2 rounded flex justify-center items-center gap-2">
              <Plus className="w-4 h-4" /> Add Charity
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
