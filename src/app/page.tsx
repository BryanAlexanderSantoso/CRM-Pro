import Link from 'next/link'
import { Command, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <header className="flex items-center justify-between py-6 px-10 border-b border-gray-100">
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tighter uppercase">
          <div className="bg-black text-white p-1.5 rounded">
            <Command className="w-5 h-5" />
          </div>
          CRM Pro
        </div>
        <nav className="flex items-center gap-8">
          <Link href="/login" className="text-[13px] font-medium text-gray-500 hover:text-black transition-colors">
            Login
          </Link>
          <Link href="/login" className="text-[13px] font-medium bg-black text-white px-5 py-2 rounded shadow-sm hover:bg-gray-800 transition-all">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex flex-col flex-1 items-center justify-center text-center px-6 max-w-5xl mx-auto py-24 md:py-32">
        <div className="mb-10 inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 bg-gray-50/50">
          v2.0.4 is now available
        </div>
        
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-10 leading-[1.05] text-black">
          Precision management <br /> for modern teams.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-14 max-w-2xl leading-relaxed mx-auto">
          The essential CRM for teams that value speed and absolute clarity. Built with Next.js 16 and Supabase for the highest performance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login" className="flex items-center justify-center px-10 py-4 text-sm font-semibold rounded bg-black text-white hover:bg-gray-800 transition-all">
            Deploy your dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/login" className="flex items-center justify-center px-10 py-4 text-sm font-semibold rounded border border-gray-200 hover:bg-gray-50 transition-all">
            View Source
          </Link>
        </div>
        
        <div className="mt-40 w-full">
          <div className="flex flex-col items-center">
             <div className="h-px w-20 bg-gray-200 mb-10"></div>
             <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-12">Trusted by Engineering Teams</p>
             <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-25 grayscale hover:opacity-50 transition-opacity duration-500">
               <div className="text-xl font-bold tracking-tighter">ACME</div>
               <div className="text-xl font-bold tracking-tighter">GLOBAL</div>
               <div className="text-xl font-bold tracking-tighter">STARK</div>
               <div className="text-xl font-bold tracking-tighter">WAYNE</div>
             </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-5xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-sm tracking-tighter uppercase text-gray-400">
            <Command className="w-4 h-4" />
            CRM Pro
          </div>
          <p className="text-[11px] text-gray-400 font-medium">
            &copy; 2026 CRM Pro. All rights reserved.
          </p>
          <div className="flex gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-black">Privacy</Link>
            <Link href="#" className="hover:text-black">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
