import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCircle2, Music, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/checkout/success')({
  component: SuccessPage,
})

function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F1E8] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0c0c0c] border border-[#C6A15B]/30 p-12 text-center shadow-2xl"
      >
        <div className="flex justify-center mb-8 text-[#C6A15B]">
          <CheckCircle2 size={80} />
        </div>
        
        <h1 className="text-4xl font-serif mb-4 italic">Payment Received</h1>
        <p className="text-[#C6A15B]/60 uppercase tracking-[0.2em] text-[10px] font-bold mb-8 font-sans">Kingston Studio Direct</p>
        
        <div className="space-y-6 text-sm text-white/60 font-sans leading-relaxed mb-12">
          <p>
            Your transaction has been finalized. 100% of the proceeds have been directed to the artist's account.
          </p>
          <p>
            Check your inbox for a secure link to download your high-fidelity master audio files.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            to="/" 
            className="bg-[#C6A15B] text-black py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-[#D4B57A] transition-all flex items-center justify-center gap-2"
          >
            RETURN TO GALLERY <ArrowRight size={14} />
          </Link>
          
          <div className="flex items-center justify-center gap-2 opacity-20 mt-4">
            <Music size={12} />
            <span className="text-[8px] uppercase tracking-widest font-bold">Tenshon Music Group</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
