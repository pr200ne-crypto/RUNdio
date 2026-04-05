"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Mail, Lock, Sparkles, Activity, Map } from 'lucide-react'
import Image from 'next/image'

export default function LpPattern2() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        })
        if (error) throw error
        alert('確認メールを送信しました。')
      }
      router.push('/home')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-teal-500/30">
      {/* Nav */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center">
            <Play fill="white" size={16} className="text-white ml-1" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">RUNdio</span>
        </div>
        <button
          onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-6 py-2.5 bg-white/10 text-white rounded-full text-sm font-bold hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-md"
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Neon Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8"
          >
            Your Run.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              Reimagined.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium"
          >
            AIがリアルタイムで実況する、新しいランニング体験。
            ペースに合わせて、あなただけの番組を生成します。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <button
              onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-full font-black text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto"
            >
              Start for Free
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          
          {/* Large Card */}
          <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 md:p-12 border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 text-teal-400">
                <Map size={28} />
              </div>
              <h3 className="text-3xl font-black mb-4">Smart Routing</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                距離やペース、立ち寄りたいスポットを指定するだけで、最適なルートを自動生成。いつもの街が新しいコースに変わります。
              </p>
            </div>
          </div>

          {/* Tall Card */}
          <div className="md:row-span-2 bg-gradient-to-b from-blue-600 to-blue-900 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6 text-white backdrop-blur-sm">
                <Sparkles size={28} />
              </div>
              <h3 className="text-3xl font-black mb-4 text-white">AI DJ</h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                走行データに基づき、AIがリアルタイムに実況。応援やスポット紹介など、ラジオ感覚で楽しめます。
              </p>
              <div className="mt-auto aspect-square relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                 <Image
                  src="https://images.unsplash.com/photo-1461896836934-bd45ba8fcb36?w=800&q=80"
                  alt="Running"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Small Card 1 */}
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 text-purple-400">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-slate-400">走行データを自動記録し、成長を可視化。</p>
          </div>

          {/* Small Card 2 */}
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 flex items-center justify-center">
             <div className="text-center">
               <div className="text-5xl font-black text-white mb-2">¥0</div>
               <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Free to use</div>
             </div>
          </div>

        </div>
      </section>

      {/* Auth Section */}
      <section id="auth" className="py-32 px-4 relative z-10">
        <div className="max-w-md mx-auto bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Join RUNdio'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? 'アカウントにログイン' : '無料でアカウントを作成'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-slate-600 text-xs font-bold uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-800 focus:border-teal-500 outline-none transition-all bg-slate-950 text-white placeholder:text-slate-600 font-medium"
                placeholder="Email address" required
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-800 focus:border-teal-500 outline-none transition-all bg-slate-950 text-white placeholder:text-slate-600 font-medium"
                placeholder="Password" required
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <p className="mt-8 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
              {isLogin ? 'Create an account' : 'Already have an account?'}
            </button>
          </p>
        </div>
      </section>
    </div>
  )
}
