"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User, Bell, Shield, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/lp");
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50 text-slate-800 relative pb-20">
      <header className="p-4 flex items-center justify-center bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <h1 className="font-black text-lg tracking-tight">設定</h1>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Account Section */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">アカウント</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User size={20} />
                </div>
                <span className="font-bold text-slate-700">プロフィール編集</span>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>
            <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <span className="font-bold text-slate-700">通知設定</span>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <span className="font-bold text-slate-700">プライバシーとセキュリティ</span>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>
          </div>
        </section>

        {/* Action Section */}
        <section>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mt-8">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 p-4 text-red-600 font-bold hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              ログアウト
            </button>
          </div>
        </section>

        <div className="text-center pt-8">
          <p className="text-xs font-bold text-slate-400">RUNdio v0.2.0</p>
        </div>
      </div>
    </main>
  );
}
