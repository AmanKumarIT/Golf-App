"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError("Invalid credentials. Access denied.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 p-10 rounded-sm border border-slate-800 bg-slate-950 shadow-2xl relative z-10 font-mono">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500" />
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">System Admin</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Restricted Access Portal</p>
        </div>

        {error && <div className="p-3 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400 text-xs tracking-wider text-center uppercase">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">Authority Identity</label>
              <Input 
                required 
                type="email" 
                placeholder="ADMIN@SYSTEM.IO" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="bg-black text-white border-slate-800 focus:border-red-500 focus:ring-red-500/20 rounded-sm uppercase placeholder:text-slate-800" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">Security Passphrase</label>
              <Input 
                required 
                type="password" 
                placeholder="•••••••••••" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="bg-black text-white border-slate-800 focus:border-red-500 focus:ring-red-500/20 rounded-sm" 
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-sm h-12 tracking-widest uppercase font-bold text-sm">
            {loading ? "Authenticating..." : "Initialize Override"}
          </Button>
        </form>
      </div>
    </div>
  );
}
